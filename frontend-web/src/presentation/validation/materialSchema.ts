import * as yup from 'yup';
import { MaterialType } from '../../domain/entities/Material';

export const materialSchema = yup.object({
  name: yup
    .string()
    .required('Material name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),
  
  type: yup
    .string()
    .oneOf(Object.values(MaterialType), 'Invalid material type')
    .required('Material type is required'),
  
  width: yup
    .number()
    .required('Width is required')
    .positive('Width must be positive')
    .max(10000, 'Width must not exceed 10000mm'),
  
  height: yup
    .number()
    .required('Height is required')
    .positive('Height must be positive')
    .max(10000, 'Height must not exceed 10000mm'),
  
  thickness: yup
    .number()
    .required('Thickness is required')
    .positive('Thickness must be positive')
    .max(1000, 'Thickness must not exceed 1000mm'),
  
  pricePerSquareMeter: yup
    .number()
    .required('Price is required')
    .min(0, 'Price cannot be negative')
    .max(10000, 'Price must not exceed 10000'),
  
  availableQuantity: yup
    .number()
    .required('Quantity is required')
    .integer('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative')
    .max(10000, 'Quantity must not exceed 10000'),
  
  isActive: yup
    .boolean()
    .required('Active status is required'),
  
  description: yup
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
});

export type MaterialFormData = yup.InferType<typeof materialSchema>;