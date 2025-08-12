import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Paper, Chip, Divider, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/ManageSearch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import QueryForm from './components/QueryForm';
import ResultsTable from './components/ResultsTable';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '3rem',
          paddingBottom: '3rem',
        },
      },
    },
  },
});

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [serverReady, setServerReady] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    console.log('App mounted, checking backend health...');
    fetch('/health')
      .then(r => {
        console.log('Health check response status:', r.status);
        return r.json();
      })
      .then(d => {
        console.log('Health check data:', d);
        setServerReady(d.ready);
      })
      .catch(e => {
        console.error('Health check failed:', e);
      });
  }, []);

  const handleSearch = async (searchQuery, topK) => {
    setQuery(searchQuery);
    setError(null);
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch('/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: searchQuery, topK }) });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      console.log('API Response:', data);
      console.log('First result:', data.results?.[0]);
      setResults(data.results || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
  <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb:2 }}>
              <SearchIcon color="primary" sx={{ fontSize: 48 }} />
              <Typography variant="h3" component="h1" sx={{ color: 'text.primary' }}>
                Semantic Customer Search
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Find customers using natural language queries powered by AI embeddings
            </Typography>
          </Box>

          {/* Server Status */}
          {!serverReady && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  Preparing embeddings...
                </Box>
              </Alert>
            </Box>
          )}

          {/* Search Form */}
          <QueryForm onSearch={handleSearch} disabled={!serverReady || loading} />

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 6 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Searching for customers similar to "{query}"...
              </Typography>
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <Alert severity="error" sx={{ borderRadius: 2, maxWidth: 500 }}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Results */}
          {results.length > 0 && !loading && (
            <Box sx={{ mb: 4, px: { xs: 0, md: 1 } }}>
              <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
                <ResultsTable rows={results} />
              </Box>
            </Box>
          )}

          {/* Empty State */}
          {results.length === 0 && !loading && !error && query && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No customers found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search query or using different keywords
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
