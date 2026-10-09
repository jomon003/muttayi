import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Stack,
  alpha,
  useTheme,
  FormControlLabel,
  Switch,
  Chip,
  Divider,
} from '@mui/material';
import { useScreenSize } from '../../hooks/useScreenSize';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import PhoneIcon from '@mui/icons-material/Phone';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import TuneIcon from '@mui/icons-material/Tune';
import SmsIcon from '@mui/icons-material/Sms';

import { BaseUserPreferences, Operator, OTTService } from '../../types';
import CircleSelection from '../circle/CircleSelection';
import { operatorNeedsCircleSelection } from '../../constants/operators';

interface PlanFiltersProps {
  selectedOperator: Operator;
  preferences: BaseUserPreferences;
  onPreferenceChange: (key: keyof BaseUserPreferences, value: any) => void;
  availableOTTServices: OTTService[];
}

export const PlanFilters: React.FC<PlanFiltersProps> = ({
  selectedOperator,
  preferences,
  onPreferenceChange,
  availableOTTServices,
}) => {
  const theme = useTheme();
  const { isXsScreen } = useScreenSize();

  // Label formatters
  const getDataLabel = (value: number, isSmallScreen: boolean) => {
    if (value < 1) {
      return isSmallScreen ? `${value * 1000}M` : `${value * 1000}MB`;
    }
    return isSmallScreen ? `${value}G` : `${value}GB`;
  };

  const getCallLabel = (value: number, isSmallScreen: boolean) => {
    return isSmallScreen ? `${value}m` : `${value}min`;
  };

  const getSmsLabel = (value: number, isSmallScreen: boolean) => {
    return isSmallScreen ? value.toString() : `${value} SMS`;
  };

  // Common slider styles
  const sliderStyles = {
    container: {
      px: {
        xs: 3,    // 24px padding on mobile
        sm: 4,    // 32px on tablets
        md: 2     // 16px on desktop
      },
      width: '100%'
    },
    slider: {
      '& .MuiSlider-markLabel': {
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem'
        },
        fontWeight: 500
      },
      '& .MuiSlider-mark': {
        height: {
          xs: 8,
          sm: 10
        }
      }
    }
  };

  // Popular OTT services to prioritize (in order of priority)
  const popularOTTs = ['amazonprime', 'jiohotstar', 'hotstar', 'netflix', 'sonyliv', 'zee5'];

  // Sort OTT services with popular ones first
  const sortedOTTServices = useMemo(() => {
    const normalizeKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

    const getPopularPriority = (service: OTTService): number => {
      const normalizedId = normalizeKey(service.id);
      const normalizedName = normalizeKey(service.name);
      for (let i = 0; i < popularOTTs.length; i++) {
        if (normalizedId === popularOTTs[i] ||
            normalizedName === popularOTTs[i] ||
            normalizedId.includes(popularOTTs[i]) ||
            normalizedName.includes(popularOTTs[i]) ||
            popularOTTs[i].includes(normalizedId) ||
            popularOTTs[i].includes(normalizedName)) {
          return i;
        }
      }
      return popularOTTs.length; // Non-popular services get lowest priority
    };

    return [...availableOTTServices].sort((a, b) => {
      return getPopularPriority(a) - getPopularPriority(b);
    });
  }, [availableOTTServices]);

  return (
    <Stack spacing={4}>
      {/* Circle Selection */}
      {operatorNeedsCircleSelection(selectedOperator) && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.primary' }}>
            Select Circle
          </Typography>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'visible'
            }}
          >
          <CardContent sx={{ p: 3 }}>
            <CircleSelection
              selectedOperator={selectedOperator}
              selectedCircle={preferences.circle || null}
              onCircleChange={(circle) => onPreferenceChange('circle', circle)}
              showJK20Option={true}
              isJK20={preferences.isJK20}
              onJK20Change={(isJK20) => onPreferenceChange('isJK20', isJK20)}
            />
          </CardContent>
        </Card>
        </Box>
      )}

      {/* Data & Network Section */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'visible'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <DataUsageIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Data & Network
            </Typography>
          </Box>
          
          <Stack spacing={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Data Type</InputLabel>
              <Select
                value={preferences.dataPreference ?? 'no_preference'}
                label="Data Type"
                onChange={(e) => {
                  const value = e.target.value === 'no_preference' ? null : e.target.value;
                  onPreferenceChange('dataPreference', value);
                  if (value !== 'unlimited') {
                    onPreferenceChange('hasDailyCaps', undefined);
                    onPreferenceChange('unlimitedDataType', null);
                  }
                }}
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="no_preference">No Preference</MenuItem>
                <MenuItem value="unlimited">Unlimited Data</MenuItem>
                <MenuItem value="limited">Limited Data</MenuItem>
              </Select>
            </FormControl>

            {preferences.dataPreference === 'unlimited' && (
              <FormControl fullWidth variant="outlined">
                <InputLabel>Unlimited Data Type</InputLabel>
                <Select
                  value={preferences.unlimitedDataType ?? 'any'}
                  onChange={(e) => {
                    const value = e.target.value === 'any' ? null : e.target.value;
                    onPreferenceChange('unlimitedDataType', value);
                  }}
                  label="Unlimited Data Type"
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="with_cap">With Daily Data Cap</MenuItem>
                  <MenuItem value="without_cap">Without Daily Data Cap</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* Data Amount Slider */}
            {(preferences.dataPreference === 'limited' || 
              (preferences.dataPreference === 'unlimited' && preferences.unlimitedDataType)) && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Daily Data Usage
                </Typography>
                <Box sx={sliderStyles.container}>
                  <Slider
                    value={preferences.dailyDataAmount ?? 1.5}
                    onChange={(_, value) => onPreferenceChange('dailyDataAmount', value)}
                    min={0.05}
                    max={3}
                    step={0.05}
                    marks={[
                      { value: 0.05, label: getDataLabel(0.05, isXsScreen) },
                      { value: 1.5, label: getDataLabel(1.5, isXsScreen) },
                      { value: 3, label: getDataLabel(3, isXsScreen) }
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => getDataLabel(value, isXsScreen)}
                    sx={sliderStyles.slider}
                  />
                </Box>
              </Box>
            )}

            {(selectedOperator === 'airtel' || selectedOperator === 'jio') && (
              <FormControl fullWidth variant="outlined">
                <InputLabel>5G Preference</InputLabel>
                <Select
                  value={preferences.fiveGPreference ?? 'no_preference'}
                  onChange={(e) => {
                    const value = e.target.value === 'no_preference' ? null : e.target.value;
                    onPreferenceChange('fiveGPreference', value);
                  }}
                  label="5G Preference"
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="no_preference">No Preference</MenuItem>
                  <MenuItem value="yes">5G Required</MenuItem>
                  <MenuItem value="no">5G Not Required</MenuItem>
                </Select>
              </FormControl>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Calls Section */}
      <Card 
        variant="outlined" 
        sx={{ 
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          '&:hover': {
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`
          },
          transition: 'box-shadow 0.3s ease'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PhoneIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Calls
            </Typography>
          </Box>
          
          <Stack spacing={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Call Type</InputLabel>
              <Select
                value={preferences.callPreference ?? 'no_preference'}
                label="Call Type"
                onChange={(e) => {
                  const value = e.target.value === 'no_preference' ? null : e.target.value;
                  onPreferenceChange('callPreference', value);
                }}
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="no_preference">No Preference</MenuItem>
                <MenuItem value="unlimited">Unlimited Calls</MenuItem>
                <MenuItem value="limited">Limited Calls</MenuItem>
              </Select>
            </FormControl>

            {preferences.callPreference === 'limited' && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Daily Call Minutes
                </Typography>
                <Box sx={sliderStyles.container}>
                  <Slider
                    value={preferences.callMinutes ?? 150}
                    onChange={(_, value) => onPreferenceChange('callMinutes', value)}
                    min={1}
                    max={300}
                    marks={[
                      { value: 1, label: getCallLabel(1, isXsScreen) },
                      { value: 150, label: getCallLabel(150, isXsScreen) },
                      { value: 300, label: getCallLabel(300, isXsScreen) }
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => getCallLabel(value, isXsScreen)}
                    sx={sliderStyles.slider}
                  />
                </Box>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* SMS Section */}
      <Card 
        variant="outlined" 
        sx={{ 
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          '&:hover': {
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`
          },
          transition: 'box-shadow 0.3s ease'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SmsIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Messages
            </Typography>
          </Box>
          
          <Stack spacing={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>SMS Preference</InputLabel>
              <Select
                value={preferences.smsPreference ?? 'no_preference'}
                label="SMS Preference"
                onChange={(e) => {
                  const value = e.target.value === 'no_preference' ? null : e.target.value;
                  onPreferenceChange('smsPreference', value);
                }}
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="no_preference">No Preference</MenuItem>
                <MenuItem value="with">With SMS</MenuItem>
                <MenuItem value="without">Without SMS</MenuItem>
              </Select>
            </FormControl>

            {preferences.smsPreference === 'with' && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Daily SMS Limit
                </Typography>
                <Box sx={sliderStyles.container}>
                  <Slider
                    value={preferences.smsPerDay ?? 50}
                    onChange={(_, value) => onPreferenceChange('smsPerDay', value)}
                    min={1}
                    max={100}
                    marks={[
                      { value: 1, label: getSmsLabel(1, isXsScreen) },
                      { value: 50, label: getSmsLabel(50, isXsScreen) },
                      { value: 100, label: getSmsLabel(100, isXsScreen) }
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => getSmsLabel(value, isXsScreen)}
                    sx={sliderStyles.slider}
                  />
                </Box>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Special Options for BSNL */}
      {selectedOperator === 'bsnl' && (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 2,
            border: `1px solid ${alpha('#ff9800', 0.2)}`,
            '&:hover': {
              boxShadow: `0 4px 20px ${alpha('#ff9800', 0.1)}`
            },
            transition: 'box-shadow 0.3s ease'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TuneIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Special Options
              </Typography>
            </Box>

            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.isGP2}
                    onChange={(e) => onPreferenceChange('isGP2', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#ff9800',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#ff9800',
                      }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Include GP2 Plans
                  </Typography>
                }
              />
              {preferences.circle === 'JK' && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.isJK20}
                      onChange={(e) => onPreferenceChange('isJK20', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#ff9800',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#ff9800',
                        }
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Include JK20 Plans
                    </Typography>
                  }
                />
              )}
              {/* CUG Police Plans - only for TN/CN/PY circles */}
              {(preferences.circle === 'TN' || preferences.circle === 'CN' || preferences.circle === 'PY') && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.includeCUGPolicePlans || false}
                      onChange={(e) => onPreferenceChange('includeCUGPolicePlans', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#1e40af',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#1e40af',
                        }
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Show Police CUG Plans
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666666', display: 'block', mt: 0.5 }}>
                        Special plans for Tamil Nadu Police personnel
                      </Typography>
                    </Box>
                  }
                />
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Special Categories for Jio */}
      {selectedOperator === 'jio' && (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 2,
            border: `1px solid ${alpha(preferences.showOnlySpecialCategories ? '#ff9800' : theme.palette.primary.main, 0.2)}`,
            '&:hover': {
              boxShadow: `0 4px 20px ${alpha(preferences.showOnlySpecialCategories ? '#ff9800' : theme.palette.primary.main, 0.1)}`
            },
            transition: 'all 0.3s ease'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TuneIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Special Categories
              </Typography>
            </Box>

            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.includeDataPacks || false}
                    onChange={(e) => onPreferenceChange('includeDataPacks', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Include Data Packs & Add-ons
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666666', display: 'block', mt: 0.5 }}>
                      Show data packs, OTT passes and memberships (no calls) that need an active base plan
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.includeJioPhone || false}
                    onChange={(e) => onPreferenceChange('includeJioPhone', e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Include Plans for JioPhone
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.includeJioPhonePrima || false}
                    onChange={(e) => onPreferenceChange('includeJioPhonePrima', e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Include Plans for JioPhone Prima
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.includeJioBharat || false}
                    onChange={(e) => onPreferenceChange('includeJioBharat', e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Include Plans for JioBharat Phone
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.includeJioPhoneAddon || false}
                    onChange={(e) => onPreferenceChange('includeJioPhoneAddon', e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Include JioPhone Data Add-ons
                  </Typography>
                }
              />

              <Divider sx={{ my: 1 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.showOnlySpecialCategories || false}
                    onChange={(e) => onPreferenceChange('showOnlySpecialCategories', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#ff9800',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#ff9800',
                      }
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Show Only Selected Categories
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666666', display: 'block', mt: 0.5 }}>
                      Hide regular plans and show only enabled categories above
                    </Typography>
                  </Box>
                }
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Special Options for VI */}
      {selectedOperator === 'vi' && (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            '&:hover': {
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`
            },
            transition: 'box-shadow 0.3s ease'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TuneIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Special Options
              </Typography>
            </Box>

            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.includeNoValidityPlans || false}
                    onChange={(e) => onPreferenceChange('includeNoValidityPlans', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Include Add-on Packs
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666666', display: 'block', mt: 0.5 }}>
                      Show data/subscription packs that don't extend SIM validity
                    </Typography>
                  </Box>
                }
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Special Options for Airtel */}
      {selectedOperator === 'airtel' && (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            '&:hover': {
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`
            },
            transition: 'box-shadow 0.3s ease'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TuneIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Special Options
              </Typography>
            </Box>

            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.includeAirtelDataPacks || false}
                    onChange={(e) => onPreferenceChange('includeAirtelDataPacks', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Include Data Add-on Packs
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666666', display: 'block', mt: 0.5 }}>
                      Show data packs that require an active base plan
                    </Typography>
                  </Box>
                }
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* OTT & Entertainment Section - Not shown for BSNL */}
      {selectedOperator !== 'bsnl' && (
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'visible'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LiveTvIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Subscriptions
              </Typography>
            </Box>

            <Stack spacing={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Subscription Services</InputLabel>
                <Select
                  value={preferences.ottPreference ?? 'no_preference'}
                  onChange={(e) => {
                    const value = e.target.value === 'no_preference' ? null : e.target.value;
                    onPreferenceChange('ottPreference', value);
                    if (value !== 'yes') {
                      onPreferenceChange('selectedOTT', []);
                    }
                  }}
                  label="Subscription Services"
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="no_preference">No Preference</MenuItem>
                  <MenuItem value="yes">With Subscriptions</MenuItem>
                  <MenuItem value="no">Subscriptions Not Required</MenuItem>
                </Select>
              </FormControl>

              {preferences.ottPreference === 'yes' && sortedOTTServices.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                    Available for {selectedOperator.toUpperCase()}:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {sortedOTTServices.map((service) => (
                      <Chip
                        key={service.id}
                        label={service.name}
                        variant={preferences.selectedOTT?.includes(service.id) ? 'filled' : 'outlined'}
                        onClick={() => {
                          const currentOTT = preferences.selectedOTT || [];
                          const newOTT = currentOTT.includes(service.id)
                            ? currentOTT.filter(s => s !== service.id)
                            : [...currentOTT, service.id];
                          onPreferenceChange('selectedOTT', newOTT);
                        }}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 2,
                          '&.MuiChip-filled': {
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark
                            }
                          },
                          '&.MuiChip-outlined': {
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1)
                            }
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default PlanFilters;
