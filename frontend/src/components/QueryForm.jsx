import React, { useState, useRef, useEffect } from 'react';
import { Box, InputBase, Paper, IconButton, Chip, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const exampleQueries = [
  'High-value customers with frequent visits',
  'Champions segment who use vouchers regularly',
  'Customers with multiple dependents',
  'Single-brand loyal high spenders',
  'Cross-brand diners who respond to campaigns'
];

export default function QueryForm({ onSearch, disabled }) {
  const [query, setQuery] = useState('High-value Spur member who visits frequently and redeems vouchers');
  const inputRef = useRef();

  useEffect(() => {
    if (!disabled && inputRef.current) inputRef.current.focus();
  }, [disabled]);

  const submit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
  onSearch(query, 100); // Default Top K now 100
  };

  const handleExampleClick = (exampleQuery) => {
    setQuery(exampleQuery);
    if (inputRef.current) inputRef.current.focus();
  };

  const clearQuery = () => {
    setQuery('');
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <Box sx={{ mb: 6 }}>
      {/* Search Bar */}
      <Box component="form" onSubmit={submit} sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Paper
          sx={{
            p: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            width: { xs: '100%', sm: 600, md: 700 },
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderRadius: 4,
            border: '2px solid transparent',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            '&:focus-within': {
              borderColor: 'primary.main',
              boxShadow: '0 20px 35px -5px rgba(25, 118, 210, 0.25), 0 10px 10px -5px rgba(25, 118, 210, 0.1)',
            }
          }}
          elevation={0}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 2, fontSize: 24 }} />
          <InputBase
            inputRef={inputRef}
            sx={{
              ml: 1,
              flex: 1,
              fontSize: 18,
              '& input::placeholder': {
                color: 'text.secondary',
                opacity: 0.7,
              }
            }}
            placeholder="Describe the customers you're looking for..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={disabled}
            inputProps={{ 'aria-label': 'semantic customer search' }}
            onKeyDown={e => {
              if (e.key === 'Escape') clearQuery();
            }}
          />
          {query && (
            <IconButton
              onClick={clearQuery}
              sx={{ p: '8px', mr: 1 }}
              disabled={disabled}
              aria-label="clear search"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            type="submit"
            sx={{
              p: '10px',
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '&:disabled': {
                backgroundColor: 'action.disabled',
                color: 'action.disabled',
              }
            }}
            disabled={disabled || !query.trim()}
            aria-label="search"
          >
            <SearchIcon fontSize="medium" />
          </IconButton>
        </Paper>
      </Box>

      {/* Example Queries */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ maxWidth: 700 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: 'center',
              '& > *': { mb: 1 }
            }}
          >
            {exampleQueries.map((example, index) => (
              <Chip
                key={index}
                label={example}
                variant="outlined"
                size="small"
                onClick={() => handleExampleClick(example)}
                disabled={disabled}
                sx={{
                  cursor: disabled ? 'default' : 'pointer',
                  '&:hover': disabled ? {} : {
                    backgroundColor: 'primary.50',
                    borderColor: 'primary.main',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
