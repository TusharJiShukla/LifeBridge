import express from 'express';
import { Donor } from '../models/Donor.js';
import { Recipient } from '../models/Recipient.js';
import { calculateMatchScore } from '../utils/matchingAlgorithm.js';

const router = express.Router();

// Get summary metrics for the platform
router.get('/summary', async (req, res) => {
  try {
    const totalDonors = await Donor.countDocuments();
    const availableDonors = await Donor.countDocuments({ status: 'Available' });
    const totalRecipients = await Recipient.countDocuments();
    const waitingRecipients = await Recipient.countDocuments({ status: 'Waiting' });

    res.json({
      totalDonors,
      availableDonors,
      totalRecipients,
      waitingRecipients,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Find and rank compatible donors for a specific recipient
router.get('/for-recipient/:recipientId', async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.params.recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Only match with available donors
    const donors = await Donor.find({ status: 'Available' }).select('-password');

    const matches = donors
      .map((donor) => {
        const matchResult = calculateMatchScore(recipient, donor);
        return {
          donor,
          ...matchResult,
        };
      })
      .filter((item) => item.isCompatible)
      .sort((a, b) => b.score - a.score);

    res.json({
      recipient,
      totalMatches: matches.length,
      matches,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Find and rank compatible recipients for a specific donor
router.get('/for-donor/:donorId', async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.donorId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Only match with waiting recipients
    const recipients = await Recipient.find({ status: 'Waiting' }).select('-password');

    const matches = recipients
      .map((recipient) => {
        const matchResult = calculateMatchScore(recipient, donor);
        return {
          recipient,
          ...matchResult,
        };
      })
      .filter((item) => item.isCompatible)
      .sort((a, b) => b.score - a.score);

    res.json({
      donor,
      totalMatches: matches.length,
      matches,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Quick match query (for guest exploring on the frontend)
router.post('/quick-check', async (req, res) => {
  try {
    const { organ, bloodGroup, city } = req.body;

    if (!organ || !bloodGroup) {
      return res.status(400).json({ message: 'Organ and Blood Group are required' });
    }

    const pseudoRecipient = {
      organNeeded: organ,
      bloodGroup: bloodGroup,
      city: city || '',
      urgencyLevel: 'Normal',
    };

    const donors = await Donor.find({ status: 'Available' }).select('-password');

    const matches = donors
      .map((donor) => {
        const result = calculateMatchScore(pseudoRecipient, donor);
        return {
          donor,
          ...result,
        };
      })
      .filter((item) => item.isCompatible)
      .sort((a, b) => b.score - a.score);

    res.json({
      query: { organ, bloodGroup, city },
      totalMatches: matches.length,
      matches,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
