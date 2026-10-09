import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  RadioGroup,
  Chip,
  Avatar,
  alpha,
} from '@mui/material';
import { Operator } from '../../types';
import { OPERATORS, OperatorInfo } from '../../constants/operators';

interface OperatorSelectionProps {
  selectedOperator: Operator | null;
  onOperatorChange: (operator: Operator) => void;
}

const OperatorSelection: React.FC<OperatorSelectionProps> = ({
  selectedOperator,
  onOperatorChange,
}) => {
  const handleOperatorSelect = (operator: Operator) => {
    onOperatorChange(operator);
  };

  return (
    <Box sx={{ mb: 3 }}>      
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <RadioGroup
          value={selectedOperator || ''}
          onChange={(e) => handleOperatorSelect(e.target.value as Operator)}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(4, 1fr)' 
            }, 
            gap: 2 
          }}>
            {OPERATORS.map((operator: OperatorInfo) => (
              <Box key={operator.id}>
                <Card
                  elevation={0}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '2px solid',
                    borderColor: selectedOperator === operator.id 
                      ? operator.color 
                      : 'transparent',
                    backgroundColor: 'background.paper',
                    boxShadow: selectedOperator === operator.id 
                      ? `0 10px 25px -5px ${alpha(operator.color, 0.4)}` 
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`,
                    },
                    height: '100%',
                    position: 'relative',
                    overflow: 'visible'
                  }}
                  onClick={() => handleOperatorSelect(operator.id)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box sx={{ position: 'relative', mb: 3 }}>
                      <Avatar
                        src={operator.logo}
                        alt={operator.name}
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          bgcolor: 'white',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      {selectedOperator === operator.id && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -10,
                            right: -10,
                            bgcolor: operator.color,
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </Box>
                      )}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {operator.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {operator.displayName}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                      {operator.primaryFeatures.map((feature, idx) => (
                        <Chip 
                          key={idx} 
                          label={feature} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.7rem', 
                            height: '20px',
                            borderColor: alpha(operator.color, 0.2),
                            color: operator.color,
                            bgcolor: alpha(operator.color, 0.05)
                          }} 
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default OperatorSelection;
