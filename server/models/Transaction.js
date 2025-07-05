const mongoose = require('mongoose');

const categories = [
  'Food',
  'Housing',
  'Transport',
  'Utilities',
  'Entertainment',
  'Health',
  'Other'
];

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: categories,
    required: true
  },
  ownerId: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema); 