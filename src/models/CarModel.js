// models/CarModel.js
import mongoose from 'mongoose';

const carModelSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  listingTitle: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  inStock:{
    type: Boolean,
    required: true
  },
  condition: {
    type: String,
    enum: ['New', 'Used'],
    required: true,
  },
  type: {
    type: String,
    enum: ['Convertible', 'Coupe', 'Hatchback', 'Sedan', 'SUV', 'Wagon'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  driveType: {
    type: String,
    enum: ['AWD/4WD', 'Front wheel drive', 'Rear wheel drive'],
    required: true,
  },
  transmission: {
    type: String,
    enum: ['Automatic', 'Manual', 'Semi-Automatic'],
    required: true,
  },
  fuelType: {
    type: String,
    enum: ['Diesel', 'Petrol', 'Electric', 'Hybrid'],
    required: true,
  },
  engineSize: {
    type: Number,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },

trims:[{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Trims',
}],
overview:[{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Overview',
}],
  folderId: { // Adding folderId field
    type: String,
    required: true // Adjust as needed, if folderId is optional, remove this line
  },
  cylinders: {
    type: Number,
    enum: [4, 5, 6, 8, 9, 10],
    required: true,
  },
  color: {
    type: String,
    enum: ['Red', 'Blue', 'Green', 'White', 'Black', 'Silver', 'Gray', 'Other','Purple'],
    required: true,
  },
  doors: {
    type: Number,
    enum: [2, 4],
    required: true,
  },
  vin: {
    type: String,
    required: true,
  },
  interiorImages: [{
    type: String, // Assuming image URLs are stored as strings
  }],
  exteriorImages: [{
    type: String, // Assuming image URLs are stored as strings
  }],
  cardImages: [{
    type: String, // Assuming image URLs are stored as strings
  }],
  coverImage: [{
    type: String, // Assuming image URLs are stored as strings
  }],
  description: {
    type: String,
  },
  features: [{
    type: String,

  }],
  safetyFeatures: [{
    type: String,
  }],
}, { timestamps: true });

const CarModel = mongoose.models.CarModel || mongoose.model('CarModel', carModelSchema);

export default CarModel;