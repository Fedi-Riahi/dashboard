"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import EditCarPartForm from "@/components/EditCarPartForm";

function CarPartsListing() {
  const [carParts, setCarParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCarPartData, setEditCarPartData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCarParts, setFilteredCarParts] = useState([]);
  const [allCarModels, setAllCarModels] = useState([]);

  useEffect(() => {
    const fetchCarParts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/carparts");
        if (!response.ok) {
          throw new Error("Failed to fetch car parts");
        }
        const data = await response.json();

        setCarParts(data.carParts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car parts:", error);
        setLoading(false);
      }
    };

    fetchCarParts();
  }, []);

  useEffect(() => {
    // Filter car parts based on search query
    const filteredParts = carParts.filter(
      (part) =>
        part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCarParts(filteredParts);
  }, [searchQuery, carParts]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/carparts/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the car part");
      }

      const updatedCarParts = carParts.filter((part) => part._id !== id);
      setCarParts(updatedCarParts);
    } catch (error) {
      console.error("Error deleting car part:", error);
    }
  };

  const handleEditClick = (part) => {
    setEditCarPartData({ ...part, folderId: part.folderId });
    setIsEditModalOpen(true);
  };

  const handleClose = () => {
    setIsEditModalOpen(false);
  };

  const handleUpdate = (updatedPartData) => {
    const updatedCarParts = carParts.map((part) =>
      part._id === updatedPartData._id ? updatedPartData : part
    );
    setCarParts(updatedCarParts);
    setIsEditModalOpen(false);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      {/* Conditional rendering based on modal state */}
      {!isEditModalOpen && (
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold mb-4">Car Parts Management</h1>
          <Link
            href="carparts/addcarpart"
            className="px-4 py-2 rounded text-white bg-zinc hover:bg-zinc/[0.9] "
          >
            Add Car Part
          </Link>
        </div>
      )}
      {/* Conditional rendering based on modal state */}
      {!isEditModalOpen && (
        <div>
          {/* Search input field */}
          <input
            type="text"
            placeholder="Search by name or category"
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="px-8 py-2 rounded border border-gray-300 mb-4 w-72"
          />
          {/* Container for grid layout */}
          <div className="container py-10 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {/* Mapping through filtered car parts and rendering details */}
{filteredCarParts.map((carPart) => (
    <div
        key={carPart._id}
        className="bg-white rounded-lg shadow-md overflow-hidden relative"
    >
        {/* Car part image */}
        <img
            src={carPart.images} // Assuming there's an imageURL property in carPart
            alt={carPart.name} // Assuming there's a name property in carPart
            className="w-full h-45 object-contain"
            style={{ aspectRatio: '16/9' }} // Ensures images maintain aspect ratio
        />
        {/* Car part details */}
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-2 text-zinc">
                {carPart.name}
            </h2>
            <p className="text-gray-400 mb-2">
                Category: <span className="font-semibold">{carPart.category}</span>
            </p>
            <p className="text-gray-400 mb-2">
                SKU: <span className="font-semibold">{carPart.modelNumber}</span>
            </p>
            {/* Additional details can be added similarly */}
            {/* Buttons for editing and deleting */}
            <div className="flex justify-end">
                <button
                    onClick={() => handleEditClick(carPart)}
                    className="text-zinc font-semibold hover:text-zinc-[0.9]"
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(carPart._id)}
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
        </div>
      )}
      {/* Render edit modal when isEditModalOpen is true */}
      {isEditModalOpen && editCarPartData && (
        <EditCarPartForm partData={editCarPartData} onUpdate={handleUpdate} onClose={handleClose} allCarModels={allCarModels} />

      )}
    </>
  );
}

export default CarPartsListing;
