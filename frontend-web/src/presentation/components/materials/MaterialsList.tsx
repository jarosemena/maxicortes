import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Pagination,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Toolbar,
  Tooltip,
} from '@mui/material';
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
} from '@mui/icons-material';
import { Material } from '../../../domain/entities/Material';
import { MaterialCard } from './MaterialCard';
import { Loading } from '../ui/Loading';

export interface MaterialsListProps {
  materials: Material[];
  loading?: boolean;
  onEdit?: (material: Material) => void;
  onDelete?: (id: string) => void;
  onView?: (material: Material) => void;
  pageSize?: number;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
}

type ViewMode = 'grid' | 'list';

export const MaterialsList: React.FC<MaterialsListProps> = ({
  materials,
  loading = false,
  onEdit,
  onDelete,
  onView,
  pageSize = 12,
  selectable = false,
  onSelectionChange,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const totalPages = Math.ceil(materials.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMaterials = materials.slice(startIndex, endIndex);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = materials.map(m => m.id);
      setSelectedIds(allIds);
      onSelectionChange?.(allIds);
    } else {
      setSelectedIds([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id];
    
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  if (loading) {
    return <Loading centered message="Loading materials..." />;
  }

  if (materials.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No materials found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your filters or add a new material
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Toolbar
        sx={{
          pl: { sm: 0 },
          pr: { xs: 1, sm: 1 },
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">
            {materials.length} material{materials.length !== 1 ? 's' : ''}
          </Typography>
          {selectable && selectedIds.length > 0 && (
            <Typography variant="body2" color="primary">
              {selectedIds.length} selected
            </Typography>
          )}
        </Box>

        <Box>
          <Tooltip title="Grid view">
            <IconButton
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
              aria-label="grid view"
            >
              <GridViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="List view">
            <IconButton
              onClick={() => setViewMode('list')}
              color={viewMode === 'list' ? 'primary' : 'default'}
              aria-label="list view"
            >
              <ListViewIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {paginatedMaterials.map(material => (
            <Grid item xs={12} sm={6} md={4} key={material.id}>
              {selectable && (
                <Checkbox
                  checked={selectedIds.includes(material.id)}
                  onChange={() => handleSelectOne(material.id)}
                  sx={{ position: 'absolute', zIndex: 1 }}
                />
              )}
              <MaterialCard
                material={material}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedIds.length > 0 &&
                        selectedIds.length < materials.length
                      }
                      checked={
                        materials.length > 0 &&
                        selectedIds.length === materials.length
                      }
                      onChange={handleSelectAll}
                      inputProps={{ 'aria-label': 'select all materials' }}
                    />
                  </TableCell>
                )}
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Dimensions (mm)</TableCell>
                <TableCell>Price ($/m²)</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMaterials.map(material => (
                <TableRow
                  key={material.id}
                  hover
                  onClick={() => onView?.(material)}
                  sx={{ cursor: onView ? 'pointer' : 'default' }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(material.id)}
                        onChange={() => handleSelectOne(material.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.type}</TableCell>
                  <TableCell>
                    {material.width} × {material.height} × {material.thickness}
                  </TableCell>
                  <TableCell>${material.pricePerSquareMeter.toFixed(2)}</TableCell>
                  <TableCell>{material.availableQuantity}</TableCell>
                  <TableCell>
                    {material.isAvailable() ? 'Available' : 'Out of stock'}
                  </TableCell>
                  <TableCell align="right">
                    {onEdit && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(material);
                        }}
                        aria-label="edit"
                      >
                        <GridViewIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};