import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
} from '@mui/material';
import OperatorSelection from '../components/operator/OperatorSelection';
import { Operator } from '../types';
import { useOperator } from '../context/OperatorContext';

const OperatorPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedOperator, setSelectedOperator } = useOperator();

  const handleOperatorSelect = (operator: Operator) => {
    setSelectedOperator(operator);
    navigate(`/${operator}`);
  };

  return (
    <Box sx={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      py: 4,
      px: 2
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              mb: 2, 
              color: 'text.primary',
              letterSpacing: '-0.02em'
            }}
          >
            Choose Your Network
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400
            }}
          >
            Select your operator to find the best prepaid plans tailored for you.
          </Typography>
        </Box>
        
        <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
          <OperatorSelection
            selectedOperator={selectedOperator}
            onOperatorChange={handleOperatorSelect}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default OperatorPage;
