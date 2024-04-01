import mongoose from "mongoose";

const carPurchaseSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    zipCode:{
        type: String,
        required: true,
    },
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    vin: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['confirmed', 'pending', 'declined'],
        required: true,
    },
}, { timestamps: true });

const PurchaseModel = mongoose.models.PurchaseModel || mongoose.model('PurchaseModel', carPurchaseSchema);

export default PurchaseModel;
