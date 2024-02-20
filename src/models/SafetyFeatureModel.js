import mongoose from 'mongoose';

const safetyFeatureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // Ensure each safety feature has a unique name
  },
}, { timestamps: true });

const SafetyFeatureModel = mongoose.models.SafetyFeatureModel || mongoose.model('SafetyFeatureModel', safetyFeatureSchema);

export default SafetyFeatureModel;
