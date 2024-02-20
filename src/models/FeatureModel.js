import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // Ensure each feature has a unique name
  },
}, { timestamps: true });

const FeatureModel = mongoose.models.FeatureModel || mongoose.model('FeatureModel', featureSchema);

export default FeatureModel;
