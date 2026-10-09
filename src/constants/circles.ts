import { Circle, Operator } from '../types';

// BSNL Circles - codes must match database available_circles
export const BSNL_CIRCLES: Circle[] = [
  { code: 'AN', name: 'Andaman & Nicobar' },
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'AR', name: 'Arunachal Pradesh' },
  { code: 'AS', name: 'Assam' },
  { code: 'BR', name: 'Bihar' },
  { code: 'CT', name: 'Chhattisgarh' },
  { code: 'CH', name: 'Chandigarh UT' },
  { code: 'CN', name: 'Chennai' },
  { code: 'DN', name: 'Daman and Diu UT' },
  { code: 'DD', name: 'Dadra and Nagar Haveli UT' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'GA', name: 'Goa' },
  { code: 'HR', name: 'Haryana' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'JK', name: 'Jammu and Kashmir', hasJK20: true },
  { code: 'JH', name: 'Jharkhand' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'KL', name: 'Kerala' },
  { code: 'KO', name: 'Kolkata' },
  { code: 'LD', name: 'Lakshadweep UT' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'MN', name: 'Manipur' },
  { code: 'ML', name: 'Meghalaya' },
  { code: 'MZ', name: 'Mizoram' },
  { code: 'NL', name: 'Nagaland' },
  { code: 'OR', name: 'Odisha' },
  { code: 'PB', name: 'Punjab' },
  { code: 'PY', name: 'Puducherry UT' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'SK', name: 'Sikkim' },
  { code: 'TN', name: 'Tamilnadu' },
  { code: 'TS', name: 'Telangana' },
  { code: 'TR', name: 'Tripura' },
  { code: 'UE', name: 'UP East' },
  { code: 'UW', name: 'UP West' },
  { code: 'UK', name: 'Uttarakhand' },
  { code: 'WB', name: 'West Bengal' },
];

// Vi Circles
export const VI_CIRCLES: Circle[] = [
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'AS', name: 'Assam' },
  { code: 'BH', name: 'Bihar' },
  { code: 'CN', name: 'Chennai' },
  { code: 'DL', name: 'Delhi' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'HR', name: 'Haryana' },
  { code: 'JK', name: 'Jammu and Kashmir' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'KL', name: 'Kerala' },
  { code: 'KO', name: 'Kolkata' },
  { code: 'MH', name: 'Maharashtra and Goa' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'MU', name: 'Mumbai' },
  { code: 'NE', name: 'North East' },
  { code: 'OD', name: 'Odisha' },
  { code: 'PB', name: 'Punjab' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'TN', name: 'Tamil Nadu (except Chennai)' },
  { code: 'UE', name: 'UP East' },
  { code: 'UW', name: 'UP West' },
  { code: 'WB', name: 'West Bengal' },
];

// Map operators to circles (all operators that require circle selection)
export const OPERATOR_CIRCLES_MAP: Record<Operator, Circle[] | null> = {
  'bsnl': BSNL_CIRCLES,
  'vi': VI_CIRCLES,
  'airtel': null, // Airtel doesn't require circle selection
  'jio': null,    // Jio doesn't require circle selection
};

// Function to get circles for an operator
export const getCirclesForOperator = (operator: Operator): Circle[] | null => {
  return OPERATOR_CIRCLES_MAP[operator];
};

// Function to check if an operator needs circle selection
export const operatorNeedsCircleSelection = (operator: Operator): boolean => {
  return OPERATOR_CIRCLES_MAP[operator] !== null;
};
