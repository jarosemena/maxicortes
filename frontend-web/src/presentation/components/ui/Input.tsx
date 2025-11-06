import React, { forwardRef, useState } from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
} from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  validate?: (value: string) => string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ startAdornment, endAdornment, validate, onBlur, onChange, ...props }, ref) => {
    const [validationError, setValidationError] = useState<string>('');

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (validate) {
        const error = validate(event.target.value);
        setValidationError(error);
      }
      onBlur?.(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // Clear validation error on change
      if (validationError) {
        setValidationError('');
      }
      onChange?.(event);
    };

    const getInputProps = () => {
      const inputProps: any = {};

      if (startAdornment) {
        inputProps.startAdornment = (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        );
      }

      if (endAdornment) {
        inputProps.endAdornment = (
          <InputAdornment position="end">{endAdornment}</InputAdornment>
        );
      }

      return inputProps;
    };

    const hasError = props.error || !!validationError;
    const helperText = validationError || props.helperText;

    return (
      <TextField
        ref={ref}
        variant="outlined"
        error={hasError}
        helperText={helperText}
        InputProps={getInputProps()}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';