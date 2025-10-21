const express = require('express');
const { Record } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// List records
router.get('/', auth(['admin', 'doctor', 'nurse']), async (req, res) => {
  const records = await Record.findAll();
  res.json(records);
});

// Create record
router.post('/', auth(['admin', 'doctor']), async (req, res) => {
  try {
    const record = await Record.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: 'Creation failed', details: err.message });
  }
});

// Get record by ID
router.get('/:id', auth(['admin', 'doctor', 'nurse']), async (req, res) => {
  const record = await Record.findByPk(req.params.id);
  if (!record) return res.status(404).json({ error: 'Not found' });
  res.json(record);
});

// Update record
router.put('/:id', auth(['admin', 'doctor']), async (req, res) => {
  const record = await Record.findByPk(req.params.id);
  if (!record) return res.status(404).json({ error: 'Not found' });
  await record.update(req.body);
  res.json(record);
});

// Delete record
router.delete('/:id', auth(['admin']), async (req, res) => {
  const record = await Record.findByPk(req.params.id);
  if (!record) return res.status(404).json({ error: 'Not found' });
  await record.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;