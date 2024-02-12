"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import EditModelForm from '@/components/EditModelForm';

function Listing() {
  const [carModels, setCarModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModelData, setEditModelData] = useState(null);


 
  useEffect(() => {
    const fetchCarModels = async () => {
      try {
        // Fetch car models
        const response = await fetch('http://localhost:3000/api/carmodels', { cache: "no-store" });
        if (!response.ok) {
          throw new Error('Failed to fetch car models');
        }
        const data = await response.json();
  
        setCarModels(data.carListing);
      } catch (error) {
        console.error('Error fetching car models:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or error
      }
    };
  
    fetchCarModels();
  }, []);

  // Function to handle opening the modal and setting the data to be edited
// Function to handle opening the modal and setting the data to be edited
const handleEditClick = (model) => {
  // Set the editModelData state with the clicked model data
  setEditModelData({ ...model, folderId: model.folderId }); // Make sure folderId is included
  // Open the modal
  setIsEditModalOpen(true);
};


  // Function to handle closing the modal
  const handleClose = () => {
    setIsEditModalOpen(false);
  };

  // Function to handle updating the model after editing
  const handleUpdate = (updatedModelData) => {
    // Update the carModels state with the updated model data
    const updatedCarModels = carModels.map((model) =>
      model._id === updatedModelData._id ? updatedModelData : model
    );
    setCarModels(updatedCarModels);
    setIsEditModalOpen(false); // Close the modal after updating
  };

  return (
    <div className="container mx-auto p-8">
      <div className='flex items-center justify-between'>
        <h1 className="text-2xl font-semibold mb-4">Listings</h1>
        <Link href='/listings/addlisting' className='text-white bg-zinc hover:bg-zinc-[800] px-4 py-2 rounded mb-4'>Add Listing</Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse border border-gray-300">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 border border-gray-300">Brand Name</th>
                <th className="px-6 py-3 border border-gray-300">Model Name</th>
                <th className="px-6 py-3 border border-gray-300">Listing Title</th>
                <th className="px-6 py-3 border border-gray-300">VIN</th>
              </tr>
            </thead>
            <tbody>
            {carModels.map((carModel) => (
              <tr key={carModel._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 border border-gray-300 font-medium text-gray-900 dark:text-white">{carModel.brand}</td>
                <td className="px-6 py-4 border border-gray-300">{carModel.model}</td>
                <td className="px-6 py-4 border border-gray-300">{carModel.listingTitle}</td>
                <td className="px-6 py-4 border border-gray-300">{carModel.vin}</td>
                <td className="px-6 py-4 border border-gray-300">
                  {/* Call handleEditClick function when Edit link is clicked */}
                  <button onClick={() => handleEditClick(carModel)} className='text-zinc font-semibold hover:text-zinc-[0.9]'>
                    Edit
                  </button>
                </td>
              </tr>
            ))}

            </tbody>
          </table>
        </div>
      )}
      {/* Render the EditModelForm modal if isEditModalOpen is true */}
      {isEditModalOpen && (
        <EditModelForm
          modelData={editModelData} // Pass the modelData
          onClose={handleClose} // Pass the onClose function
          onUpdate={handleUpdate} // Pass the onUpdate function
        />
      )}
    </div>
  );
}

export default Listing;
