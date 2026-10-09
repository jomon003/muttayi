import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  IconButton,
  Paper,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TuneIcon from '@mui/icons-material/Tune';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useOperator } from '../context/OperatorContext';
import PlanFilters from '../components/filters/PlanFilters';
import FilteredPlanSearch from '../components/search/FilteredPlanSearch';
import { BaseUserPreferences, OTTService, Operator } from '../types';
import { getOTTServicesForOperator } from '../constants/ott';
import { PlanDataService } from '../utils/planService';

// Valid operators for URL validation
const VALID_OPERATORS: Operator[] = ['airtel', 'jio', 'bsnl', 'vi'];

const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  const { operator: urlOperator } = useParams<{ operator: string }>();
  const { selectedOperator, setSelectedOperator } = useOperator();
  const [showFilters, setShowFilters] = React.useState(false);

  // Determine the active operator: URL param takes priority, then context
  const activeOperator = useMemo(() => {
    if (urlOperator && VALID_OPERATORS.includes(urlOperator as Operator)) {
      return urlOperator as Operator;
    }
    return selectedOperator;
  }, [urlOperator, selectedOperator]);

  const [preferences, setPreferences] = React.useState<BaseUserPreferences>({
    operator: activeOperator || 'airtel',
    circle: undefined,
    dataPreference: null,
    dailyDataAmount: 2,
    hasDailyCaps: false,
    unlimitedDataType: null,
    fiveGPreference: null,
    callPreference: null,
    callMinutes: 300,
    smsPreference: null,
    smsPerDay: 100,
    ottPreference: null,
    selectedOTT: [],
    isGP2: false,
    isJK20: false,
    nightUnlimitedOnly: false,
  });

  // Handle URL param validation and context sync
  useEffect(() => {
    // If URL has operator param
    if (urlOperator) {
      // Invalid operator in URL - redirect to home
      if (!VALID_OPERATORS.includes(urlOperator as Operator)) {
        navigate('/');
        return;
      }
      // Valid operator - sync to context
      if (urlOperator !== selectedOperator) {
        setSelectedOperator(urlOperator as Operator);
      }
    } else {
      // No URL param (on /plans) - redirect if no context
      if (!selectedOperator) {
        navigate('/');
      }
    }
  }, [urlOperator, selectedOperator, setSelectedOperator, navigate]);

  const handleBack = () => {
    navigate('/');
  };

  const handlePreferenceChange = (key: keyof BaseUserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  // State for dynamically loaded OTT services
  const [dynamicOTTServices, setDynamicOTTServices] = useState<string[]>([]);

  // Load dynamic OTT services from plans
  useEffect(() => {
    const loadDynamicOTT = async () => {
      if (!activeOperator) return;

      try {
        const plans = await PlanDataService.loadOperatorPlans(activeOperator);
        const ottFromPlans = PlanDataService.extractOTTServicesFromPlans(plans);
        setDynamicOTTServices(ottFromPlans);
      } catch {
        setDynamicOTTServices([]);
      }
    };

    loadDynamicOTT();
  }, [activeOperator]);

  // Get operator-specific OTT services (dynamic for VI and Airtel, static for others)
  const availableOTTServices = useMemo((): OTTService[] => {
    if (!activeOperator) return [];

    // For VI and Airtel, use dynamic OTT services from plans
    if ((activeOperator === 'vi' || activeOperator === 'airtel') && dynamicOTTServices.length > 0) {
      return dynamicOTTServices.map(service => ({
        id: service.toLowerCase().replace(/[^a-z0-9]/g, ''),
        name: service,
        operators: [activeOperator],
        icon: ''
      }));
    }

    // For other operators, use static constants
    return getOTTServicesForOperator(activeOperator);
  }, [activeOperator, dynamicOTTServices]);

  if (!activeOperator) {
    return null; // Prevent flash of content during redirect
  }

  return (
    <Box sx={{ flex: 1, bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header with back button */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 4,
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={handleBack}
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                '&:hover': { bgcolor: 'background.paper', transform: 'translateX(-4px)' },
                transition: 'all 0.2s'
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {activeOperator.charAt(0).toUpperCase() + activeOperator.slice(1)} Plans
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Find the best value for your needs
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 4,
          alignItems: { xs: 'stretch', lg: 'flex-start' }
        }}>
          {/* Filters Sidebar */}
          <Box 
            sx={{ 
              width: { xs: '100%', lg: '380px' },
              flexShrink: 0,
              position: { lg: 'sticky' },
              top: { lg: 100 },
              height: { lg: 'fit-content' },
              maxHeight: { lg: 'calc(100vh - 120px)' },
              overflowY: { lg: 'auto' },
              pr: { lg: 1 }
            }}
          >
            <Paper
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'background.paper'
              }}
            >
              {/* Mobile Filter Toggle */}
              <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  endIcon={<ExpandMoreIcon sx={{ transform: showFilters ? 'rotate(180deg)' : 'none' }}/>}
                  fullWidth
                  sx={{
                    justifyContent: 'space-between',
                    p: 2,
                    color: 'text.primary'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Filters
                  </Typography>
                  <TuneIcon />
                </Button>
              </Box>

              {/* Filter Content */}
              <Box 
                sx={{ 
                  display: { xs: showFilters ? 'block' : 'none', lg: 'block' },
                  p: 3
                }}
              >
                <PlanFilters
                  selectedOperator={activeOperator}
                  preferences={preferences}
                  onPreferenceChange={handlePreferenceChange}
                  availableOTTServices={availableOTTServices}
                />
              </Box>
            </Paper>
          </Box>

          {/* Results Section */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <FilteredPlanSearch 
              preferences={preferences}
              onPreferenceChange={handlePreferenceChange}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PlansPage;
