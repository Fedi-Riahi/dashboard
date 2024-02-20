"use client"
import React, { useState, useEffect } from "react";
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
        const response = await fetch("http://localhost:3000/api/carmodels");
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
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      {!isEditModalOpen && (
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold mb-4">Listings Management</h1>
          <Link
            href="listings/addlisting"
            className="px-4 py-2 rounded text-white bg-zinc hover:bg-zinc/[0.9] "
          >
            Add Listing
          </Link>
        </div>
      )}
      {!isEditModalOpen && (
        <div className="container py-10 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                  <div className="p-4 flex flex-col gap-1 w-full">
                    <h2 className="text-xl font-semibold mb-2 text-zinc">
                      {carModel.listingTitle}
                    </h2>
                    <p className="text-gray-400  mb-2">
                      Model
                      <span className="text-zinc font-semibold  ml-2">
                        {carModel.model}
                      </span>
                    </p>
                    <p className="text-gray-400  mb-4">
                      Fuel Type
                      <span className="text-zinc font-semibold   ml-2">
                        {carModel.fuelType}
                      </span>
                    </p>
                    <p className="text-gray-400 mb-4">
                      From
                      <span className="text-zinc font-semibold text-2xl ml-2">
                        {formatPrice(carModel.price)} TND
                      </span>
                    </p>
                    <div className="absolute top-2 left-2">
                      {carModel.inStock ? (
                        <p className="px-4 py-2 bg-zinc text-white rounded-full text-sm">
                          In Stock
                        </p>
                      ) : (
                        <p className="px-2 py-2 bg-white border border-zinc text-zinc rounded-full text-sm">
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
      )}
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
