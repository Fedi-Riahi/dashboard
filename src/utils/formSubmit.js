// formSubmit.js
const saveFormDataToMongoDB = async (formData) => {
    try {
      const response = await fetch("http://localhost:3000/api/carmodels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save data to MongoDB");
      }
  
      return response.json();
    } catch (error) {
      console.error("Error saving form data:", error);
      throw error;
    }
  };
  
  export default saveFormDataToMongoDB;
  