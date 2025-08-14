import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Chip,
  Autocomplete,
  Paper,
  Typography,
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
} from '@mui/icons-material';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onFilterChange?: (filters: string[]) => void;
  filters?: FilterOption[];
  suggestions?: string[];
  value?: string;
  fullWidth?: boolean;
  showFilters?: boolean;
}

const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  onFilterChange,
  filters = [],
  suggestions = [],
  value = '',
  fullWidth = false,
  showFilters = true,
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState(value);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchValue(newValue);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      if (onSearch) {
        onSearch(newValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleFilterToggle = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    
    setActiveFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSuggestionSelect = (event: React.SyntheticEvent, value: string | null) => {
    if (value) {
      setSearchValue(value);
      if (onSearch) {
        onSearch(value);
      }
    }
  };

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: showFilters && filters.length > 0 ? 2 : 0 }}>
        <Autocomplete
          freeSolo
          options={suggestions}
          value={searchValue}
          onInputChange={(event, newValue) => {
            setSearchValue(newValue || '');
          }}
          onChange={handleSuggestionSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              variant="outlined"
              size="small"
              fullWidth={fullWidth}
              value={searchValue}
              onChange={handleSearchChange}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {searchValue && (
                      <IconButton
                        size="small"
                        onClick={handleClear}
                        edge="end"
                      >
                        <Clear />
                      </IconButton>
                    )}
                    {showFilters && filters.length > 0 && (
                      <IconButton
                        size="small"
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        edge="end"
                      >
                        <FilterList />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    backgroundColor: 'background.paper',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'background.paper',
                  },
                },
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Search sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
              {option}
            </Box>
          )}
          PaperComponent={({ children, ...props }) => (
            <Paper {...props} sx={{ mt: 1 }}>
              {suggestions.length > 0 ? (
                children
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No suggestions available
                  </Typography>
                </Box>
              )}
            </Paper>
          )}
        />
      </Box>

      {showFilters && filters.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {filters.map((filter) => (
            <Chip
              key={filter.value}
              label={filter.label}
              variant={activeFilters.includes(filter.value) ? 'filled' : 'outlined'}
              color={activeFilters.includes(filter.value) ? 'primary' : 'default'}
              size="small"
              clickable
              onClick={() => handleFilterToggle(filter.value)}
              sx={{
                '&:hover': {
                  backgroundColor: activeFilters.includes(filter.value) 
                    ? 'primary.dark' 
                    : 'action.hover',
                },
              }}
            />
          ))}
          {activeFilters.length > 0 && (
            <Chip
              label="Clear all"
              variant="outlined"
              size="small"
              clickable
              onClick={() => {
                setActiveFilters([]);
                if (onFilterChange) {
                  onFilterChange([]);
                }
              }}
              sx={{ ml: 1 }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;