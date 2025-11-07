import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { materialSchema } from '../../validation/materialSchema';
import { MaterialFormData } from '../../validation/materialSchema';
import { Material, MaterialType } from '../../../domain/entities/Material';

export interface MaterialFormProps {
  initialData?: Material;
  onSubmit: (data: MaterialFormData) => void;
  onCancel?: () => void;
}

export const MaterialForm: React.FC<MaterialFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MaterialFormData>({
    // resolver: yupResolver(materialSchema), // TODO: Install @hookform/resolvers
    defaultValues: initialData
      ? {
          name: initialData.name,
          type: initialData.type,
          width: initialData.width,
          height: initialData.height,
          thickness: initialData.thickness,
          pricePerSquareMeter: initialData.pricePerSquareMeter,
          availableQuantity: initialData.availableQuantity,
          isActive: initialData.isActive,
          description: initialData.description || '',
        }
      : {
          name: '',
          type: MaterialType.WOOD,
          width: 2440,
          height: 1220,
          thickness: 18,
          pricePerSquareMeter: 0,
          availableQuantity: 0,
          isActive: true,
          description: '',
        },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Material Name"
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required error={!!errors.type}>
                <InputLabel>Material Type</InputLabel>
                <Select {...field} label="Material Type">
                  {Object.values(MaterialType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && (
                  <FormHelperText>{errors.type.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="pricePerSquareMeter"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Price per m²"
                type="number"
                fullWidth
                required
                error={!!errors.pricePerSquareMeter}
                helperText={errors.pricePerSquareMeter?.message}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Controller
            name="width"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Width (mm)"
                type="number"
                fullWidth
                required
                error={!!errors.width}
                helperText={errors.width?.message}
                InputProps={{ inputProps: { min: 0 } }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Controller
            name="height"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Height (mm)"
                type="number"
                fullWidth
                required
                error={!!errors.height}
                helperText={errors.height?.message}
                InputProps={{ inputProps: { min: 0 } }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Controller
            name="thickness"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Thickness (mm)"
                type="number"
                fullWidth
                required
                error={!!errors.thickness}
                helperText={errors.thickness?.message}
                InputProps={{ inputProps: { min: 0, step: 0.1 } }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="availableQuantity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Available Quantity"
                type="number"
                fullWidth
                required
                error={!!errors.availableQuantity}
                helperText={errors.availableQuantity?.message}
                InputProps={{ inputProps: { min: 0 } }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Active"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaterialForm;