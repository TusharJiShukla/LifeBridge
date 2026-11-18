import { calculateMatchScore, BLOOD_COMPATIBILITY } from './utils/matchingAlgorithm.js';

console.log('Testing Blood Compatibility Matrix:');
console.log('AB+ can receive from O-:', BLOOD_COMPATIBILITY['AB+'].includes('O-')); // true
console.log('O- can receive from AB+:', BLOOD_COMPATIBILITY['O-'].includes('AB+')); // false

const recipientCritical = {
  organNeeded: 'Kidney',
  bloodGroup: 'A+',
  city: 'Mumbai',
  state: 'Maharashtra',
  urgencyLevel: 'Critical'
};

const donorLocal = {
  organType: 'Kidney',
  bloodGroup: 'A+',
  city: 'Mumbai',
  state: 'Maharashtra',
  medicalHistory: 'Healthy, no past surgeries'
};

const donorDifferentCity = {
  organType: 'Kidney',
  bloodGroup: 'O-',
  city: 'Delhi',
  state: 'Delhi',
  medicalHistory: 'None'
};

const donorIncompatible = {
  organType: 'Kidney',
  bloodGroup: 'B+',
  city: 'Mumbai',
  state: 'Maharashtra'
};

console.log('\nMatch 1 (Local + Exact Blood + Critical):', calculateMatchScore(recipientCritical, donorLocal));
console.log('\nMatch 2 (Remote + Universal O- Donor):', calculateMatchScore(recipientCritical, donorDifferentCity));
console.log('\nMatch 3 (Incompatible Blood Group B+ to A+):', calculateMatchScore(recipientCritical, donorIncompatible));
