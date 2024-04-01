"use client"
import React, { useState } from "react";

const OrderForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    make: "",
    model: "",
    year: "",
    color: "",
    vin: "",
    status: "pending", // Default status
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/carpurchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle successful response
        console.log("Order submitted successfully!");
      } else {
        // Handle error response
        console.error("Failed to submit order");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto bg-white p-5">
      {/* Render form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="lastName">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="address">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="city">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="state">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="zipCode">
            Zip Code
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="make">
            Make
          </label>
          <input
            type="text"
            id="make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="model">
            Model
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="year">
            Year
          </label>
          <input
            type="text"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="color">
            Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="vin">
            VIN
          </label>
          <input
            type="text"
            id="vin"
            name="vin"
            value={formData.vin}
            onChange={handleChange}
            className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            required
          />
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="mt-3 px-8 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-zinc hover:bg-zinc/[0.9] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
      >
        Submit
      </button>
    </form>
  );
};

export default OrderForm;
