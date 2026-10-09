import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  Alert,
  IconButton,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  ReportProblemOutlined as ReportIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { NormalizedPlan } from '../../types';
import { ISSUE_TYPES, IssueType, buildPlanIssueUrl } from '../../constants/githubIssues';
import { getCirclesForOperator } from '../../constants/circles';

const OPERATOR_LABELS: Record<NormalizedPlan['operator'], string> = {
  airtel: 'Airtel',
  jio: 'Jio',
  bsnl: 'BSNL',
  vi: 'Vi',
};

interface ReportIssueModalProps {
  open: boolean;
  onClose: () => void;
  plan: NormalizedPlan;
  selectedCircle?: string | null;
}

const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  open,
  onClose,
  plan,
  selectedCircle,
}) => {
  const [issueType, setIssueType] = useState<IssueType | ''>('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatData = (data: NormalizedPlan['data']): string => {
    if (data.isUnlimited) {
      if (data.perDay) return `Unlimited (${data.perDay}GB/day)`;
      if (data.total) return `${data.total}GB total`;
      return 'Truly Unlimited';
    }
    if (data.perDay) return `${data.perDay}GB/day`;
    if (data.total) return `${data.total}GB total`;
    return 'No data';
  };

  const formatVoice = (voice: NormalizedPlan['voice']): string => {
    if (voice.isUnlimited) return 'Unlimited';
    if (voice.minutes) return `${voice.minutes} minutes`;
    return 'No voice';
  };

  const formatSMS = (sms: NormalizedPlan['sms']): string => {
    if (sms.perDay) return `${sms.perDay}/day`;
    if (sms.total) return `${sms.total} total`;
    return 'No SMS';
  };

  const formatCircle = (): string => {
    const code = selectedCircle || plan.circles?.[0];
    if (!code) return 'All India';
    const name = getCirclesForOperator(plan.operator)?.find(c => c.code === code)?.name;
    return name ? `${code} (${name})` : code;
  };

  const handleSubmit = () => {
    if (!issueType) {
      setError('Please select an issue type');
      return;
    }

    setError(null);
    const selectedIssue = ISSUE_TYPES.find(t => t.value === issueType);
    const operatorLabel = OPERATOR_LABELS[plan.operator];

    const planDetails = [
      `Operator: ${operatorLabel}`,
      `Circle: ${formatCircle()}`,
      `Price: Rs.${plan.price}`,
      `Validity: ${plan.validity} days`,
      `Data: ${formatData(plan.data)}`,
      `Voice: ${formatVoice(plan.voice)}`,
      `SMS: ${formatSMS(plan.sms)}`,
      `Subscriptions: ${plan.ottServices?.join(', ') || 'None'}`,
      `5G: ${plan.fiveG ? 'Yes' : 'No'}`,
      `Plan ID: ${plan.id}`,
      `Found on: https://muttayi.com/${plan.operator}`,
    ].join('\n');

    const url = buildPlanIssueUrl({
      title: `[Plan error] ${operatorLabel} Rs.${plan.price} - ${selectedIssue?.label || issueType}`,
      operator: operatorLabel,
      circle: formatCircle(),
      issueType: selectedIssue?.label || 'Other issue',
      planDetails,
      description: description.trim(),
    });

    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) {
      // Popup blocked — navigate the current tab instead
      window.location.href = url;
      return;
    }
    setSubmitted(true);
  };

  const handleClose = () => {
    // Reset state on close
    setIssueType('');
    setDescription('');
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReportIcon sx={{ color: 'error.main' }} />
          <Typography variant="h6" fontWeight={600}>
            Report Issue
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {submitted ? (
          <Alert severity="success" sx={{ mt: 1 }}>
            A pre-filled GitHub issue has opened in a new tab. Review it and click <strong>Create</strong> to submit — you'll need a free GitHub account. Thank you for helping keep Muttayi accurate!
          </Alert>
        ) : (
          <>
            {/* Plan Summary */}
            <Box
              sx={{
                p: 2,
                mb: 3,
                bgcolor: alpha('#6366f1', 0.05),
                borderRadius: 2,
                border: '1px solid',
                borderColor: alpha('#6366f1', 0.1),
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Reporting issue for:
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {plan.operator.toUpperCase()} - ₹{plan.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {plan.validity} days | {formatData(plan.data)} | {formatVoice(plan.voice)}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Issue Type Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Issue Type *</InputLabel>
              <Select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as IssueType)}
                label="Issue Type *"
              >
                {ISSUE_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Description */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Additional Details (optional)"
              placeholder="Provide any additional information about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 1 }}
            />

            <Typography variant="caption" color="text.secondary">
              Reports are filed as public issues on GitHub. Plan details are filled in automatically; you'll need a free GitHub account to submit.
            </Typography>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {submitted ? (
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        ) : (
          <>
            <Button onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!issueType}
              endIcon={<OpenInNewIcon />}
              sx={{
                '&.Mui-disabled': {
                  bgcolor: 'grey.400',
                },
              }}
            >
              Report on GitHub
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReportIssueModal;
