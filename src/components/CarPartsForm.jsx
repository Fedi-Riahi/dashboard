"use client"
import React, { useState, useRef, useEffect } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";

const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const predefinedCategories = ['Engine', 'Transmission', 'Brakes', 'Suspension', 'Electrical', 'Interior', 'Exterior','Filters', 'Other'];

const CarPartsForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [generatedId, setGeneratedId] = useState("");
  const imageUploadRef = useRef(null);
  const [message, setMessage] = useState("");
  const [compatibleCarModels, setCompatibleCarModels] = useState([]);
  const [allCarModels, setAllCarModels] = useState([]);

  useEffect(() => {
    // Fetch car brands and set all car models
    fetch("http://localhost:3000/api/carbrand")
      .then((response) => response.json())
      .then((data) => {
        if (data.carBrand.length > 0) {
          setAllCarModels(data.carBrand[0].models);
        }
      })
      .catch((error) => console.error("Error fetching car brands:", error));
  }, []);

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

      // Check if all required fields are filled
      if (!name || !category || !price || !quantity) {
        throw new Error("Please fill in all required fields.");
      }

      // Check if at least one image is uploaded
      if (files.length === 0) {
        throw new Error("At least one image is required.");
      }

      // Upload images to storage and get download URLs
      const uploadedImageUrls = await Promise.all(
        files.map(async (fileData) => {
          const uploadTaskSnapshot = await uploadImageToStorage(
            fileData.file,
            fileData.folderId
          );
          return getDownloadURL(uploadTaskSnapshot.ref);
        })
      );

      // Construct form data
      const formData = {
        name,
        category,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        manufacturer,
        modelNumber,
        year: parseInt(year),
        compatibleCarModels,
        images: uploadedImageUrls,
        specifications: {} // You can include specifications here
      };

      // Save form data to API
      await saveFormDataToAPI(formData);

      // Clear form fields and show success message
      setName("");
      setCategory("");
      setDescription("");
      setPrice("");
      setStock("");
      setManufacturer("");
      setModelNumber("");
      setYear("");
      setCompatibleCarModels([]);
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

  const saveFormDataToAPI = async (formData) => {
    const response = await fetch("http://localhost:3000/api/carparts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to save data to the API.");
    }

    return response.json();
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit} className="">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category:
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="">Select a category</option>
            {predefinedCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price:
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity:
          </label>
          <input
            id="quantity"
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="manufacturer"
            className="block text-sm font-medium text-gray-700"
          >
            Manufacturer:
          </label>
          <input
            id="manufacturer"
            type="text"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="modelNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Model Number:
          </label>
          <input
            id="modelNumber"
            type="text"
            value={modelNumber}
            onChange={(e) => setModelNumber(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700"
          >
            Year:
          </label>
          <input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Compatible Car Models */}
          <div className="mb-4">
            <label className="mb-4 font-semibold text-gray-900 dark:text-white">
              Compatible Car Models:
            </label>
            <div className="mb-4 flex flex-wrap">
              {allCarModels.map((model, index) => (
                <div key={index} className="mt-3 flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 mr-4 mb-2">
                  <input
                    type="checkbox"
                    value={model}
                    checked={compatibleCarModels.includes(model)}
                    onChange={(e) => {
                      const updatedModels = [...compatibleCarModels];
                      if (e.target.checked) {
                        updatedModels.push(model);
                      } else {
                        const index = updatedModels.indexOf(model);
                        if (index > -1) {
                          updatedModels.splice(index, 1);
                        }
                      }
                      setCompatibleCarModels(updatedModels);
                    }}
                    id={`carModel_${index}`}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`carModel_${index}`}
                    className="py-4 px-3 text-center ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {model}
                  </label>
                </div>
              ))}
            </div>
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
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default CarPartsForm;
