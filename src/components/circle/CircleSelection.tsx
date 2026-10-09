import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Operator } from '../../types';
import { operatorNeedsCircleSelection } from '../../constants/operators';
import { getCirclesForOperator } from '../../constants/circles';

interface CircleSelectionProps {
  selectedOperator: Operator | null;
  selectedCircle: string | null;
  onCircleChange: (circle: string | null) => void;
  showJK20Option?: boolean;
  onJK20Change?: (isJK20: boolean) => void;
  isJK20?: boolean;
}

const CircleSelection: React.FC<CircleSelectionProps> = ({
  selectedOperator,
  selectedCircle,
  onCircleChange,
  showJK20Option = false,
  onJK20Change,
}) => {
  if (!selectedOperator || !operatorNeedsCircleSelection(selectedOperator)) {
    return null;
  }

  // Get operator-specific circles
  const circles = getCirclesForOperator(selectedOperator) || [];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
        <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Select Your Circle
      </Typography>

      <FormControl fullWidth variant="outlined">
        <InputLabel>Select Circle/State</InputLabel>
        <Select
          value={selectedCircle || ''}
          onChange={(e) => onCircleChange(e.target.value || null)}
          label="Select Circle/State"
          sx={{ borderRadius: 1 }}
        >
          <MenuItem value="">
            <em>Select your state/circle</em>
          </MenuItem>
          {circles.map((circle) => (
            <MenuItem key={circle.code} value={circle.code} onClick={() => {
              if (circle.code === 'JK') {
                onJK20Change?.(false); // Reset JK20 when selecting J&K
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography>{circle.name}</Typography>
                {circle.hasJK20 && showJK20Option && (
                  <Chip
                    label="JK20"
                    size="small"
                    color="warning"
                    variant="outlined"
                    sx={{ ml: 'auto', fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CircleSelection;
