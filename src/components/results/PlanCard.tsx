import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  alpha,
  Divider,
  Stack,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  DataUsage as DataIcon,
  Phone as PhoneIcon,
  Sms as SmsIcon,
  FiveG as FiveGIcon,
  InfoOutlined as InfoIcon,
  ReportProblemOutlined as ReportIcon,
  ShareOutlined as ShareIcon,
} from '@mui/icons-material';
import { NormalizedPlan } from '../../types';
import ReportIssueModal from './ReportIssueModal';
import SharePlanModal from './SharePlanModal';

interface PlanCardProps {
  plan: NormalizedPlan;
  selectedOTT?: string[];
  selectedCircle?: string | null;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, selectedOTT = [], selectedCircle }) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const formatValidity = (days: number) => {
    return `${days} Days Validity`;
  };

  const formatDataAmount = (gb: number, suffix: string) => {
    if (gb < 0.5) {
      return `${Math.round(gb * 1024)}MB ${suffix}`;
    }
    return `${gb}GB ${suffix}`;
  };

  const formatData = (data: NormalizedPlan['data']) => {
    if (data.isUnlimited) {
      if (data.perDay) {
        return `Unlimited (${formatDataAmount(data.perDay, '/day').trim()})`;
      }
      if (data.total) {
        return formatDataAmount(data.total, 'total');
      }
      return 'Truly Unlimited';
    }
    if (data.perDay) {
      return formatDataAmount(data.perDay, '/day').trim();
    }
    if (data.total) {
      return formatDataAmount(data.total, 'total');
    }
    return 'No data';
  };

  const formatVoice = (voice: NormalizedPlan['voice']) => {
    if (voice.isUnlimited) return 'Unlimited calls';
    if (voice.minutes) return `${voice.minutes} minutes`;
    return 'No voice';
  };

  const formatSMS = (sms: NormalizedPlan['sms']) => {
    if (sms.perDay) return `${sms.perDay} SMS/day`;
    if (sms.total) return `${sms.total} SMS total`;
    return 'No SMS';
  };

  const normalizeOTTKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  const getOTTDisplayName = (service: string): string => {
    const ottMap: Record<string, string> = {
      'hotstar': 'JioHotstar',
      'jiohotstar': 'JioHotstar',
      'sonyliv': 'Sony LIV',
      'zee5': 'ZEE5',
      'jiotv': 'JioTV',
      'jiosaavn': 'JioSaavn Pro',
      'discovery_plus': 'Discovery+',
      'discoveryplus': 'Discovery+',
      'amazon_prime': 'Amazon Prime',
      'amazonprime': 'Amazon Prime',
      'fancode': 'FanCode',
      'netflix': 'Netflix',
      'vi_movies': 'Vi Movies',
      'jiocinema': 'JioCinema',
      'jiocloud': 'JioCloud',
      'mxplayer': 'MX Player',
      'yupptv': 'YuppTV',
      'distrotv': 'DistroTV',
      'shemaroome': 'ShemarooMe',
      'shemaroomegujarati': 'ShemarooMe Gujarati',
      'shemaroomemarathi': 'ShemarooMe Marathi',
      'manorama': 'Manorama MAX',
      'manoramamax': 'Manorama MAX',
      'addatimes': 'Addatimes',
      'klikk': 'Klikk',
      'chaupal': 'Chaupal',
      'lionsgate': 'Lionsgate Play',
      'lionsgateplay': 'Lionsgate Play',
      'atrangi': 'Atrangi',
      'nexgtv': 'NexGTv',
      'playflix': 'PlayFlix',
      'pocketfilms': 'Pocket Films',
      'timesplay': 'TimesPlay',
      'kanchhalannka': 'Kanccha Lannka',
      'kancchalannka': 'Kanccha Lannka',
      'youtubepremium': 'YouTube Premium',
      'etvwin': 'ETV Win',
      'tarangplus': 'Tarang Plus',
      'sunnxt': 'Sun NXT',
      'hoichoi': 'Hoichoi',
    };

    const key = normalizeOTTKey(service);
    return ottMap[key] || service;
  };

  // Check if an OTT service matches any of the selected filters
  const isOTTSelected = (service: string): boolean => {
    if (!selectedOTT || selectedOTT.length === 0) return false;
    const normalizedService = normalizeOTTKey(service);
    return selectedOTT.some(ott => {
      const normalizedOtt = normalizeOTTKey(ott);
      return normalizedService === normalizedOtt ||
             normalizedService.includes(normalizedOtt) ||
             normalizedOtt.includes(normalizedService);
    });
  };

  // Popular OTT services to prioritize (in order of priority)
  const popularOTTs = ['amazonprime', 'jiohotstar', 'hotstar', 'netflix', 'sonyliv', 'zee5'];

  // Check if an OTT service is in the popular list and return its priority index
  const getPopularPriority = (service: string): number => {
    const normalizedService = normalizeOTTKey(service);
    for (let i = 0; i < popularOTTs.length; i++) {
      if (normalizedService === popularOTTs[i] ||
          normalizedService.includes(popularOTTs[i]) ||
          popularOTTs[i].includes(normalizedService)) {
        return i;
      }
    }
    return popularOTTs.length; // Return length as lowest priority for non-popular
  };

  // Get sorted OTT services (selected first, then popular, then others) and calculate display limit
  const getDisplayOTTServices = () => {
    if (!plan.ottServices || plan.ottServices.length === 0) {
      return { displayServices: [], hiddenCount: 0 };
    }

    // Sort: selected OTTs first, then popular OTTs, then others
    const sortedServices = [...plan.ottServices].sort((a, b) => {
      const aSelected = isOTTSelected(a);
      const bSelected = isOTTSelected(b);

      // Selected OTTs always come first
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      // Among non-selected (or both selected), sort by popularity
      const aPriority = getPopularPriority(a);
      const bPriority = getPopularPriority(b);
      return aPriority - bPriority;
    });

    // Calculate display limit: max(5, number of selected OTTs)
    const displayLimit = Math.max(5, selectedOTT.length);
    const displayServices = sortedServices.slice(0, displayLimit);
    const hiddenCount = sortedServices.length - displayLimit;

    return { displayServices, hiddenCount: Math.max(0, hiddenCount) };
  };

  const { displayServices, hiddenCount } = getDisplayOTTServices();

  return (
    <Card
      ref={cardRef}
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.1)',
          borderColor: 'primary.main',
        },
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        bgcolor: 'background.paper'
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Price and Validity Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'baseline' }}>
              ₹{plan.price}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {formatValidity(plan.validity)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {plan.fiveG && (
              <Chip
                icon={<FiveGIcon sx={{ fontSize: 16 }} />}
                label="5G"
                size="small"
                sx={{
                  bgcolor: alpha('#6366f1', 0.1),
                  color: 'primary.main',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '6px'
                }}
              />
            )}
            <Box data-share-buttons sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip title="Share plan">
                <IconButton
                  size="small"
                  onClick={() => setShareModalOpen(true)}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: alpha('#6366f1', 0.1),
                    },
                  }}
                >
                  <ShareIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Report incorrect data">
                <IconButton
                  size="small"
                  onClick={() => setReportModalOpen(true)}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'error.main',
                      bgcolor: alpha('#ef4444', 0.1),
                    },
                  }}
                >
                  <ReportIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Main Benefits Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1, borderRadius: '12px', bgcolor: alpha('#6366f1', 0.05), color: 'primary.main' }}>
              <DataIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{formatData(plan.data)}</Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1, borderRadius: '12px', bgcolor: alpha('#6366f1', 0.05), color: 'primary.main' }}>
              <PhoneIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Voice</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{formatVoice(plan.voice)}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1, borderRadius: '12px', bgcolor: alpha('#6366f1', 0.05), color: 'primary.main' }}>
              <SmsIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>SMS</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{formatSMS(plan.sms)}</Typography>
            </Box>
          </Box>
        </Box>

        {/* OTT Benefits */}
        {plan.ottServices && plan.ottServices.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subscriptions</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {displayServices.map((service, index) => {
                const isHighlighted = isOTTSelected(service);
                return (
                  <Chip
                    key={index}
                    label={getOTTDisplayName(service)}
                    size="small"
                    sx={{
                      bgcolor: isHighlighted ? 'primary.main' : alpha('#6366f1', 0.05),
                      color: isHighlighted ? 'white' : 'primary.main',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      height: '24px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: isHighlighted ? 'primary.main' : alpha('#6366f1', 0.1)
                    }}
                  />
                );
              })}
              {hiddenCount > 0 && (
                <Chip
                  label={`+${hiddenCount} more`}
                  size="small"
                  sx={{
                    bgcolor: alpha('#64748b', 0.1),
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    height: '24px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: alpha('#64748b', 0.1)
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ mb: 2, opacity: 0.6 }} />
          
          {/* Cost Breakdown */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>Per Day</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{plan.pricePerDay.toFixed(2)}</Typography>
            </Box>
            {plan.pricePerGB && (
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>Per GB</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{plan.pricePerGB.toFixed(2)}</Typography>
              </Box>
            )}
          </Box>

          {/* Warnings/Notes */}
          <Stack spacing={1}>
            {plan.operator === 'bsnl' && plan.freebiesValidity !== plan.validity && (
              <Box sx={{ display: 'flex', gap: 1, p: 1.5, bgcolor: alpha('#f59e0b', 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha('#f59e0b', 0.1) }}>
                <InfoIcon sx={{ fontSize: 16, color: '#f59e0b', mt: 0.2 }} />
                <Typography variant="caption" color="#92400e" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                  Benefits valid for {plan.freebiesValidity} days. SIM validity {plan.validity} days.
                </Typography>
              </Box>
            )}
            {plan.noServiceValidity && (
              <Box sx={{ display: 'flex', gap: 1, p: 1.5, bgcolor: alpha('#ef4444', 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha('#ef4444', 0.1) }}>
                <InfoIcon sx={{ fontSize: 16, color: '#ef4444', mt: 0.2 }} />
                <Typography variant="caption" color="#991b1b" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                  Does not extend SIM validity. Active base plan required.
                </Typography>
              </Box>
            )}
            {plan.isCalendarMonth && (
              <Box sx={{ display: 'flex', gap: 1, p: 1.5, bgcolor: alpha('#3b82f6', 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha('#3b82f6', 0.1) }}>
                <InfoIcon sx={{ fontSize: 16, color: '#3b82f6', mt: 0.2 }} />
                <Typography variant="caption" color="#1e40af" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                  Calendar Month validity. Recharge on the same date each month.
                </Typography>
              </Box>
            )}
            {(plan.isGP2Only || plan.isJK20) && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {plan.isGP2Only && <Chip label="GP2 Only" size="small" sx={{ fontSize: '0.65rem', fontWeight: 700, bgcolor: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' }} />}
                {plan.isJK20 && <Chip label="JK20" size="small" sx={{ fontSize: '0.65rem', fontWeight: 700, bgcolor: '#f5f3ff', color: '#6d28d9', border: '1px solid #ede9fe' }} />}
              </Box>
            )}
            {plan.isDataAddon && (
              <Box sx={{ display: 'flex', gap: 1, p: 1.5, bgcolor: alpha('#f59e0b', 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha('#f59e0b', 0.1) }}>
                <InfoIcon sx={{ fontSize: 16, color: '#f59e0b', mt: 0.2 }} />
                <Typography variant="caption" color="#92400e" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                  Data Add-on Pack. Requires an active base plan to work.
                </Typography>
              </Box>
            )}
            {plan.isAddOn && (
              <Box sx={{ display: 'flex', gap: 1, p: 1.5, bgcolor: alpha('#f59e0b', 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha('#f59e0b', 0.1) }}>
                <InfoIcon sx={{ fontSize: 16, color: '#f59e0b', mt: 0.2 }} />
                <Typography variant="caption" color="#92400e" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                  Add-on / membership. No calls or data. Requires an active base plan.
                </Typography>
              </Box>
            )}
            {plan.isDataPack && (
              <Box sx={{ display: 'flex', gap: 1, p: 1.5, bgcolor: alpha('#f59e0b', 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha('#f59e0b', 0.1) }}>
                <InfoIcon sx={{ fontSize: 16, color: '#f59e0b', mt: 0.2 }} />
                <Typography variant="caption" color="#92400e" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                  Data-Only Pack. Active base plan may be required.
                </Typography>
              </Box>
            )}
            {plan.data.isUnlimited && plan.data.perDay === null && plan.data.total === null && (
              <Box sx={{ display: 'flex', gap: 1, p: 1.5, bgcolor: alpha('#8b5cf6', 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha('#8b5cf6', 0.1) }}>
                <InfoIcon sx={{ fontSize: 16, color: '#8b5cf6', mt: 0.2 }} />
                <Typography variant="caption" color="#5b21b6" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                  Price/GB calculated assuming 10GB/day usage (typical FUP limit).
                </Typography>
              </Box>
            )}
            {plan.isCUGPolice && (
              <Box sx={{ display: 'flex', gap: 1, p: 1.5, bgcolor: alpha('#1e40af', 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha('#1e40af', 0.1) }}>
                <InfoIcon sx={{ fontSize: 16, color: '#1e40af', mt: 0.2 }} />
                <Typography variant="caption" color="#1e3a8a" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                  Police CUG Plan. Available only for Tamil Nadu Police personnel.
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </CardContent>

      {/* Report Issue Modal */}
      <ReportIssueModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        plan={plan}
        selectedCircle={selectedCircle}
      />

      {/* Share Plan Modal */}
      <SharePlanModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        plan={plan}
        cardRef={cardRef}
      />
    </Card>
  );
};

export default PlanCard;
