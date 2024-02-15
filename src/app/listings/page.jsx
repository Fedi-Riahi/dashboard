"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import EditModelForm from "@/components/EditModelForm";

function Listing() {
  const [carModels, setCarModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModelData, setEditModelData] = useState(null);

  useEffect(() => {
    const fetchCarModels = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/carmodels", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch car models");
        }
        const data = await response.json();

        setCarModels(data.carListing);
      } catch (error) {
        console.error("Error fetching car models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarModels();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/carmodels/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the model");
      }

      const updatedCarModels = carModels.filter((model) => model._id !== id);
      setCarModels(updatedCarModels);
    } catch (error) {
      console.error("Error deleting car model:", error);
    }
  };

  const handleEditClick = (model) => {
    setEditModelData({ ...model, folderId: model.folderId });
    setIsEditModalOpen(true);
  };

  const handleClose = () => {
    setIsEditModalOpen(false);
  };

  const handleUpdate = (updatedModelData) => {
    const updatedCarModels = carModels.map((model) =>
      model._id === updatedModelData._id ? updatedModelData : model
    );
    setCarModels(updatedCarModels);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold mb-4">Listings Management</h1>
        <Link
          href="listings/addlisting"
          className="px-4 py-2 rounded text-white bg-zinc hover:bg-zinc/[0.9] mr-4"
        >
          Add Listing
        </Link>
      </div>
      <div className="container py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {carModels.map((carModel) => (
              <div
                key={carModel._id}
                className="bg-white rounded-lg shadow-md overflow-hidden relative"
              >
                <img
                  src={carModel.images[0]}
                  alt={carModel.listingTitle}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">
                    {carModel.listingTitle}
                  </h2>
                  <p className="text-gray-600 font-semibold mb-2">
                    Model: {carModel.model}
                  </p>
                  <p className="text-gray-600 font-semibold mb-4">
                    VIN: {carModel.vin}
                  </p>
                  <div className="absolute top-2 left-2">
                    {carModel.inStock ? (
                      <p className="px-2 py-1 bg-green-500 text-white rounded">
                        In Stock
                      </p>
                    ) : (
                      <p className="px-2 py-1 bg-red-500 text-white rounded">
                        Out of Stock
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleEditClick(carModel)}
                      className="text-zinc font-semibold hover:text-zinc-[0.9]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(carModel._id)}
                      className="text-red-500 font-semibold hover:text-red-700 ml-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {isEditModalOpen && (
        <EditModelForm
          modelData={editModelData}
          onClose={handleClose}
          onUpdate={handleUpdate}
          setModelData={setEditModelData}
        />
      )}
    </>
  );
}

export default Listing;
