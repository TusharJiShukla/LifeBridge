import express from 'express';
import { Recipient } from '../models/Recipient.js';

const router = express.Router();

// Get all recipients (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { organNeeded, bloodGroup, city, urgencyLevel, status } = req.query;
    const filter = {};

    if (organNeeded) filter.organNeeded = organNeeded;
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = new RegExp(city, 'i');
    if (urgencyLevel) filter.urgencyLevel = urgencyLevel;
    if (status) filter.status = status;

    const recipients = await Recipient.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(recipients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single recipient by ID
router.get('/:id', async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.params.id).select('-password');
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });
    res.json(recipient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update recipient status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const recipient = await Recipient.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    res.json(recipient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
