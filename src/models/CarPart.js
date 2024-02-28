const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define predefined categories
const predefinedCategories = ['Engine', 'Transmission', 'Brakes', 'Suspension', 'Electrical', 'Interior', 'Exterior', 'Other'];

const carPartSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: predefinedCategories // Enforce the category to be one of the predefined options
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  manufacturer: String,
  modelNumber: String,
  year: Number,
  compatibleCarModels: [String],
  images: [String],
  specifications: {
    type: Map,
    of: String
  }
});

const CarPart = mongoose.models.CarPart || mongoose.model('CarPart', carPartSchema);

export default CarPart;
