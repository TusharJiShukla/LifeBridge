import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Donor } from '../models/Donor.js';
import { Recipient } from '../models/Recipient.js';

const autoSeedData = async () => {
  try {
    const donorCount = await Donor.countDocuments();
    if (donorCount === 0) {
      await Donor.create([
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
      ]);
      console.log('🌱 Seeded default donors into MongoDB Atlas');
    }

    const recipientCount = await Recipient.countDocuments();
    if (recipientCount === 0) {
      await Recipient.create([
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
      ]);
      console.log('🌱 Seeded default recipients into MongoDB Atlas');
    }
  } catch (err) {
    console.error('Seeding notice:', err.message);
  }
};

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`✅ Connected to MongoDB Atlas: ${conn.connection.host}`);
      console.log(`📁 Database Name: ${conn.connection.name}`);
      await autoSeedData();
      return;
    } catch (err) {
      console.warn(`⚠️ Failed to connect to primary MONGO_URI: ${err.message}`);
    }
  }

  // Fallback to in-memory if remote is unavailable
  try {
    const mongod = await MongoMemoryServer.create();
    const fallbackUri = mongod.getUri();
    await mongoose.connect(fallbackUri);
    console.log(`✅ Connected to In-Memory MongoDB Engine: ${fallbackUri}`);
    await autoSeedData();
  } catch (fallbackErr) {
    console.error('❌ MongoDB initialization error:', fallbackErr.message);
  }
};
