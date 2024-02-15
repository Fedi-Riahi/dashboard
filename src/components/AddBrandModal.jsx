"use client";
import { useState } from "react";
import BrandForm from "@/components/BrandForm";

const AddBrandModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Add Brand button */}
      <button
        onClick={openModal}
        className="bg-zinc text-white py-2 px-4 rounded hover:bg-zinc/[0.9]"
      >
        Add Brand
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
          <div className="bg-white w-full max-w-md p-6 rounded-lg z-10">
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-4">
              {/* BrandForm component */}
              <BrandForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBrandModal;
