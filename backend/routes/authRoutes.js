import express from 'express';
import { Donor } from '../models/Donor.js';
import { Recipient } from '../models/Recipient.js';

const router = express.Router();

// Register a Donor or Recipient
router.post('/register', async (req, res) => {
  try {
    const { role, ...userData } = req.body;

    if (!role || !['donor', 'recipient'].includes(role)) {
      return res.status(400).json({ message: 'Valid role (donor or recipient) is required' });
    }

    const Model = role === 'donor' ? Donor : Recipient;

    // Check existing email
    const existing = await Model.findOne({ email: userData.email?.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: `A ${role} with this email already exists` });
    }

    const newRecord = new Model(userData);
    await newRecord.save();

    // Do not return password in response
    const sanitized = newRecord.toObject();
    delete sanitized.password;

    res.status(201).json({
      message: `${role === 'donor' ? 'Donor' : 'Recipient'} registered successfully!`,
      user: { ...sanitized, role }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Simple Login (Option B - Email + Password/PIN, no JWT)
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    const Model = role === 'donor' ? Donor : Recipient;
    const user = await Model.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: `No ${role} found with this email` });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password or PIN' });
    }

    const sanitized = user.toObject();
    delete sanitized.password;

    res.status(200).json({
      message: 'Login successful!',
      user: { ...sanitized, role }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;
