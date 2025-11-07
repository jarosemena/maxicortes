import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { MaterialType } from '../../../domain/entities/Material';
import { MaterialFilters as MaterialFiltersType } from '../../../application/stores/useMaterialsStore';

export interface MaterialFiltersProps {
  filters: MaterialFiltersType;
  onFiltersChange: (filters: Partial<MaterialFiltersType>) => void;
  onReset: () => void;
}

export const MaterialFilters: React.FC<MaterialFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: event.target.value });
  };

  const handleTypeChange = (event: any) => {
    const value = event.target.value;
    onFiltersChange({ type: value === '' ? null : value });
  };

  const handleAvailableOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ availableOnly: event.target.checked });
  };

  const hasActiveFilters =
    filters.search !== '' || filters.type !== null || filters.availableOnly;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <TextField
          placeholder="Search materials..."
          value={filters.search}
          onChange={handleSearchChange}
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
          sx={{ flexGrow: 1, minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Material Type</InputLabel>
          <Select
            value={filters.type || ''}
            onChange={handleTypeChange}
            label="Material Type"
          >
            <MenuItem value="">All Types</MenuItem>
            {Object.values(MaterialType).map(type => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={filters.availableOnly}
              onChange={handleAvailableOnlyChange}
            />
          }
          label="Available only"
        />

        {hasActiveFilters && (
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={onReset}
            size="small"
          >
            Clear Filters
          </Button>
        )}
      </Box>
    </Paper>
  );
};