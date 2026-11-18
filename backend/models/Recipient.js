import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const recipientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password or PIN is required'],
      minlength: [4, 'Password must be at least 4 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [1, 'Valid age required'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true,
    },
    organNeeded: {
      type: String,
      enum: ['Kidney', 'Liver', 'Heart', 'Cornea', 'Lungs', 'Pancreas'],
      required: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital Name is required'],
      trim: true,
    },
    urgencyLevel: {
      type: String,
      enum: ['Normal', 'High', 'Critical'],
      default: 'Normal',
    },
    status: {
      type: String,
      enum: ['Waiting', 'Matched', 'Closed'],
      default: 'Waiting',
    },
  },
  { timestamps: true }
);

// Hash password before saving
recipientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password helper
recipientSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const Recipient = mongoose.model('Recipient', recipientSchema);
