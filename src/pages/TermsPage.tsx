import React from 'react';
import { Box, Container, Typography, Paper, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Terms and Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ '& h2': { mt: 4, mb: 2 }, '& p': { mb: 2, lineHeight: 1.8 } }}>
          <Typography variant="h6" component="h2" fontWeight={600}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" color="text.secondary">
            By accessing and using Muttayi.com ("the Website"), you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our Website.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            2. Description of Service
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Muttayi.com is a free comparison tool that helps users compare prepaid mobile recharge plans from various telecom operators in India, including Airtel, Jio, BSNL, and Vi (Vodafone Idea). The Website provides plan information, filtering options, and comparison features to help users find suitable mobile plans.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            3. Disclaimer of Accuracy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Important:</strong> While we strive to provide accurate and up-to-date plan information, Muttayi.com is an independent comparison service and is NOT affiliated with any telecom operator.
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li>Plan details (prices, validity, data, benefits) may change without notice by telecom operators</li>
            <li>We cannot guarantee the accuracy, completeness, or timeliness of plan information</li>
            <li>Plans may vary by circle/region and may not be available in all areas</li>
            <li>Special terms, conditions, or restrictions may apply to plans that are not displayed on our Website</li>
            <li>Always verify plan details on the official telecom operator's website or app before recharging</li>
          </Box>

          <Typography variant="h6" component="h2" fontWeight={600}>
            4. No Affiliation
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Muttayi.com is an independent service and is not affiliated with, endorsed by, or connected to Airtel, Reliance Jio, BSNL, Vi (Vodafone Idea), or any other telecom operator. All trademarks, logos, and brand names are the property of their respective owners.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            5. User Responsibilities
          </Typography>
          <Typography variant="body1" color="text.secondary">
            By using our Website, you agree to:
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li>Use the Website only for lawful purposes</li>
            <li>Verify plan information with official sources before making any purchase decisions</li>
            <li>Not attempt to disrupt, damage, or gain unauthorized access to our Website</li>
            <li>Not use automated tools to scrape or collect data from our Website without permission</li>
            <li>Provide accurate information when using the Report Issue feature</li>
          </Box>

          <Typography variant="h6" component="h2" fontWeight={600}>
            6. Intellectual Property
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The content on Muttayi.com, including but not limited to text, graphics, logos, and software, is the property of Muttayi.com or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Telecom operator logos and trademarks displayed on our Website are the property of their respective owners and are used for identification purposes only.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            7. Limitation of Liability
          </Typography>
          <Typography variant="body1" color="text.secondary">
            To the fullest extent permitted by law:
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li>Muttayi.com is provided "as is" without any warranties, express or implied</li>
            <li>We are not liable for any damages arising from your use of or inability to use the Website</li>
            <li>We are not responsible for any loss resulting from reliance on plan information displayed on our Website</li>
            <li>We are not liable for any issues with recharges made based on information from our Website</li>
            <li>We do not process any payments or recharges; all transactions are conducted directly with telecom operators</li>
          </Box>

          <Typography variant="h6" component="h2" fontWeight={600}>
            8. Third-Party Links
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Our Website may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party sites. Accessing third-party links is at your own risk.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            9. Analytics and Cookies
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We use Google Analytics to collect anonymized usage data to improve our Website. By using our Website, you consent to the use of cookies by Google Analytics. This data helps us understand:
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li>How users navigate and interact with our Website</li>
            <li>Which features and pages are most useful</li>
            <li>Technical information to optimize performance</li>
          </Box>
          <Typography variant="body1" color="text.secondary">
            You can opt out of Google Analytics tracking by installing the{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>
              Google Analytics Opt-out Browser Add-on
            </a>. For more details, please see our{' '}
            <Link to="/privacy" style={{ color: '#6366f1' }}>
              Privacy Policy
            </Link>.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            10. Report Issue Feature
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We provide a feature to report inaccurate plan information and request features. Reports are submitted as public issues on our{' '}
            <a href="https://github.com/jomon003/muttayi/issues" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>
              GitHub repository
            </a>{' '}and are subject to GitHub's terms of service. By submitting a report:
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li>You understand that your report and GitHub username are publicly visible</li>
            <li>You agree that the information you provide is accurate to the best of your knowledge</li>
            <li>You grant us permission to use the reported information to improve our service</li>
            <li>We are not obligated to act on every report but will review submissions in good faith</li>
          </Box>

          <Typography variant="h6" component="h2" fontWeight={600}>
            11. Modifications to Service
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We reserve the right to modify, suspend, or discontinue any part of the Website at any time without notice. We are not liable for any modification, suspension, or discontinuation of the service.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            12. Changes to Terms
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We may update these Terms and Conditions from time to time. Any changes will be posted on this page with an updated "Last updated" date. Continued use of the Website after changes constitutes acceptance of the new terms.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            13. Governing Law
          </Typography>
          <Typography variant="body1" color="text.secondary">
            These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            14. Severability
          </Typography>
          <Typography variant="body1" color="text.secondary">
            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
          </Typography>

          <Typography variant="h6" component="h2" fontWeight={600}>
            15. Contact
          </Typography>
          <Typography variant="body1" color="text.secondary">
            If you have any questions about these Terms and Conditions, please start a discussion on our{' '}
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

export default TermsPage;
