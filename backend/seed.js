import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Donor } from './models/Donor.js';
import { Recipient } from './models/Recipient.js';

dotenv.config();

const sampleDonors = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.donor@example.com',
    password: 'password123',
    phone: '9876543210',
    age: 29,
    gender: 'Male',
    bloodGroup: 'O+',
    organType: 'Kidney',
    city: 'Mumbai',
    state: 'Maharashtra',
    medicalHistory: 'Healthy non-smoker, clean medical screening',
    status: 'Available'
  },
  {
    name: 'Dr. Ananya Iyer',
    email: 'ananya.donor@example.com',
    password: 'password123',
    phone: '9822334455',
    age: 34,
    gender: 'Female',
    bloodGroup: 'O-', // Universal donor!
    organType: 'Kidney',
    city: 'Pune',
    state: 'Maharashtra',
    medicalHistory: 'Physically fit, no prior conditions',
    status: 'Available'
  },
  {
    name: 'Vikram Patel',
    email: 'vikram.donor@example.com',
    password: 'password123',
    phone: '9845612345',
    age: 41,
    gender: 'Male',
    bloodGroup: 'A+',
    organType: 'Liver',
    city: 'Ahmedabad',
    state: 'Gujarat',
    medicalHistory: 'Non-alcoholic, healthy liver parameters',
    status: 'Available'
  },
  {
    name: 'Sunita Das',
    email: 'sunita.donor@example.com',
    password: 'password123',
    phone: '9811223344',
    age: 38,
    gender: 'Female',
    bloodGroup: 'B+',
    organType: 'Cornea',
    city: 'Delhi',
    state: 'Delhi',
    medicalHistory: 'Pledged post-mortem eye donation',
    status: 'Available'
  }
];

const sampleRecipients = [
  {
    name: 'Amit Verma',
    email: 'amit.patient@example.com',
    password: 'password123',
    phone: '9898989898',
    age: 45,
    gender: 'Male',
    bloodGroup: 'A+',
    organNeeded: 'Kidney',
    city: 'Mumbai',
    hospitalName: 'Lilavati Hospital & Research Centre',
    urgencyLevel: 'Critical',
    status: 'Waiting'
  },
  {
    name: 'Pooja Nair',
    email: 'pooja.patient@example.com',
    password: 'password123',
    phone: '9877112233',
    age: 32,
    gender: 'Female',
    bloodGroup: 'O+',
    organNeeded: 'Kidney',
    city: 'Pune',
    hospitalName: 'Ruby Hall Clinic',
    urgencyLevel: 'High',
    status: 'Waiting'
  },
  {
    name: 'Rohan Mehra',
    email: 'rohan.patient@example.com',
    password: 'password123',
    phone: '9866554433',
    age: 52,
    gender: 'Male',
    bloodGroup: 'A+',
    organNeeded: 'Liver',
    city: 'Ahmedabad',
    hospitalName: 'Sterling Hospital',
    urgencyLevel: 'Normal',
    status: 'Waiting'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/organ_donation');
    console.log('Connected to MongoDB for seeding...');

    await Donor.deleteMany({});
    await Recipient.deleteMany({});

    for (const donor of sampleDonors) {
      const d = new Donor(donor);
      await d.save();
    }
    console.log(`✅ Seeded ${sampleDonors.length} sample donors`);

    for (const rec of sampleRecipients) {
      const r = new Recipient(rec);
      await r.save();
    }
    console.log(`✅ Seeded ${sampleRecipients.length} sample recipients`);

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
