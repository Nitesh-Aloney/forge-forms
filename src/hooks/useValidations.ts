import { useCallback } from 'react';
import type { FieldValues } from 'react-hook-form';
import type { TRuleValidation, TValidationSchema } from '@/schemas/form-entites/validation';
import type { TValidationFunctionSignature } from '@/types';
import { dateRange, dateTimeRange, max, maxLen, min, minLen, noOfOptions, pattern } from '@/utils/validation';
import useConditions from './useConditions';
import { useCustomFunctions } from './useCustomFunctions';
import { useFormField } from './useFormField';

/**
 * Hook for validating form values against a validation schema
 *
 * @param validationSchema - The validation rules to apply
 * @param path - The effective property path for the validation
 * @returns Object containing validation methods and utilities
 */
export function useValidations(validationSchemas: TValidationSchema[], path: string) {
  const { evaluateSingle } = useConditions(path);
  const { get } = useCustomFunctions();
  const { required } = useFormField();

  const validate: TValidationFunctionSignature<TValidationSchema> = useCallback(
    (validationSchema, value, formValues) => {
      switch (validationSchema.type) {
        case 'noOfOptions':
          return noOfOptions(validationSchema, value as unknown[], formValues);
        case 'min':
          return min(validationSchema, value, formValues);
        case 'max':
          return max(validationSchema, value, formValues);
        case 'minLen':
          return minLen(validationSchema, value, formValues);
        case 'maxLen':
          return maxLen(validationSchema, value, formValues);
        case 'pattern':
          return pattern(validationSchema, value, formValues);
        case 'dateRange':
          return dateRange(validationSchema, value, formValues);
        case 'dateTimeRange':
          return dateTimeRange(validationSchema, value, formValues);
        case 'condition':
          return evaluateSingle((validationSchema as TRuleValidation).val) ? undefined : validationSchema.message;
        case 'customFunc': {
          return get(validationSchema.functionId)(value, formValues) ? undefined : validationSchema.message;
        }
        default:
          return undefined;
      }
    },
    [evaluateSingle, get]
  );

  const isValid = useCallback(
    (value: unknown, formValues: FieldValues) => {
      if (value === undefined && !required) return true;
      const firstFailedValidation = validationSchemas.find(s => typeof validate(s, value, formValues) === 'string');
      return firstFailedValidation?.message;
    },
    [validationSchemas, validate, required]
  );

  return { isValid };
}
