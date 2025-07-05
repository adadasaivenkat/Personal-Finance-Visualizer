const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get all transactions (sorted by date desc)
router.get('/', async (req, res) => {
  try {
    const { ownerId } = req.query;
    if (!ownerId) return res.status(400).json({ error: 'ownerId required' });
    const transactions = await Transaction.find({ ownerId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new transaction
router.post('/', async (req, res) => {
  try {
    const { amount, date, description, category, ownerId } = req.body;
    if (!ownerId) return res.status(400).json({ error: 'ownerId required' });
    const transaction = new Transaction({ amount, date, description, category, ownerId });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit a transaction
router.patch('/:id', async (req, res) => {
  try {
    const { ownerId } = req.body;
    if (!ownerId) return res.status(400).json({ error: 'ownerId required' });
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, ownerId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ error: 'Not found or not authorized' });
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    const { ownerId } = req.query;
    if (!ownerId) return res.status(400).json({ error: 'ownerId required' });
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, ownerId });
    if (!transaction) return res.status(404).json({ error: 'Not found or not authorized' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 