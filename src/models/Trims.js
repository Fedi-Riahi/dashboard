import mongoose from "mongoose";

const trimsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    model: {
      // Add model field
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    consommationWLTP: {
      type: Number,
    },
    emissions: {
      type: Number,
    },
    capacity: {
      type: Number,
    },
    fuelType: {
      type: String,
    },
    cylinders: {
      type: Number,
    },
    couple: {
      type: Number,
    },
    puissance: {
      type: Number,
    },
    compression: {
      type: String,
    },

    maxSpeed: {
      type: Number,
    },
    acceleration: {
      type: Number,
    },

    length: {
      type: Number,
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },

    driveType: {
      type: String,
    },
    transmission: {
      type: String,
    },
    transmissionType: {
      type: String,
    },

    places: {
      type: String,
    },
    doors: {
      type: String,
    },

    frontWheels: {
      type: String,
    },
    rearWheels: {
      type: String,
    },

    PTAC: {
      type: Number,
    },
    emptyWeight: {
      type: String,
    },
    maxCharge: {
      type: String,
    },
    trailerWeight: {
      type: Number,
    },
    roofWeight: {
      type: String,
    },
    trunkCapacity: {
      type: String,
    },
    onDemand: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Trims = mongoose.models.Trims || mongoose.model("Trims", trimsSchema);

export default Trims;
