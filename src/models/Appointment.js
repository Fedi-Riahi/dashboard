import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  customerFirstName: {
    type: String,
    required: true
  },
  customerLastName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  carVIN: {
    type: String,
    required: true
  },
  plateNumber: {
    type: String,
    required: true
  },
  mileage: {
    type: Number,
    required: true
  },
  serviceType: {
    type: String,
    enum: ['Maintenance', 'Wheels', 'Transmission'],
    required: true
  },
  subServices: [String],
  appointmentDateOptions: [{
    date: { type: String, required: true },
    timesAvailable: [String]
  }],
  comment: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  },

}, {timestamps: true });

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
