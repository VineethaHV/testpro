const express = require('express');
const { Appointment } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Helper: check doctor availability for time slot
async function isDoctorAvailable(doctor, date, timeSlot) {
  const conflict = await Appointment.findOne({
    where: { doctor, date, timeSlot, status: 'scheduled' }
  });
  return !conflict;
}

// List appointments
router.get('/', auth(['admin', 'doctor', 'nurse']), async (req, res) => {
  const appointments = await Appointment.findAll();
  res.json(appointments);
});

// Create appointment with conflict check
router.post('/', auth(['admin', 'doctor']), async (req, res) => {
  try {
    const { doctor, date, timeSlot } = req.body;
    if (!await isDoctorAvailable(doctor, date, timeSlot)) {
      return res.status(409).json({ error: 'Doctor not available for this time slot' });
    }
    const appointment = await Appointment.create(req.body);
    // Notification stub (future integration)
    // notifyPatient(appointment.patientId, appointment);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: 'Creation failed', details: err.message });
  }
});

// Update appointment status
router.put('/:id/status', auth(['admin', 'doctor']), async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id);
  if (!appointment) return res.status(404).json({ error: 'Not found' });
  const { status } = req.body;
  if (!['scheduled', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  await appointment.update({ status });
  res.json(appointment);
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
  // If doctor/date/timeSlot changed, check availability
  const { doctor, date, timeSlot } = req.body;
  if ((doctor || date || timeSlot) && !await isDoctorAvailable(doctor || appointment.doctor, date || appointment.date, timeSlot || appointment.timeSlot)) {
    return res.status(409).json({ error: 'Doctor not available for this time slot' });
  }
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