/**
 * Biological ABO compatibility table for organ allocation.
 * Key: Recipient Blood Group -> Value: Array of acceptable Donor Blood Groups
 */
export const BLOOD_COMPATIBILITY = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
};

/**
 * Calculates compatibility and returns a score from 0 to 100%
 * with human-readable rationale.
 */
export const calculateMatchScore = (recipient, donor) => {
  // 1. Organ Check (Strict Requirement)
  if (recipient.organNeeded?.toLowerCase() !== donor.organType?.toLowerCase()) {
    return { isCompatible: false, score: 0, reasons: ['Organ type mismatch'] };
  }

  // 2. Blood Group Compatibility (Strict Requirement)
  const allowedDonors = BLOOD_COMPATIBILITY[recipient.bloodGroup] || [];
  const isBloodCompatible = allowedDonors.includes(donor.bloodGroup);

  if (!isBloodCompatible) {
    return {
      isCompatible: false,
      score: 0,
      reasons: [`Incompatible blood types: Recipient (${recipient.bloodGroup}) cannot receive from Donor (${donor.bloodGroup})`]
    };
  }

  let score = 0;
  const reasons = [];

  // Blood group points
  if (recipient.bloodGroup === donor.bloodGroup) {
    score += 50;
    reasons.push(`Exact blood group match (${donor.bloodGroup})`);
  } else {
    score += 40;
    reasons.push(`Biologically compatible blood group (${donor.bloodGroup} to ${recipient.bloodGroup})`);
  }

  // 3. Location / Proximity Check
  const recCity = recipient.city?.trim().toLowerCase();
  const donCity = donor.city?.trim().toLowerCase();
  const recState = recipient.state?.trim().toLowerCase();
  const donState = donor.state?.trim().toLowerCase();

  if (recCity && donCity && recCity === donCity) {
    score += 30;
    reasons.push('Same city (minimal transit time)');
  } else if (recState && donState && recState === donState) {
    score += 15;
    reasons.push('Same state');
  } else {
    score += 5;
    reasons.push('Inter-city allocation');
  }

  // 4. Urgency Factor
  if (recipient.urgencyLevel === 'Critical') {
    score += 15;
    reasons.push('Critical urgency priority');
  } else if (recipient.urgencyLevel === 'High') {
    score += 10;
    reasons.push('High urgency priority');
  } else {
    score += 5;
  }

  // 5. Medical History Check
  const med = (donor.medicalHistory || '').toLowerCase();
  if (!med || med.includes('none') || med.includes('healthy') || med.includes('fit')) {
    score += 5;
    reasons.push('Clear donor medical notes');
  }

  // Cap at 100
  const finalScore = Math.min(score, 100);

  return {
    isCompatible: true,
    score: finalScore,
    reasons
  };
};
