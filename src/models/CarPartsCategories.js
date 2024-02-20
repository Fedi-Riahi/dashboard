import mongoose from 'mongoose';

const carPartsCategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categories: {
    type: String,
    enum: ['Interior', 'Wheels', 'Floor Mats', 'Cargo', 'Covers', 'Door Sills','Belts','Suspension','Brakes','Filters','Lighting','Maintenance','Shocks','Wipers'],
    required: true,
  },
}, { timestamps: true });

const CarPartsCategories = mongoose.models.CarPartsCategories || mongoose.model('CarPartsCategories', carPartsCategoriesSchema);

export default CarPartsCategories;
