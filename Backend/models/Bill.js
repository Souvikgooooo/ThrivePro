const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServiceRequest',
    required: [true, 'Bill must belong to a service request']
  },
  amount: {
    type: Number,
    required: [true, 'Please enter bill amount']
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },
  generated_at: {
    type: Date,
    default: Date.now
  }
});

// Check if the model already exists before compiling it
module.exports = mongoose.models.Bill || mongoose.model('Bill', billSchema);
