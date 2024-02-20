import mongoose from 'mongoose';

const carPartsSchema = new mongoose.Schema({
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CarPartsCategories',
      },
  name: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const CarParts = mongoose.models.CarParts || mongoose.model('CarParts', carPartsSchema);

export default CarParts;
