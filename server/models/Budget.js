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

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: categories,
    required: true
  },
  month: {
    type: String, // Format: YYYY-MM
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
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

module.exports = mongoose.model('Budget', budgetSchema); 