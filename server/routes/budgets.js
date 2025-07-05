const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const { ownerId } = req.query;
    if (!ownerId) return res.status(400).json({ error: 'ownerId required' });
    const budgets = await Budget.find({ ownerId });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new budget
router.post('/', async (req, res) => {
  try {
    const { category, month, amount, ownerId } = req.body;
    if (!ownerId) return res.status(400).json({ error: 'ownerId required' });
    const budget = new Budget({ category, month, amount, ownerId });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit a budget
router.patch('/:id', async (req, res) => {
  try {
    const { ownerId } = req.body;
    if (!ownerId) return res.status(400).json({ error: 'ownerId required' });
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, ownerId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!budget) return res.status(404).json({ error: 'Not found or not authorized' });
    res.json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a budget
router.delete('/:id', async (req, res) => {
  try {
    const { ownerId } = req.query;
    if (!ownerId) return res.status(400).json({ error: 'ownerId required' });
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, ownerId });
    if (!budget) return res.status(404).json({ error: 'Not found or not authorized' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 