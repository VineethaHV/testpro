const express = require('express');
const { Provider } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// List providers
router.get('/', auth(['admin']), async (req, res) => {
  const providers = await Provider.findAll();
  res.json(providers);
});

// Create provider
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const provider = await Provider.create(req.body);
    res.status(201).json(provider);
  } catch (err) {
    res.status(400).json({ error: 'Creation failed', details: err.message });
  }
});

// Get provider by ID
router.get('/:id', auth(['admin']), async (req, res) => {
  const provider = await Provider.findByPk(req.params.id);
  if (!provider) return res.status(404).json({ error: 'Not found' });
  res.json(provider);
});

// Update provider
router.put('/:id', auth(['admin']), async (req, res) => {
  const provider = await Provider.findByPk(req.params.id);
  if (!provider) return res.status(404).json({ error: 'Not found' });
  await provider.update(req.body);
  res.json(provider);
});

// Delete provider
router.delete('/:id', auth(['admin']), async (req, res) => {
  const provider = await Provider.findByPk(req.params.id);
  if (!provider) return res.status(404).json({ error: 'Not found' });
  await provider.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;