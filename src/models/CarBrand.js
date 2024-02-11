import mongoose from 'mongoose';

const carBrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  models: [{
    type: String,
  }],
  coverImages: [{
    type: String,
  }],
  folderId: { // Adding folderId field
    type: String,
    required: true // Adjust as needed, if folderId is optional, remove this line
  }
}, { timestamps: true });

const CarBrand = mongoose.models.CarBrand || mongoose.model('CarBrand', carBrandSchema);

export default CarBrand;
