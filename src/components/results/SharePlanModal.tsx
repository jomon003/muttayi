import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Share as ShareIcon,
  Image as ImageIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import { NormalizedPlan } from '../../types';

interface SharePlanModalProps {
  open: boolean;
  onClose: () => void;
  plan: NormalizedPlan;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

const SharePlanModal: React.FC<SharePlanModalProps> = ({
  open,
  onClose,
  plan,
  cardRef,
}) => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

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

  const generatePlainText = (): string => {
    const operatorName = plan.operator.charAt(0).toUpperCase() + plan.operator.slice(1);
    const lines = [
      `${operatorName} Rs.${plan.price} Plan`,
      '------------------------',
      `Data: ${formatData(plan.data)}`,
      `Calls: ${formatVoice(plan.voice)}`,
      `SMS: ${formatSMS(plan.sms)}`,
      `Validity: ${plan.validity} days`,
    ];

    if (plan.fiveG) {
      lines.push('5G: Yes');
    }

    if (plan.ottServices && plan.ottServices.length > 0) {
      lines.push(`Subscriptions: ${plan.ottServices.join(', ')}`);
    }

    lines.push('');
    lines.push(`Compare plans at muttayi.com/${plan.operator}`);

    return lines.join('\n');
  };

  const handleCopyText = async () => {
    try {
      const text = generatePlainText();
      await navigator.clipboard.writeText(text);
      setSnackbar({ open: true, message: 'Plan details copied to clipboard', severity: 'success' });
      onClose();
    } catch {
      setSnackbar({ open: true, message: 'Failed to copy text', severity: 'error' });
    }
  };

  const handleShareImage = async () => {
    if (!cardRef.current) {
      setSnackbar({ open: true, message: 'Could not capture plan card', severity: 'error' });
      return;
    }

    setLoading(true);

    try {
      // Hide share and report buttons before capture
      const buttonsContainer = cardRef.current.querySelector('[data-share-buttons]') as HTMLElement;
      if (buttonsContainer) {
        buttonsContainer.style.display = 'none';
      }

      // Remove card border and border-radius for cleaner export
      const cardElement = cardRef.current;
      const originalBorder = cardElement.style.border;
      const originalBorderRadius = cardElement.style.borderRadius;
      cardElement.style.border = 'none';
      cardElement.style.borderRadius = '0';

      // Capture the card
      const cardCanvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // Restore buttons after capture
      if (buttonsContainer) {
        buttonsContainer.style.display = '';
      }

      // Restore card border and border-radius
      cardElement.style.border = originalBorder;
      cardElement.style.borderRadius = originalBorderRadius;

      // Create a new canvas with extra space for branding
      const brandingHeight = 80;
      const padding = 20;
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = cardCanvas.width + (padding * 2);
      finalCanvas.height = cardCanvas.height + brandingHeight + (padding * 2);

      const ctx = finalCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Fill background with white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

      // Draw the card
      ctx.drawImage(cardCanvas, padding, padding);

      // Draw operator name on the card (top right, same line as price)
      const operatorName = plan.operator.charAt(0).toUpperCase() + plan.operator.slice(1);
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'right';
      // Position at top right of the card area, with some padding from the edge
      ctx.fillText(operatorName, finalCanvas.width - padding - 24, padding + 52);

      // Draw branding area - logo above, text below (centered)
      const brandingStartY = cardCanvas.height + padding + 10;

      // Load and draw logo
      const logo = new Image();
      logo.crossOrigin = 'anonymous';

      await new Promise<void>((resolve) => {
        logo.onload = () => {
          const logoHeight = 32;
          const logoWidth = (logo.width / logo.height) * logoHeight;
          const text = 'Compare plans at muttayi.com';

          // Draw logo centered
          const logoX = (finalCanvas.width - logoWidth) / 2;
          ctx.drawImage(logo, logoX, brandingStartY, logoWidth, logoHeight);

          // Draw text below logo, centered
          ctx.fillStyle = '#64748b';
          ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(text, finalCanvas.width / 2, brandingStartY + logoHeight + 28);

          resolve();
        };
        logo.onerror = () => {
          // If logo fails, just draw text centered
          const text = 'Compare plans at muttayi.com';
          ctx.fillStyle = '#6366f1';
          ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(text, finalCanvas.width / 2, brandingStartY + 30);
          resolve();
        };
        logo.src = '/logo/logo.png';
      });

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        finalCanvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create blob'));
        }, 'image/png');
      });

      // Helper function to download the image
      const downloadImage = () => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${plan.operator}-plan-${plan.price}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setSnackbar({ open: true, message: 'Image downloaded', severity: 'success' });
        onClose();
      };

      // Generate share text for caption
      const shareText = generatePlainText();

      // Check if Web Share API is available and supports files
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `${plan.operator}-plan-${plan.price}.png`, { type: 'image/png' });
        const shareData = {
          files: [file],
          text: shareText,
        };

        if (navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
            setSnackbar({ open: true, message: 'Plan shared successfully', severity: 'success' });
            onClose();
            return;
          } catch (shareErr) {
            // If share was aborted or failed, fall back to download
            if ((shareErr as Error).name === 'AbortError') {
              // User cancelled the share dialog - just close
              onClose();
              return;
            }
            // Other error - fall back to download
            downloadImage();
            return;
          }
        }
      }

      // Fallback: download the image
      downloadImage();
    } catch {
      setSnackbar({ open: true, message: 'Failed to create image', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
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
            <ShareIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={600}>
              Share Plan
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" disabled={loading}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose how you want to share this plan:
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Share as Image */}
            <Button
              variant="outlined"
              onClick={handleShareImage}
              disabled={loading}
              sx={{
                flex: 1,
                flexDirection: 'column',
                py: 3,
                borderRadius: 2,
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha('#6366f1', 0.04),
                },
              }}
            >
              {loading ? (
                <CircularProgress size={28} sx={{ mb: 1 }} />
              ) : (
                <ImageIcon sx={{ fontSize: 28, mb: 1, color: 'primary.main' }} />
              )}
              <Typography variant="body2" fontWeight={600} color="text.primary">
                Share as Image
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Save or share picture
              </Typography>
            </Button>

            {/* Copy as Text */}
            <Button
              variant="outlined"
              onClick={handleCopyText}
              disabled={loading}
              sx={{
                flex: 1,
                flexDirection: 'column',
                py: 3,
                borderRadius: 2,
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha('#6366f1', 0.04),
                },
              }}
            >
              <CopyIcon sx={{ fontSize: 28, mb: 1, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={600} color="text.primary">
                Copy as Text
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Copy plan details
              </Typography>
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SharePlanModal;
