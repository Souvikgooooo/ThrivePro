const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Request must belong to a service']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Request must belong to a customer']
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Request must belong to a provider']
  },
  time_slot: {
    type: Date,
    required: [true, 'Please select a time slot']
  },
  serviceNameSnapshot: {
    type: String,
    required: [true, 'Service name snapshot is required at the time of booking']
  },
  servicePriceSnapshot: {
    type: Number,
    required: [true, 'Service price snapshot is required at the time of booking']
  },
  customerAddress: { // Address where the service will be provided
    type: String,
    // required: [true, 'Customer address is required for the service'] // Making it optional for now
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'in-progress', 'PaymentCompleted'], // Added 'PaymentCompleted'
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
