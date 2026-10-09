import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { BaseUserPreferences, SortOption, NormalizedPlan, Operator } from '../../types';
import { PlanDataService, PlanFilter } from '../../utils/planService';
import PlanCard from '../results/PlanCard';
import { useOperator } from '../../context/OperatorContext';
import { operatorNeedsCircleSelection } from '../../constants/operators';

interface FilteredPlanSearchProps {
  preferences: BaseUserPreferences;
  onPreferenceChange: (key: keyof BaseUserPreferences, value: any) => void;
}

const FilteredPlanSearch: React.FC<FilteredPlanSearchProps> = ({
  preferences,
}) => {
  const { selectedOperator } = useOperator();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [allPlans, setAllPlans] = React.useState<NormalizedPlan[]>([]);
  const [filteredResults, setFilteredResults] = React.useState<NormalizedPlan[]>([]);
  const [sortBy, setSortBy] = React.useState<SortOption>('pricePerDay');
  const [sortAscending, setSortAscending] = React.useState<boolean>(true);

  // Check if circle selection is required but not selected
  const needsCircle = selectedOperator ? operatorNeedsCircleSelection(selectedOperator) : false;
  const circleNotSelected = needsCircle && !preferences.circle;

  // Load plans when operator changes (only if circle is not required or is selected)
  useEffect(() => {
    if (selectedOperator && !circleNotSelected) {
      loadPlans(selectedOperator);
    } else if (circleNotSelected) {
      // Clear plans when circle is required but not selected
      setAllPlans([]);
      setFilteredResults([]);
    }
  }, [selectedOperator, circleNotSelected]);

  // Filter plans when preferences change
  useEffect(() => {
    if (allPlans.length > 0) {
      const results = PlanFilter.filterPlans(allPlans, preferences);
      const sorted = PlanFilter.sortResults(results, sortBy, sortAscending);
      setFilteredResults(sorted);
    }
  }, [allPlans, preferences, sortBy, sortAscending]);

  const loadPlans = async (operator: Operator) => {
    setIsLoading(true);
    setError(null);
    try {
      const plans = await PlanDataService.loadOperatorPlans(operator);
      setAllPlans(plans);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plans');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      {/* Sort Options - Only show when plans are available */}
      {!circleNotSelected && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            {filteredResults.length} Plan{filteredResults.length !== 1 ? 's' : ''} Found
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                label="Sort by"
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="price">Plan Price</MenuItem>
                <MenuItem value="validity">Plan Validity</MenuItem>
                <MenuItem value="pricePerDay">Cost per Day</MenuItem>
                <MenuItem value="pricePerGB">Cost per GB</MenuItem>
                <MenuItem value="dataPerDay">Data per Day</MenuItem>
              </Select>
            </FormControl>

            <Tooltip title={sortAscending ? 'Ascending (Low to High)' : 'Descending (High to Low)'}>
              <IconButton
                onClick={() => setSortAscending(!sortAscending)}
                size="small"
                sx={{
                  bgcolor: alpha('#6366f1', 0.1),
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: alpha('#6366f1', 0.2),
                  },
                  width: 40,
                  height: 40,
                }}
              >
                {sortAscending ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Circle Selection Required */}
      {circleNotSelected && !isLoading && (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
          px: 4,
          width: '100%'
        }}>
          <LocationOnIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" color="text.primary" sx={{ mb: 1, fontWeight: 600 }}>
            Select Your Circle
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
            {selectedOperator === 'vi' ? 'Vi' : selectedOperator === 'bsnl' ? 'BSNL' : 'This operator'} plans vary by region. Please select your circle/state from the filters to view available plans.
          </Typography>
        </Box>
      )}

      {/* Empty State - Exclusive Mode */}
      {!isLoading && !error && filteredResults.length === 0 && selectedOperator === 'jio' && preferences.showOnlySpecialCategories && (
        <Box sx={{
          textAlign: 'center',
          py: 8,
          px: 4
        }}>
          <TuneIcon sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No plans to display
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enable at least one special category from the filters to view plans
          </Typography>
        </Box>
      )}

      {/* Results Grid */}
      {!isLoading && !error && filteredResults.length > 0 && (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          },
          gap: 3
        }}>
          {filteredResults.map((plan) => (
            <Box key={plan.id}>
              <PlanCard plan={plan} selectedOTT={preferences.selectedOTT} selectedCircle={preferences.circle} />
            </Box>
          ))}
        </Box>
      )}

      {/* No Results */}
      {!isLoading && !error && allPlans.length > 0 && filteredResults.length === 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No plans match your current filters. Try adjusting your preferences or reset filters.
        </Alert>
      )}
    </Box>
  );
};

export default FilteredPlanSearch;
