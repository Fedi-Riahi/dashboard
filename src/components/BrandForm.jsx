"use client";
import React, { useState, useRef } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";

const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const BrandForm = () => {
  const [name, setName] = useState("");
  const [models, setModels] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [generatedId, setGeneratedId] = useState("");
  const imageUploadRef = useRef(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    try {
      const selectedFiles = e.target.files;
      const newGeneratedId = generateUniqueId();
      setGeneratedId(newGeneratedId);

      const newFiles = Array.from(selectedFiles).map((file) => ({
        file,
        folderId: newGeneratedId,
      }));

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    } catch (error) {
      console.error("Error handling file change:", error);
    }
  };

  const handleDeleteImage = (index) => {
    try {
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const modelsArray = models.split(",").map((model) => model.trim());
      if (!name) {
        throw new Error("Brand Name is required");
      }

      if (files.length === 0) {
        throw new Error("At least one image is required");
      }

      const uploadedImageUrls = await Promise.all(
        files.map(async (fileData) => {
          const uploadTaskSnapshot = await uploadImageToStorage(
            fileData.file,
            fileData.folderId
          );
          return getDownloadURL(uploadTaskSnapshot.ref);
        })
      );

      const formData = {
        name,
        models: modelsArray,
        coverImages: uploadedImageUrls,
        folderId: generatedId,
      };

      await saveFormDataToMongoDB(formData);

      setName("");
      setModels("");
      setFiles([]);
      imageUploadRef.current.value = "";

      setMessage("Data saved successfully.");
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.message || "An error occurred while saving data.");
      setLoading(false);
    }
  };

  const uploadImageToStorage = async (file, folderId) => {
    const storageRef = ref(storage, `images/${folderId}/${file.name}`);
    return uploadBytesResumable(storageRef, file);
  };

  const saveFormDataToMongoDB = async (formData) => {
    const response = await fetch("http://localhost:3000/api/carbrand", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to save data to MongoDB");
    }

    return response.json();
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit} className="">
        <div className="mb-4">
          <label
            htmlFor="brandName"
            className="block text-sm font-medium text-gray-700"
          >
            Brand Name:
          </label>
          <input
            id="brandName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="models"
            className="block text-sm font-medium text-gray-700"
          >
            Models (comma separated):
          </label>
          <input
            id="models"
            type="text"
            value={models}
            onChange={(e) => setModels(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="imageUpload"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Images:
          </label>
          <input
            ref={imageUploadRef}
            id="imageUpload"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        <div className="flex flex-wrap">
          {files.map((fileData, index) => (
            <div key={index} className="relative mr-4 mb-4">
              <Image
                src={URL.createObjectURL(fileData.file)}
                alt={`Uploaded ${index}`}
                className="mb-2 rounded-lg"
                style={{ width: "150px", height: "150px" }}
                width={150}
                height={150}
              />
              <button
                onClick={() => handleDeleteImage(index)}
                className="absolute top-0 right-0 p-1 bg-white rounded-full text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.293 5.293a1 1 0 011.414 1.414L11.414 12l4.293 4.293a1 1 0 01-1.414 1.414L10 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 12 4.293 7.707a1 1 0 111.414-1.414L10 10.586l4.293-4.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
        {loading && <p>Loading...</p>}
        {!loading && files.length > 0 && (
          <button
            type="submit"
            className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default BrandForm;
