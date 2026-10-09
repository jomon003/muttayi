import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import theme from './theme';
import { OperatorProvider } from './context/OperatorContext';
import OperatorPage from './pages/OperatorPage';
import PlansPage from './pages/PlansPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import { Operator } from './types';

function App() {
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <OperatorProvider value={{ selectedOperator, setSelectedOperator }}>
        <BrowserRouter>
          <Box sx={{ 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.default'
          }}>
            {/* Header */}
            <AppBar 
              position="sticky" 
              elevation={0}
            >
              <Toolbar sx={{ height: 70 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <img src="/logo/logo.png" alt="Muttayi Logo" style={{ height: 32, cursor: 'pointer' }} />
                </Link>
                <Box sx={{ flexGrow: 1 }} />
                <Typography 
                  variant="body2"
                  color="text.secondary"
                  sx={{ 
                    display: { xs: 'none', sm: 'block' },
                    fontWeight: 500
                  }}
                >
                  Find your perfect telecom plan
                </Typography>
              </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Routes>
              <Route path="/" element={<OperatorPage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/:operator" element={<PlansPage />} />
            </Routes>

            {/* Footer */}
            <Box
              component="footer"
              sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                bgcolor: 'background.paper',
                borderTop: 1,
                borderColor: 'divider',
                boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.02)'
              }}
            >
              <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
                  © {new Date().getFullYear()} Muttayi Plan Finder. Compare plans across Airtel, Jio, BSNL & Vi.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 1.5 }}>
                  <Link to="/privacy" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.875rem' }}>
                    Privacy Policy
                  </Link>
                  <Link to="/terms" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.875rem' }}>
                    Terms & Conditions
                  </Link>
                </Box>
                <Typography variant="caption" color="text.disabled" align="center" display="block">
                  All trademarks, logos, and brand names are the property of their respective owners.
                </Typography>
              </Container>
            </Box>
          </Box>
        </BrowserRouter>
      </OperatorProvider>
    </ThemeProvider>
  );
}

export default App;
