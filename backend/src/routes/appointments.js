const express = require('express');
const { Appointment } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// List appointments
router.get('/', auth(['admin', 'doctor', 'nurse']), async (req, res) => {
  const appointments = await Appointment.findAll();
  res.json(appointments);
});

// Create appointment (no conflict check, no status)
router.post('/', auth(['admin', 'doctor']), async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: 'Creation failed', details: err.message });
  }
});

// Get appointment by ID
router.get('/:id', auth(['admin', 'doctor', 'nurse']), async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id);
  if (!appointment) return res.status(404).json({ error: 'Not found' });
  res.json(appointment);
});

// Update appointment
router.put('/:id', auth(['admin', 'doctor']), async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id);
  if (!appointment) return res.status(404).json({ error: 'Not found' });
  await appointment.update(req.body);
  res.json(appointment);
});

// Delete appointment
router.delete('/:id', auth(['admin']), async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id);
  if (!appointment) return res.status(404).json({ error: 'Not found' });
  await appointment.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;