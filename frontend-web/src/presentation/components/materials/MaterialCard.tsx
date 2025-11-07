import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { Material } from '../../../domain/entities/Material';

export interface MaterialCardProps {
  material: Material;
  onEdit?: (material: Material) => void;
  onDelete?: (id: string) => void;
  onView?: (material: Material) => void;
  showDescription?: boolean;
  actionsDisabled?: boolean;
}

const getMaterialTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    WOOD: '#8B4513',
    METAL: '#708090',
    PLASTIC: '#4169E1',
    GLASS: '#87CEEB',
    COMPOSITE: '#9370DB',
  };
  return colors[type] || '#757575';
};

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onEdit,
  onDelete,
  onView,
  showDescription = false,
  actionsDisabled = false,
}) => {
  const handleCardClick = () => {
    if (onView) {
      onView(material);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(material);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(material.id);
    }
  };

  const area = material.calculateArea();
  const isAvailable = material.isAvailable();

  return (
    <Card
      data-testid="material-card"
      onClick={handleCardClick}
      sx={{
        cursor: onView ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onView
          ? {
              transform: 'translateY(-4px)',
              boxShadow: 4,
            }
          : {},
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon color="action" />
            <Typography variant="h6" component="div">
              {material.name}
            </Typography>
          </Box>
          <Chip
            label={material.type}
            size="small"
            sx={{
              bgcolor: getMaterialTypeColor(material.type),
              color: 'white',
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Dimensions: {material.width} x {material.height} x {material.thickness} mm
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Area: {area.toFixed(2)} m²
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: ${material.pricePerSquareMeter.toFixed(2)}/m²
          </Typography>
        </Box>

        {showDescription && material.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {material.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {isAvailable ? (
            <Chip
              label={`${material.availableQuantity} in stock`}
              color="success"
              size="small"
            />
          ) : (
            <Chip label="Out of stock" color="error" size="small" />
          )}
          
          {!material.isActive && (
            <Chip label="Inactive" color="warning" size="small" />
          )}
        </Box>
      </CardContent>

      {!actionsDisabled && (onEdit || onDelete) && (
        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
          {onEdit && (
            <Tooltip title="Edit material">
              <IconButton
                size="small"
                color="primary"
                onClick={handleEdit}
                aria-label="edit"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete material">
              <IconButton
                size="small"
                color="error"
                onClick={handleDelete}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      )}
    </Card>
  );
};