"use client"
import React, { useState, useRef, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import options from '@/data/options';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline'
const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const ModelForm = () => {
    const [listingTitle, setListingTitle] = useState('');
    const [brands, setBrands] = useState([]);
    const [model, setModel] = useState('');
    const [models, setModels] = useState([]);
    const [brand, setBrand] = useState('');
    const [type, setType] = useState('');
    const [condition, setCondition] = useState('');
    const [year, setYear] = useState('');
    const [driveType, setDriveType] = useState('');
    const [transmission, setTransmission] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [mileage, setMileage] = useState('');
    const [engineSize, setEngineSize] = useState('');
    const [cylinders, setCylinders] = useState('');
    const [color, setColor] = useState('');
    const [doors, setDoors] = useState('');
    const [vin, setVin] = useState('');
    const [price, setPrice] = useState('');
    const [files, setFiles] = useState([]);
    const [generatedId, setGeneratedId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const imageUploadRef = useRef(null);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [selectedSafetyFeatures, setSelectedSafetyFeatures] = useState([]);
    

  useEffect(() => {
    // Fetch brands and their models from the API
    const fetchBrands = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/carbrand');
        if (!response.ok) {
          throw new Error('Failed to fetch brands');
        }
        const data = await response.json();
        setBrands(data.carBrand);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandChange = (e) => {
    const selectedBrand = e.target.value;
    setBrand(selectedBrand);
    const selectedBrandData = brands.find(b => b.name === selectedBrand);
    if (selectedBrandData) {
      setModels(selectedBrandData.models);
      setBrand(selectedBrandData.name);
    } else {
      setModels([]);
      setBrand('');
    }
  };

  const handleFileChange = (e) => {
    try {
      const selectedFiles = e.target.files;
      const newGeneratedId = generateUniqueId();
      setGeneratedId(newGeneratedId);

      const newFiles = Array.from(selectedFiles).map(file => ({
        file,
        folderId: newGeneratedId
      }));
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    } catch (error) {
      console.error('Error handling file change:', error);
    }
  };

  const handleDeleteImage = (index) => {
    try {
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (!brand) {
        throw new Error('Brand is required');
      }

      if (files.length === 0) {
        throw new Error('At least one image is required');
      }

      const uploadedImageUrls = await Promise.all(files.map(async (fileData) => {
        const uploadTaskSnapshot = await uploadImageToStorage(fileData.file, fileData.folderId);
        return getDownloadURL(uploadTaskSnapshot.ref);
      }));

      const formData = {
        listingTitle,
        brand,
        model,
        type,
        condition,
        driveType,
        year,
        transmission,
        fuelType,
        mileage,
        engineSize,
        cylinders,
        color,
        doors,
        vin,
        images: uploadedImageUrls,
        folderId: generatedId,
        price,
        features: selectedFeatures,
        safetyFeatures: selectedSafetyFeatures
      };
      await saveFormDataToMongoDB(formData)
      console.log('formData:', formData);

      // Clear form fields and state after submission
      setBrand('');
      setModel('');
      setType('');
      setCondition('');
      setDriveType('');
      setTransmission('');
      setFuelType('');
      setMileage('');
      setEngineSize('');
      setYear('')
      setCylinders('');
      setColor('');
      setDoors('');
      setVin('');
      setPrice('');
      setFiles([]);
      setSelectedFeatures([]);
      setSelectedSafetyFeatures([]);
      setMessage('Data saved successfully.');
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.message || 'An error occurred while saving data.');
      setLoading(false);
    }
  };

  const uploadImageToStorage = async (file, folderId) => {
    const storageRef = ref(storage, `images/${folderId}/${file.name}`);
    return uploadBytesResumable(storageRef, file);
  };

  const saveFormDataToMongoDB = async (formData) => {
    const response = await fetch('http://localhost:3000/api/carmodels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error('Failed to save data to MongoDB');
    }

    return response.json();
  };

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Add New Car Model</h1>
      <form onSubmit={handleSubmit}>
        {/* Listing Title */}
        <div className="mb-4">
          <label htmlFor="listingTitle" className="block text-sm font-medium text-gray-700">Listing Title:</label>
          <input
            type="text"
            id="listingTitle"
            value={listingTitle}
            onChange={(e) => setListingTitle(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Brand */}
        <div className="mb-4">
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand:</label>
          <select
            id="brand"
            value={brand}
            onChange={handleBrandChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            >
            <option value="">Select Brand</option>
            {brands.map((brandOption, index) => (
                <option key={index} value={brandOption.id}>{brandOption.name}</option> // Use brand ID as value
            ))}
            </select>

        </div>
        {/* Model */}
        <div className="mb-4">
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model:</label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="">Select Model</option>
            {models.map((modelOption, index) => (
              <option key={index} value={modelOption}>{modelOption}</option>
            ))}
          </select>
        </div>
        {/* Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Type:</label>
          {options.types.map((typeOption, index) => (
            <label key={index} className="inline-flex items-center mt-1 mr-4">
              <input
                type="radio"
                value={typeOption}
                checked={type === typeOption}
                onChange={(e) => setType(e.target.value)}
                className="form-radio text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2">{typeOption}</span>
            </label>
          ))}
        </div>
        {/* Condition */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Condition:</label>
          {options.conditions.map((conditionOption, index) => (
            <label key={index} className="inline-flex items-center mt-1 mr-4">
              <input
                type="radio"
                value={conditionOption}
                checked={condition === conditionOption}
                onChange={(e) => setCondition(e.target.value)}
                className="form-radio text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2">{conditionOption}</span>
            </label>
          ))}
        </div>
        {/* Year */}
        <div className="mb-4">
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year:</label>
          <input
            type="text"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price:</label>
          <input
            type="text"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Drive Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Drive Type:</label>
          {options.driveTypes.map((driveTypeOption, index) => (
            <label key={index} className="inline-flex items-center mt-1 mr-4">
              <input
                type="radio"
                value={driveTypeOption}
                checked={driveType === driveTypeOption}
                onChange={(e) => setDriveType(e.target.value)}
                className="form-radio text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2">{driveTypeOption}</span>
            </label>
          ))}
        </div>
        {/* Transmission */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Transmission:</label>
          {options.transmissions.map((transmissionOption, index) => (
            <label key={index} className="inline-flex items-center mt-1 mr-4">
              <input
                type="radio"
                value={transmissionOption}
                checked={transmission === transmissionOption}
                onChange={(e) => setTransmission(e.target.value)}
                className="form-radio text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2">{transmissionOption}</span>
            </label>
          ))}
        </div>
        {/* Fuel Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Fuel Type:</label>
          {options.fuelTypes.map((fuelTypeOption, index) => (
            <label key={index} className="inline-flex items-center mt-1 mr-4">
              <input
                type="radio"
                value={fuelTypeOption}
                checked={fuelType === fuelTypeOption}
                onChange={(e) => setFuelType(e.target.value)}
                className="form-radio text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2">{fuelTypeOption}</span>
            </label>
          ))}
        </div>
        {/* Engine Size */}
        <div className="mb-4">
          <label htmlFor="engineSize" className="block text-sm font-medium text-gray-700">Engine Size:</label>
          <input
            type="text"
            id="engineSize"
            value={engineSize}
            onChange={(e) => setEngineSize(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Mileage */}
        <div className="mb-4">
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">Mileage:</label>
          <input
            type="text"
            id="mileage"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Cylinders */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cylinders:</label>
          {options.cylinders.map((cylindersOption, index) => (
            <label key={index} className="inline-flex items-center mt-1 mr-4">
              <input
                type="radio"
                value={cylindersOption}
                checked={cylinders === cylindersOption.toString()}
                onChange={(e) => setCylinders(e.target.value)}
                className="form-radio text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2">{cylindersOption}</span>
            </label>
          ))}
        </div>
        {/* Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Color:</label>
          {options.colors.map((colorOption, index) => (
            <label key={index} className="inline-flex items-center mt-1 mr-4">
              <input
                type="radio"
                value={colorOption}
                checked={color === colorOption}
                onChange={(e) => setColor(e.target.value)}
                className="form-radio text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2">{colorOption}</span>
            </label>
          ))}
        </div>
        {/* Doors */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Doors:</label>
          {options.doors.map((doorsOption, index) => (
            <label key={index} className="inline-flex items-center mt-1 mr-4">
              <input
                type="radio"
                value={doorsOption}
                checked={doors === doorsOption.toString()}
                onChange={(e) => setDoors(e.target.value)}
                className="form-radio text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2">{doorsOption}</span>
            </label>
          ))}
        </div>
        {/* VIN */}
        <div className="mb-4">
          <label htmlFor="VIN" className="block text-sm font-medium text-gray-700">VIN:</label>
          <input
            type="text"
            id="VIN"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        {/* Features */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Features:</label>
          {options.features.map((featureOption, index) => (
            <label key={index} className="inline-flex items-center mt-1 mr-4">
              <input
                type="checkbox"
                value={featureOption}
                checked={selectedFeatures.includes(featureOption)}
                onChange={(e) => {
                  const updatedFeatures = [...selectedFeatures];
                  if (e.target.checked) {
                    updatedFeatures.push(featureOption);
                  } else {
                    const index = updatedFeatures.indexOf(featureOption);
                    if (index > -1) {
                      updatedFeatures.splice(index, 1);
                    }
                  }
                  setSelectedFeatures(updatedFeatures);
                }}
                className="form-checkbox text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2">{featureOption}</span>
            </label>
          ))}
        </div>
        {/* Safety Features */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Safety Features:</label>
          {options.safetyFeatures.map((safetyFeatureOption, index) => (
            <label key={index} className="inline-flex items-center mt-1 mr-4">
              <input
                type="checkbox"
                value={safetyFeatureOption}
                checked={selectedSafetyFeatures.includes(safetyFeatureOption)}
                onChange={(e) => {
                  const updatedSafetyFeatures = [...selectedSafetyFeatures];
                  if (e.target.checked) {
                    updatedSafetyFeatures.push(safetyFeatureOption);
                  } else {
                    const index = updatedSafetyFeatures.indexOf(safetyFeatureOption);
                    if (index > -1) {
                      updatedSafetyFeatures.splice(index, 1);
                    }
                  }
                  setSelectedSafetyFeatures(updatedSafetyFeatures);
                }}
                className="form-checkbox text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2">{safetyFeatureOption}</span>
            </label>
          ))}
        </div>
        {/* Images */}
        <div className="mb-4">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images:</label>
          <input
            type="file"
            id="images"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        <div className="flex flex-wrap">
          {files.map((fileData, index) => (
            <div key={index} className='relative mr-4 mb-4'>
              <Image
                src={URL.createObjectURL(fileData.file)}
                alt={`Uploaded ${index}`}
                className="mb-2 rounded-lg"
                style={{ width: '150px', height: '150px' }}
                width={150}
                height={150}
              />
              <button
                onClick={() => handleDeleteImage(index)}
                className="absolute top-0 right-0 p-1 bg-white rounded-full text-zinc flex justify-center items-center"
              >
                <XMarkIcon className='h-6 w-6  text-zinc hover:text-zinc/[0.9]'/>
              </button>

            </div>
          ))}
        </div>
        {/* Submit Button */}
        {loading && <p>Loading...</p>}
        {!loading && files.length > 0 && (
          <button
            type="submit"
            className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-zinc hover:bg-zinc/[0.9] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          >
            Save
          </button>
        )}
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
};

export default ModelForm;
