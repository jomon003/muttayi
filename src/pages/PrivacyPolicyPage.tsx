import React from 'react';
import { Box, Container, Typography, Paper, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ '& h2': { mt: 4, mb: 2 }, '& p': { mb: 2, lineHeight: 1.8 } }}>
          <Typography variant="h6" component="h2" fontWeight={600}>
            Introduction
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to Muttayi.com ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our mobile plan comparison website.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Muttayi.com is a free tool that helps users compare prepaid mobile plans across Airtel, Jio, BSNL, and Vi in India. We believe in transparency and minimal data collection.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            Information We Do NOT Collect
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We want to be clear about what we do NOT collect:
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li>No personal information (name, email, phone number, address)</li>
            <li>No user accounts or login credentials</li>
            <li>No payment or financial information</li>
            <li>No precise location data from your device</li>
            <li>No browsing history or cross-site tracking</li>
            <li>No advertising or marketing cookies</li>
          </Box>

          <Typography variant="h6" component="h2" fontWeight={600}>
            Information Stored Temporarily (Session Data)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            When you use our website, your filter preferences (such as selected operator, data requirements, and circle/state selection) are stored temporarily in your browser's memory. This data:
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li>Is never sent to our servers</li>
            <li>Is not stored in cookies or local storage</li>
            <li>Is automatically cleared when you close or refresh the page</li>
            <li>Cannot be accessed by us or any third party</li>
          </Box>

          <Typography variant="h6" component="h2" fontWeight={600}>
            Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We use Google Analytics to understand how our website is used. This helps us improve the user experience and content. Google Analytics collects:
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li>Pages visited and time spent on site</li>
            <li>Approximate geographic location (country/city level)</li>
            <li>Device type, browser, and operating system</li>
            <li>Referral sources (how you found our website)</li>
            <li>Anonymous usage patterns and interactions</li>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Google Analytics uses cookies to collect this information. The data collected is aggregated and anonymized. We do not use this data to identify individual users. You can opt out of Google Analytics by installing the{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>
              Google Analytics Opt-out Browser Add-on
            </a>.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            For more information, see{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>
              Google's Privacy Policy
            </a>{' '}and{' '}
            <a href="https://support.google.com/analytics/answer/6004245" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>
              How Google uses data when you use our partners' sites
            </a>.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            Report Issue Feature
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Our website includes a "Report Issue" feature that allows you to report inaccurate plan information or request features. Reports are filed as issues on our public GitHub repository:
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li>Clicking "Report on GitHub" opens a pre-filled GitHub issue in a new tab; nothing is sent until you submit it on GitHub</li>
            <li>The pre-filled issue contains only plan-related information (operator, circle, price, validity, benefits) and the details you type</li>
            <li>Submitting requires a GitHub account; your GitHub username and everything in the issue are <strong>publicly visible</strong></li>
            <li>Do not include personal information such as your phone number in a report</li>
            <li>Submission is entirely optional and user-initiated</li>
          </Box>
          <Typography variant="body1" color="text.secondary">
            GitHub is subject to the{' '}
            <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>
              GitHub Privacy Statement
            </a>.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            Third-Party Services
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Our website uses the following third-party services:
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li><strong>Cloudflare:</strong> For website hosting and security</li>
            <li><strong>Google Analytics:</strong> For website analytics and usage insights</li>
            <li><strong>GitHub:</strong> For the optional issue reporting and feature request feature</li>
          </Box>
          <Typography variant="body1" color="text.secondary">
            We do not use any advertising networks, social media trackers, or marketing tools.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            Data Security
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Since we don't collect personal data, there is minimal risk of data breach affecting your personal information. Our website is served over HTTPS, ensuring all communication between your browser and our servers is encrypted.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            Children's Privacy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Our website is suitable for users of all ages. We do not knowingly collect any personal information from anyone, including children under 13.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            Changes to This Policy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary">
            If you have any questions about this Privacy Policy, please start a discussion on our{' '}
            <a href="https://github.com/jomon003/muttayi/discussions" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>
              GitHub Discussions
            </a>{' '}page.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="body2" color="text.secondary" align="center">
            <Link to="/" style={{ color: '#6366f1', textDecoration: 'none' }}>
              ← Back to Home
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicyPage;
