"use client"
import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import options from '@/data/options';

const EditModelForm = ({ modelData, onClose, onUpdate }) => {
  const { folderId } = modelData || {}; 
  const [model, setModel] = useState(modelData?.model || '');
  const [brand, setBrand] = useState(modelData?.brand || '');
  const [listingTitle, setListingTitle] = useState(modelData?.listingTitle || '');
  const [type, setType] = useState(modelData?.type || '');
  const [condition, setCondition] = useState(modelData?.condition || '');
  const [year, setYear] = useState(modelData?.year || '');
  const [mileage, setMileage] = useState(modelData?.mileage || '');
  const [engineSize, setEngineSize] = useState(modelData?.engineSize || '');
  const [color, setColor] = useState(modelData?.color || '');
  const [doors, setDoors] = useState(modelData?.doors || '');
  const [vin, setVin] = useState(modelData?.vin || '');
  const [price, setPrice] = useState(modelData?.price || '');
  const [features, setFeatures] = useState(modelData?.features || []);
  const [safetyFeatures, setSafetyFeatures] = useState(modelData?.safetyFeatures || []);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [existingImageURLs, setExistingImageURLs] = useState([]);

  // Update form field values based on modelData
  useEffect(() => {
    if (modelData) {
      setModel(modelData.model || '');
      setBrand(modelData.brand || '');
      setType(modelData.type || '');
      setCondition(modelData.condition || '');
      setYear(modelData.year || '');
      setMileage(modelData.mileage || '');
      setEngineSize(modelData.engineSize || '');
      setColor(modelData.color || '');
      setDoors(modelData.doors || '');
      setVin(modelData.vin || '');
      setPrice(modelData.price || '');
      setFeatures(modelData.features || []);
      setSafetyFeatures(modelData.safetyFeatures || []);
    }
  }, [modelData]);



// Effect to update existingImageURLs whenever modelData.images changes
useEffect(() => {
  if (modelData?.images) {
    setExistingImageURLs(modelData.images);
  }
}, [modelData]);

  // Function to handle file change
  const handleFileChange = async (e) => {
    try {
      const selectedFiles = e.target.files;
      const newFiles = Array.from(selectedFiles).map(file => {
        return {
          file,
          fileName: file.name,
          previewURL: URL.createObjectURL(file)
        };
      });
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    } catch (error) {
      console.error('Error handling file change:', error);
    }
  };
  
  
  
  

  const handleDeleteImage = async (index, event) => {
    try {
      event.stopPropagation();
      event.preventDefault();
  
      if (!folderId) {
        console.error('Folder ID is null.');
        return;
      }
  
      const imageToDelete = existingImageURLs[index];
      const decodedImageURL = decodeURIComponent(imageToDelete);
      const imageUrlParts = decodedImageURL.split('?');
      const imageUrl = imageUrlParts[0];
      const imageName = imageUrl.split('/').pop();
  
      const storageRef = ref(storage, `images/${folderId}/${imageName}`);
  
      // Delete image from Firebase Storage
      await deleteObject(storageRef);
  
      // Remove the deleted image URL from existingImageURLs state
      setExistingImageURLs(prevURLs => prevURLs.filter((url, idx) => idx !== index));
  
      // Remove the deleted image URL from modelData
      const updatedImages = existingImageURLs.filter((image, idx) => idx !== index);
      const updatedModelData = {
        ...modelData,
        images: updatedImages,
      };
  
      // Update the model data in the database
      const response = await fetch(`http://localhost:3000/api/carmodels/${modelData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedModelData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update model data');
      }
  
      // Now update the files state to remove the deleted image
      setFiles(prevFiles => prevFiles.filter((file, idx) => idx !== index));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  
  
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
  
      // Upload all files
      const uploadedImages = await Promise.all(files.map(async (file) => {
        const storageRef = ref(storage, `images/${folderId}/${file.fileName}`); // Access file name using file.fileName
        const uploadTask = uploadBytesResumable(storageRef, file.file); // Access file using file.file
  
        // Track upload progress
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Error uploading image:', error);
            setLoading(false);
          },
          () => {
            setLoading(false);
            setUploadProgress(0);
          }
        );
  
        await uploadTask;
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      }));
  
      // Update model data with uploaded images
      const updatedModel = {
        ...modelData,
        model,
        listingTitle,
        brand,
        type,
        condition,
        year,
        mileage,
        engineSize,
        color,
        doors,
        vin,
        price,
        features,
        safetyFeatures,
        images: [...(modelData.images || []), ...uploadedImages],
      };
  
      // Update model data in the database using the model ID
      await fetch(`http://localhost:3000/api/carmodels/${modelData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedModel),
      });
  
      // Call onUpdate to update the model in the parent component
      onUpdate(updatedModel);
      onClose();
    } catch (error) {
      console.error('Error updating model:', error);
    }
  };
  
  
  

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Edit Car Model</h1>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        {/* Listing Title */}
        <div className="mb-4">
          <label htmlFor="listingTitle" className="block text-sm font-medium text-gray-700">
            Listing Title:
          </label>
          <input
            type="text"
            id="listingTitle"
            value={listingTitle}
            onChange={(e) => setListingTitle(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Model */}
        <div className="mb-4">
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Model:
          </label>
          <input
            type="text"
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Brand */}
        <div className="mb-4">
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
            Brand:
          </label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Type */}
<div className="mb-4">
  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
    Type:
  </label>
  <select
    id="type"
    value={type}
    onChange={(e) => setType(e.target.value)}
    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
  >
    {options.types.map((typeOption) => (
      <option key={typeOption} value={typeOption}>{typeOption}</option>
    ))}
  </select>
</div>
{/* Condition */}
<div className="mb-4">
  <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
    Condition:
  </label>
  <select
    id="condition"
    value={condition}
    onChange={(e) => setCondition(e.target.value)}
    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
  >
    {options.conditions.map((conditionOption) => (
      <option key={conditionOption} value={conditionOption}>{conditionOption}</option>
    ))}
  </select>
</div>

        {/* Year */}
        <div className="mb-4">
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Year:
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Mileage */}
        <div className="mb-4">
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
            Mileage:
          </label>
          <input
            type="number"
            id="mileage"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Engine Size */}
        <div className="mb-4">
          <label htmlFor="engineSize" className="block text-sm font-medium text-gray-700">
            Engine Size:
          </label>
          <input
            type="text"
            id="engineSize"
            value={engineSize}
            onChange={(e) => setEngineSize(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Color */}
        <div className="mb-4">
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color:
          </label>
          <input
            type="text"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Doors */}
        <div className="mb-4">
          <label htmlFor="doors" className="block text-sm font-medium text-gray-700">
            Doors:
          </label>
          <input
            type="number"
            id="doors"
            value={doors}
            onChange={(e) => setDoors(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* VIN */}
        <div className="mb-4">
          <label htmlFor="vin" className="block text-sm font-medium text-gray-700">
            VIN:
          </label>
          <input
            type="text"
            id="vin"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price:
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Features */}
        <div className="mb-4">
          <label htmlFor="features" className="block text-sm font-medium text-gray-700">
            Features:
          </label>
          <textarea
            id="features"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Safety Features */}
        <div className="mb-4">
          <label htmlFor="safetyFeatures" className="block text-sm font-medium text-gray-700">
            Safety Features:
          </label>
          <textarea
            id="safetyFeatures"
            value={safetyFeatures}
            onChange={(e) => setSafetyFeatures(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Add file input for image upload */}
        <div className="mb-4">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">
            Images:
          </label>
          <input
            type="file"
            id="images"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Display existing and new images */}
        <div className="flex space-x-4 mb-4">
          {/* Display existing images */}
          {existingImageURLs.map((image, index) => (
            <div key={index} className="relative w-20 h-20">
              <button
                className="absolute top-0 right-0 z-10 p-1 bg-gray-800 text-white rounded-full"
                onClick={(event) => handleDeleteImage(index, event)}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
              <Image
                src={image}
                alt={`Uploaded Image ${index}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}

          {/* Display new images */}
          {files.map((file, index) => (
            <div key={index} className="relative w-20 h-20">
              <Image
                src={file.previewURL}
                alt={`New Image ${index}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>
        {/* Submit button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
        {/* Upload progress */}
        {uploadProgress > 0 && (
          <div className="mt-4">
            <progress value={uploadProgress} max="100" />
          </div>
        )}
        {/* Error message */}
        {message && (
          <div className="mt-4 text-red-600">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default EditModelForm;
