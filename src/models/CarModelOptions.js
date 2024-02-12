// models/CarModelOptions.js
import mongoose from 'mongoose';

const carModelOptionsSchema = new mongoose.Schema({
  conditions: [{
    type: String,
    enum: ['New', 'Used'],
    required: true,
  }],
  types: [{
    type: String,
    enum: ['Convertible', 'Coupe', 'Hatchback', 'Sedan', 'SUV', 'Wagon'],
    required: true,
  }],
  driveTypes: [{
    type: String,
    enum: ['AWD/4WD', 'Front wheel drive', 'Rear wheel drive'],
    required: true,
  }],
  transmissions: [{
    type: String,
    enum: ['Automatic', 'Manual', 'Semi-Automatic'],
    required: true,
  }],
  fuelTypes: [{
    type: String,
    enum: ['Diesel', 'Petrol', 'Electric', 'Hybrid'],
    required: true,
  }],
  cylinders: [{
    type: Number,
    enum: [4, 5, 6, 8, 9, 10],
    required: true,
  }],
  colors: [{
    type: String,
    enum: ['Red', 'Blue', 'Green', 'White', 'Black', 'Silver', 'Gray', 'Other'],
    required: true,
  }],
  doors: [{
    type: Number,
    enum: [2, 4],
    required: true,
  }],
  features: [{
    type: String,
    enum: [
      '360-degree camera', 'Blind spot alert', 'Bluetooth', 'Cooled seats',
      'Heated seats', 'Keyless start', 'Leather seats', 'LED headlights',
      'Memory seat', 'Navigation System', 'Reversing camera', 'Side airbags',
      'Sound system', 'Traction Control', 'USB port',
    ],
  }],
  safetyFeatures: [{
    type: String,
    enum: [
      'Active head restraints', 'Adaptive headlights', 'Backup camera',
      'Blind-spot warning', 'Brake assist', 'Forward-collision warning',
      'Lane keeping assist', 'Parking assist systems', 'Pedestrian detection',
      'Sideview camera',
    ],
  }],
}, { timestamps: true });

const CarModelOptions = mongoose.models.CarModelOptions || mongoose.model('CarModelOptions', carModelOptionsSchema);

export default CarModelOptions;
