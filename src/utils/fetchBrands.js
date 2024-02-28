// fetchBrands.js
const fetchBrands = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/carbrand");
      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }
      const data = await response.json();
      return data.carBrand;
    } catch (error) {
      console.error("Error fetching brands:", error);
      throw error;
    }
  };
  
  export default fetchBrands;
  