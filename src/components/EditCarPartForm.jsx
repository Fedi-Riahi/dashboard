"use client";
import React, { useState, useRef, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";

const predefinedCategories = ['Engine', 'Transmission', 'Brakes', 'Suspension', 'Electrical', 'Interior', 'Exterior', 'Other'];

const EditCarPartForm = ({ partData, onUpdate, onClose, allCarModels }) => {
    const [name, setName] = useState(partData?.name || '');
    const [category, setCategory] = useState(partData?.category || '');
    const [description, setDescription] = useState(partData?.description || '');
    const [price, setPrice] = useState(partData?.price || 0);
    const [quantity, setQuantity] = useState(partData?.quantity || 0);
    const [manufacturer, setManufacturer] = useState(partData?.manufacturer || '');
    const [modelNumber, setModelNumber] = useState(partData?.modelNumber || '');
    const [year, setYear] = useState(partData?.year || 0);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [generatedId, setGeneratedId] = useState("");
    const [compatibleCarModels, setCompatibleCarModels] = useState(partData?.compatibleCarModels || []);
    const imageUploadRef = useRef(null);
    const [message, setMessage] = useState("");
    const [carModels, setCarModels] = useState([]);
  
    useEffect(() => {
        fetchCarModels();
    }, []);

    const fetchCarModels = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/carbrand");
            if (!response.ok) {
                throw new Error("Failed to fetch car models");
            }
            const data = await response.json();
            if (data && data.carBrand && data.carBrand.length > 0) {
                const models = data.carBrand[0].models;
                setCarModels(models);
            }
        } catch (error) {
            console.error("Error fetching car models:", error);
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Construct form data
            const formData = {
                name,
                category,
                description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                manufacturer,
                modelNumber,
                year: parseInt(year),
                compatibleCarModels: compatibleCarModels,
                images: partData.images, // Keep existing images by default
                specifications: {}
            };

            // Upload new images only if files are selected
            if (files.length > 0) {
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

                formData.images = uploadedImageUrls;
            }

            // Update car part data
            await updateCarPart(partData._id, formData);

            // Close the modal and trigger onUpdate
            onUpdate(formData);
            onClose();
            setMessage("Car part updated successfully.");
        } catch (error) {
            console.error("Error updating car part:", error);
            setMessage("Failed to update car part. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (model) => {
        const updatedModels = [...compatibleCarModels];
        if (updatedModels.includes(model)) {
            const index = updatedModels.indexOf(model);
            updatedModels.splice(index, 1);
        } else {
            updatedModels.push(model);
        }
        setCompatibleCarModels(updatedModels);
    };

    const uploadImageToStorage = async (file, folderId) => {
        const storageRef = ref(storage, `images/${folderId}/${file.name}`);
        return uploadBytesResumable(storageRef, file);
    };

    const updateCarPart = async (carPartId, data) => {
        const response = await fetch(`http://localhost:3000/api/carparts/${carPartId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to update car part.");
        }
    };

    const generateUniqueId = () => {
        return Math.random().toString(36).substr(2, 9);
    };


  return (
<>
        <h2 className="text-2xl font-bold mb-4">Edit Car Part</h2>
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
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
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
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
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
        <label className="mb-4 font-semibold text-gray-900 dark:text-white">Compatible Car Models:</label>
        <div className="mb-4 flex flex-wrap">
          {carModels.map((model, index) => (
            <div key={index} className="mt-3 flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 mr-4 mb-2">
              <input
                type="checkbox"
                value={model}
                checked={compatibleCarModels.includes(model)}
                onChange={() => handleCheckboxChange(model)}
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
       {/* File Upload Section */}
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">
      Upload New Images:
    </label>
    <input
      type="file"
      multiple
      accept="image/*"
      ref={imageUploadRef}
      onChange={handleFileChange}
      className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
    />
  </div>
{/* Uploaded images */}
<div className="mb-4 flex items-center">
    {files.map((file, index) => (
        <div key={index} className="mr-2 relative">
            <Image
                src={URL.createObjectURL(file.file)}
                alt="Car Part Image"
                width={150}
                height={150}
                className="w-20 h-20 object-cover rounded-full mr-2"
            />
        </div>
    ))}
</div>

{/* Existing Images */}
<div className="mb-4 flex items-center">
    {partData?.images && partData.images.map((imageUrl, index) => (
        <div key={index} className="mr-2 relative">
            <Image
                src={imageUrl}
                alt="Existing Car Part Image"
                width={150}
                height={150}
                className="w-20 h-20 object-cover rounded-full mr-2"
            />
        </div>
    ))}
</div>

        <button
          type="submit"
          disabled={loading} 
          className="bg-zinc hover:bg-zinc/[0.9] text-white font-semibold py-2 px-6 mt-4 rounded"
        >
          Update
        </button>
        </form>
        </>
  );
};

export default EditCarPartForm;
