"use client"
import React, { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import Image from 'next/image';

// Function to generate unique IDs
const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric string
};

const BrandForm = ({ brandData }) => {
  const [name, setName] = useState(brandData ? brandData.name : '');
  const [models, setModels] = useState(brandData ? brandData.models : '');
  const [coverImageUrls, setCoverImageUrls] = useState(brandData ? brandData.coverImages : []);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [generatedId, setGeneratedId] = useState(''); // State to store generated ID
  const imageUploadRef = useRef(null);
  const [message, setMessage] = useState('');

  const handleFileChange = async (e) => {
    try {
      const selectedFiles = e.target.files;
      const newGeneratedId = generateUniqueId(); // Generate unique ID
      setGeneratedId(newGeneratedId); // Store generated ID in state

      const newFiles = Array.from(selectedFiles).map(file => ({
        file,
        loading: false,
        progress: 0,
        folderId: newGeneratedId // Assign folderId to each file
      }));

      setFiles(prevFiles => [...prevFiles, ...newFiles]);

      newFiles.forEach((fileData, index) => {
        const { file, folderId } = fileData;
        const storageRef = ref(storage, `images/${folderId}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setFiles(prevFiles => {
              const updatedFiles = [...prevFiles];
              if (updatedFiles[index]) {
                updatedFiles[index].progress = progress;
              }
              return updatedFiles;
            });
          },
          (error) => {
            console.error('Error uploading image:', error);
            setLoading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setCoverImageUrls(prevUrls => [...prevUrls, downloadURL]);
            setFiles(prevFiles => {
              const updatedFiles = [...prevFiles];
              if (updatedFiles[index]) {
                updatedFiles[index].loading = false;
              }
              return updatedFiles;
            });
          }
        );

        setFiles(prevFiles => {
          const updatedFiles = [...prevFiles];
          if (updatedFiles[index]) {
            updatedFiles[index].loading = true;
          }
          return updatedFiles;
        });
      });
    } catch (error) {
      console.error('Error handling file change:', error);
    }
  };

  const handleDeleteImage = async (index) => {
    try {
      const fileToDelete = files[index].file;
      const storageRef = ref(storage, `images/${files[index].folderId}/${fileToDelete.name}`);
      await deleteObject(storageRef);
  
      // Check if it's the last image in the folder
      if (files.length === 1) {
        // If it's the last image, refrain from deleting the image itself
        setFiles(prevFiles => {
          const updatedFiles = [...prevFiles];
          updatedFiles.splice(index, 1); // Remove the image from the UI
          return updatedFiles;
        });
      } else {
        // If there are other images, proceed with deletion
        setFiles(prevFiles => {
          const updatedFiles = [...prevFiles];
          updatedFiles.splice(index, 1);
          return updatedFiles;
        });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!name) {
        throw new Error('Brand Name is required');
      }

      if (coverImageUrls.length === 0) {
        throw new Error('At least one cover image is required');
      }

      if (!generatedId) {
        throw new Error('Generated ID is missing');
      }

      const formData = {
        name,
        models,
        coverImages: coverImageUrls,
        folderId: generatedId, // Use generatedId from state
      };

      const response = await fetch('http://localhost:3000/api/carbrand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      const responseData = await response.json();

      setName('');
      setModels('');
      setCoverImageUrls([]);
      setFiles([]);
      imageUploadRef.current.value = '';

      setMessage(responseData.message || 'Data saved successfully.');
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.message || 'An error occurred while saving data.');
      setLoading(false);
    }
  };


  const isFormValid = () => {
    return files.every(file => !file.loading);
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit} className="">
        <div className="mb-4">
          <label htmlFor="brandName" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="models" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700">
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
            <div key={index} className='relative mr-4 mb-4'>
              <Image
                src={URL.createObjectURL(fileData.file)}
                alt={`Uploaded ${index}`}
                className="mb-2 rounded-lg"
                style={{ width: '150px', height: '150px' }}
                width={150}
                height={150}
              />
              {fileData.loading && (
                <div className="w-[150px] h-4 bg-gray-300 rounded-full">
                  <div
                    className="h-full bg-gray-800 rounded-full"
                    style={{ width: `${fileData.progress}%`, maxWidth: '100%' }}
                  ></div>
                </div>
              )}
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
            disabled={!isFormValid()}
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
