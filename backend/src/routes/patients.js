const express = require('express');
const { Patient } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// List patients
router.get('/', auth(['admin', 'doctor', 'nurse']), async (req, res) => {
  const patients = await Patient.findAll();
  res.json(patients);
});

// Create patient
router.post('/', auth(['admin', 'doctor']), async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: 'Creation failed', details: err.message });
  }
});

// Get patient by ID
router.get('/:id', auth(['admin', 'doctor', 'nurse']), async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  if (!patient) return res.status(404).json({ error: 'Not found' });
  res.json(patient);
});

// Update patient
router.put('/:id', auth(['admin', 'doctor']), async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  if (!patient) return res.status(404).json({ error: 'Not found' });
  await patient.update(req.body);
  res.json(patient);
});

// Delete patient
router.delete('/:id', auth(['admin']), async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  if (!patient) return res.status(404).json({ error: 'Not found' });
  await patient.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;