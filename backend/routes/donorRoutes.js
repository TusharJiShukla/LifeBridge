import express from 'express';
import { Donor } from '../models/Donor.js';

const router = express.Router();

// Get all donors (with optional filter for organType and bloodGroup)
router.get('/', async (req, res) => {
  try {
    const { organType, bloodGroup, city, status } = req.query;
    const filter = {};

    if (organType) filter.organType = organType;
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = new RegExp(city, 'i');
    if (status) filter.status = status;

    const donors = await Donor.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single donor by ID
router.get('/:id', async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id).select('-password');
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update donor status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
