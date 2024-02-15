"use client";
import React, { useState, useEffect } from "react";

const CarBrandsList = () => {
  const [carBrands, setCarBrands] = useState([]);

  useEffect(() => {
    const fetchCarBrands = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/carbrand");
        if (!response.ok) {
          throw new Error("Failed to fetch car brands");
        }
        const data = await response.json();
        setCarBrands(data.carBrands);
      } catch (error) {
        console.error("Error fetching car brands:", error);
      }
    };

    fetchCarBrands();
  }, []);

  return (
    <div>
      <h2>Car Brands</h2>
      {carBrands.map((brand) => (
        <div key={brand._id}>
          <h3>{brand.name}</h3>
          <p>Models: {brand.models.join(", ")}</p>
          <div>
            {brand.coverImage.map((imageId) => (
              <img
                key={imageId}
                src={`/api/carBrands/images/${imageId}`} // Assuming endpoint for fetching images by ID
                alt="Cover Image"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarBrandsList;
