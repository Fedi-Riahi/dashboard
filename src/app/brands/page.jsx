"use client";
import React, { useState, useEffect } from "react";
import AddBrandModal from "@/components/AddBrandModal";
import EditBrandModal from "@/components/EditBrandModal";

function Brand() {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [editBrand, setEditBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/carbrand");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("Response data:", data);

        const carBrandArray = Array.isArray(data.carBrand) ? data.carBrand : [];
        console.log("Brands data:", carBrandArray);

        setBrands(carBrandArray);
        setFilteredBrands(carBrandArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter brands based on search term
    const filtered = brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
  }, [brands, searchTerm]);

  const handleEditBrand = (brand) => {
    setEditBrand(brand);
  };

  const handleDeleteBrand = async (id) => {
    try {
      // Delete the brand
      const response = await fetch(`http://localhost:3000/api/carbrand/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete brand");
      }

      // Filter out the deleted brand from the brands array
      setBrands((prevBrands) => prevBrands.filter((brand) => brand._id !== id));

      // Delete related carmodels
      const responseModels = await fetch(
        `http://localhost:3000/api/carmodels/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!responseModels.ok) {
        throw new Error("Failed to delete carmodels associated with the brand");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  const handleUpdateBrand = (updatedBrand) => {
    setBrands((prevBrands) =>
      prevBrands.map((brand) =>
        brand._id === updatedBrand._id ? updatedBrand : brand
      )
    );
    setEditBrand(null);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setFilteredBrands(
      brands.filter(
        (brand) =>
          brand.name.toLowerCase().includes(searchTerm) ||
          (brand.listingTitle &&
            brand.listingTitle.toLowerCase().includes(searchTerm)) // Check if listingTitle exists
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-xl font-bold">Brand Management</h1>
        <AddBrandModal />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by brand name or listing title"
          onChange={handleSearch}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Brand Name
              </th>
              <th scope="col" className="px-6 py-3">
                Models
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Cover Images
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => (
              <tr
                key={brand._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {brand.name}
                </td>
                <td className="px-6 py-4">{brand.models}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    {brand.coverImages.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`Cover ${index}`}
                        className="w-10 h-10 object-cover rounded-full mr-2"
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEditBrand(brand)}
                    className="font-medium text-zinc  hover:text-zinc/[0.8]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(brand._id)}
                    className="ml-2 font-medium text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editBrand && (
        <EditBrandModal
          folderId={editBrand.folderId}
          brand={editBrand}
          onClose={() => setEditBrand(null)}
          onUpdate={handleUpdateBrand}
        />
      )}
    </div>
  );
}

export default Brand;
