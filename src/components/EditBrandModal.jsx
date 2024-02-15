"use client";
import React, { useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
const EditBrandModal = ({ brand, onClose, onUpdate, folderId }) => {
  const [name, setName] = useState(brand.name);
  const [models, setModels] = useState(brand.models);
  const [coverImages, setCoverImages] = useState(brand.coverImages);
  const [newCoverImages, setNewCoverImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e) => {
    try {
      const selectedFiles = e.target.files;
      const newFiles = Array.from(selectedFiles).map((file) => file);

      // Append new files to the existing files array
      setNewCoverImages((prevImages) => [...prevImages, ...newFiles]);
    } catch (error) {
      console.error("Error handling file change:", error);
    }
  };

  const handleDeleteImage = async (index, event) => {
    try {
      event.stopPropagation();
      event.preventDefault();
      const imageToDelete = coverImages[index];
      const decodedImageURL = decodeURIComponent(imageToDelete); // Decode the image URL
      const imageUrlParts = decodedImageURL.split("?"); // Split the URL by the query string
      const imageUrl = imageUrlParts[0]; // Get the part before the query string
      const imageName = imageUrl.split("/").pop(); // Extract image file name

      const storageRef = ref(storage, `images/${folderId}/${imageName}`); // Use folderId

      // Introduce a delay before deleting the image
      setTimeout(async () => {
        try {
          await deleteObject(storageRef); // Delete the image from storage

          // Update local state to reflect the deletion
          const updatedCoverImages = coverImages.filter(
            (image, idx) => idx !== index
          );
          setCoverImages(updatedCoverImages);

          // Update MongoDB coverImages array by removing the deleted image URL
          const updatedBrand = {
            ...brand,
            coverImages: updatedCoverImages,
          };
          await fetch(`http://localhost:3000/api/carbrand/${brand._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedBrand),
          });

          // Check if it's the last image in the folder
          if (updatedCoverImages.length === 0) {
            // If it's the last image, refrain from deleting the image itself
            // This prevents the folder deletion
            return;
          }
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }, 1000); // Adjust the delay time as needed
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      // Upload new cover images
      const uploadedImages = await Promise.all(
        newCoverImages.map(async (file) => {
          const storageRef = ref(storage, `images/${folderId}/${file.name}`); // Use folderId from MongoDB
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Update progress
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              // Handle errors
              console.error("Error uploading image:", error);
              setUploading(false);
            },
            () => {
              // Upload complete
              setUploading(false);
              setUploadProgress(0);
            }
          );

          await uploadTask;
          const downloadURL = await getDownloadURL(storageRef);
          return downloadURL;
        })
      );

      // Update brand data
      const updatedBrand = {
        ...brand,
        name,
        models,
        coverImages: [...coverImages, ...uploadedImages],
      };

      // Update brand data in the MongoDB database
      await fetch(`http://localhost:3000/api/carbrand/${brand._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBrand),
      });

      // Call the onUpdate function to update the brand in the parent component
      onUpdate(updatedBrand);
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating brand:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <span
          className="close text-xl font-bold cursor-pointer absolute top-2 right-2"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
        <h2 className="text-2xl font-bold mb-4">Edit Brand</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="name"
            >
              Name:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-zinc"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="models"
            >
              Models:
            </label>
            <input
              id="models"
              type="text"
              value={models}
              onChange={(e) => setModels(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-zinc"
            />
          </div>
          {/* Display existing cover images */}
          <div className="mb-4 flex flex-wrap items-center">
            {coverImages.map((image, index) => (
              <div key={index} className="mr-2 mb-2 relative">
                <Image
                  src={image}
                  alt={`Cover ${index}`}
                  width={150}
                  height={150}
                  className="w-20 h-20 object-cover rounded-full mr-2"
                />
                <button
                  onClick={(event) => handleDeleteImage(index, event)}
                  className="text-sm bg-gray-100 absolute top-0 text-white  rounded-full right-2"
                >
                  <XMarkIcon className="h-6 w-6  text-zinc hover:text-zinc/[0.9]" />
                </button>
              </div>
            ))}
          </div>
          {/* Display new cover images */}
          <div className="mb-4 flex flex-wrap items-center">
            {newCoverImages.map((file, index) => (
              <div key={index} className="mr-2 mb-2 relative">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`New Image ${index}`}
                  width={150}
                  height={150}
                  className="w-20 h-20 object-cover rounded-full mr-2 mb-2"
                />
                {uploading && uploadProgress > 0 && (
                  <div className="w-full h-2 bg-gray-300 rounded-md overflow-hidden relative">
                    <div
                      className="h-full bg-zinc absolute bottom-0 left-0"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Allow uploading new cover images */}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                multiple
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="bg-zinc hover:bg-zinc/[0.9] text-white font-semibold py-2 px-6 mt-4 rounded"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBrandModal;
