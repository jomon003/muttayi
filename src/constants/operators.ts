import { Operator } from '../types';

export interface OperatorInfo {
  id: Operator;
  name: string;
  displayName: string;
  color: string;
  logo: string;
  primaryFeatures: string[];
  needsCircleSelection: boolean;
}

export const OPERATORS: OperatorInfo[] = [
  {
    id: 'airtel',
    name: 'Airtel',
    displayName: 'Bharti Airtel',
    color: '#E53E3E',
    logo: '/logo/Airtel.png',
    primaryFeatures: ['Wide Coverage', 'Good 4G/5G', 'OTT Benefits'],
    needsCircleSelection: false,
  },
  {
    id: 'jio',
    name: 'Jio',
    displayName: 'Reliance Jio',
    color: '#3182CE',
    logo: '/logo/Jio.png',
    primaryFeatures: ['Unlimited Data', '5G Ready', 'Digital Services'],
    needsCircleSelection: false,
  },
  {
    id: 'bsnl',
    name: 'BSNL',
    displayName: 'Bharat Sanchar Nigam Limited',
    color: '#38A169',
    logo: '/logo/BSNL.png',
    primaryFeatures: ['Budget Friendly', 'Rural Coverage', 'Government'],
    needsCircleSelection: true,
  },
  {
    id: 'vi',
    name: 'Vi',
    displayName: 'Vodafone Idea',
    color: '#805AD5',
    logo: '/logo/VI.avif',
    primaryFeatures: ['Night Data', 'Backup Data', 'Premium OTT'],
    needsCircleSelection: true,
  },
];

export const getOperatorInfo = (operatorId: Operator): OperatorInfo | undefined => {
  return OPERATORS.find(op => op.id === operatorId);
};

export const operatorNeedsCircleSelection = (operator: Operator): boolean => {
  const operatorInfo = getOperatorInfo(operator);
  return operatorInfo?.needsCircleSelection ?? false;
};