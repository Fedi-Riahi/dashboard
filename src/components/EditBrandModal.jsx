"use client";
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import Image from 'next/image';

const EditBrandModal = ({ brand, onClose, onUpdate, folderId  }) => {
  const [name, setName] = useState(brand.name);
  const [models, setModels] = useState(brand.models);
  const [coverImages, setCoverImages] = useState(brand.coverImages);
  const [newCoverImages, setNewCoverImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e) => {
    try {
      const selectedFiles = e.target.files;
      const newFiles = Array.from(selectedFiles).map(file => file);

      // Append new files to the existing files array
      setNewCoverImages(prevImages => [...prevImages, ...newFiles]);
    } catch (error) {
      console.error('Error handling file change:', error);
    }
  };

  const handleDeleteImage = async (index, event) => {
    try {
     event.stopPropagation();
     event.preventDefault();
      const imageToDelete = coverImages[index];
      const decodedImageURL = decodeURIComponent(imageToDelete); // Decode the image URL
      const imageUrlParts = decodedImageURL.split('?'); // Split the URL by the query string
      const imageUrl = imageUrlParts[0]; // Get the part before the query string
      const imageName = imageUrl.split('/').pop(); // Extract image file name
  
      const storageRef = ref(storage, `images/${folderId}/${imageName}`); // Use folderId
  
      // Introduce a delay before deleting the image
      setTimeout(async () => {
        try {
          await deleteObject(storageRef); // Delete the image from storage
  
          // Update local state to reflect the deletion
          const updatedCoverImages = coverImages.filter((image, idx) => idx !== index);
          setCoverImages(updatedCoverImages);
  
          // Update MongoDB coverImages array by removing the deleted image URL
          const updatedBrand = {
            ...brand,
            coverImages: updatedCoverImages,
          };
          await fetch(`http://localhost:3000/api/carbrand/${brand._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
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
          console.error('Error deleting image:', error);
        }
      }, 1000); // Adjust the delay time as needed
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  
  
  
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      // Upload new cover images
      const uploadedImages = await Promise.all(newCoverImages.map(async (file) => {
        const storageRef = ref(storage, `images/${folderId}/${file.name}`); // Use folderId from MongoDB
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on('state_changed',
          (snapshot) => {
            // Update progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            // Handle errors
            console.error('Error uploading image:', error);
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
      }));
  
      // Update brand data
      const updatedBrand = {
        ...brand,
        name,
        models,
        coverImages: [...coverImages, ...uploadedImages],
      };
  
      // Update brand data in the MongoDB database
      await fetch(`http://localhost:3000/api/carbrand/${brand._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBrand),
      });
  
      // Call the onUpdate function to update the brand in the parent component
      onUpdate(updatedBrand);
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };
  
  

  return (
    <div className="modal">
      <div className="modal-content p-4 bg-white">
        <span className="close text-xl font-bold cursor-pointer" onClick={onClose}>&times;</span>
        <h2 className="text-2xl font-bold mb-4">Edit Brand</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="models">
              Models:
            </label>
            <input
              id="models"
              type="text"
              value={models}
              onChange={(e) => setModels(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          {/* Display existing cover images */}
          <div className="mb-4 flex flex-wrap items-center">
            {coverImages.map((image, index) => (
              <div key={index} className="mr-2 mb-2">
                <Image src={image} alt={`Cover ${index}`} width={150} height={150} className="w-20 h-20 object-cover rounded-full mr-2" />
                <button onClick={(event) => handleDeleteImage(index, event)} className="text-sm text-red-500">Delete</button>

              </div>
            ))}
          </div>
          {/* Display new cover images */}
            <div className="mb-4 flex flex-wrap items-center">
            {newCoverImages.map((file, index) => (
                <div key={index} className="mr-2 mb-2 relative">
                <Image src={URL.createObjectURL(file)} alt={`New Image ${index}`} width={150} height={150} className="w-20 h-20 object-cover rounded-full mr-2 mb-2" />
                {uploading && uploadProgress > 0 && (
                    <div className="w-full h-2 bg-gray-300 rounded-md overflow-hidden relative">
                    <div className="h-full bg-blue-500 absolute bottom-0 left-0" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}
                </div>
            ))}
            </div>

            {/* Allow uploading new cover images */}
            <input type="file" accept="image/*" onChange={handleFileChange} multiple className="mb-4" />
            <button type="submit" disabled={uploading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update
            </button>

        </form>
      </div>
    </div>
  );
};

export default EditBrandModal;
