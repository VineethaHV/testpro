const express = require('express');
const { Doctor, Provider } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// List doctors
router.get('/', auth(['admin']), async (req, res) => {
  const doctors = await Doctor.findAll({ include: Provider });
  res.json(doctors);
});

// Create doctor
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ error: 'Creation failed', details: err.message });
  }
});

// Get doctor by ID
router.get('/:id', auth(['admin']), async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id, { include: Provider });
  if (!doctor) return res.status(404).json({ error: 'Not found' });
  res.json(doctor);
});

// Update doctor
router.put('/:id', auth(['admin']), async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id);
  if (!doctor) return res.status(404).json({ error: 'Not found' });
  await doctor.update(req.body);
  res.json(doctor);
});

// Delete doctor
router.delete('/:id', auth(['admin']), async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id);
  if (!doctor) return res.status(404).json({ error: 'Not found' });
  await doctor.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;