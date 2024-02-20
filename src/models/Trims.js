import mongoose from "mongoose";

const trimsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    model: { // Add model field
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
        consommationWLTP: {
            type: Number,
            required: true,
        },
        emissions: {
            type: Number,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        fuelType: {
            type: String,
            required: true,
        },

        cylinders: {
            type: Number,
            required: true,
        },
        couple: {
            type: Number,
            required: true,
        },
        puissance: {
            type: Number,
            required: true,
        },
        compression: {
            type: String,
            required: true,
        },

        maxSpeed: {
            type: Number,
            required: true,
        },
        acceleration: {
            type: Number,
            required: true,
        },

        length: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        width: {
            type: Number,
            required: true,
        },

        driveType: {
            type: String,
            required: true,
        },
        transmission: {
            type: String,
            required: true,
        },
        transmissionType: {
            type: String,
            required: true,
        },


        places: {
            type: String,
            required: true,
        },
        doors: {
            type: String,
            required: true,
        },

        frontWheels: {
            type: String,
            required: true,
        },
        rearWheels: {
            type: String,
            required: true,
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
        required: true,
    }
}, { timestamps: true})

const Trims = mongoose.models.Trims || mongoose.model('Trims', trimsSchema);

export default Trims;