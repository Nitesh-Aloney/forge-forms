import { dayJS } from '@/integrations/dayjs';
import { evaluateDateExpression } from '@/utils/date';
import { evaluateDateTimeExpression, withInDateTime } from '@/utils/date-time';
import type {
  TDateTimeValidation,
  TDateValidation,
  TNumberValidation,
  TOptionsSelectionValidation,
  TStringValidation,
} from '../schemas/form-entites/validation';
import type { TValidationFunctionSignature } from '../types';

/**
 * Validates the number of selected options in a multi-select field
 *
 * @param validationSchema - The validation rule with min and max constraints
 * @param value - The selected options array to validate
 * @returns An error message if validation fails, or undefined if validation passes
 */
export const noOfOptions: TValidationFunctionSignature<TOptionsSelectionValidation> = (
  validationSchema,
  value,
  _formValues
) => {
  if (!Array.isArray(value)) return validationSchema.message;

  const count = value.length;
  if (count < validationSchema.min || count > validationSchema.max) return validationSchema.message;

  return undefined;
};

/**
 * Validates a number's minimum value
 *
 * @param validationSchema - The validation rule with minimum value constraint
 * @param value - The number to validate
 * @returns An error message if validation fails, or undefined if validation passes
 */
export const min: TValidationFunctionSignature<Extract<TNumberValidation, { type: 'min' }>> = (
  validationSchema,
  value,
  _formValues
) => {
  if (typeof value !== 'number' || value < validationSchema.val) return validationSchema.message;
  return undefined;
};

/**
 * Validates a number's maximum value
 *
 * @param validationSchema - The validation rule with maximum value constraint
 * @param value - The number to validate
 * @returns An error message if validation fails, or undefined if validation passes
 */
export const max: TValidationFunctionSignature<Extract<TNumberValidation, { type: 'max' }>> = (
  validationSchema,
  value,
  _formValues
) => {
  if (typeof value !== 'number' || value > validationSchema.val) return validationSchema.message;
  return undefined;
};

/**
 * Validates a string's minimum length
 *
 * @param validationSchema - The validation rule with minimum length
 * @param value - The string to validate
 * @returns An error message if validation fails, or undefined if validation passes
 */
export const minLen: TValidationFunctionSignature<Extract<TStringValidation, { type: 'minLen' }>> = (
  validationSchema,
  value,
  _formValues
) => {
  if (typeof value === 'undefined' || !(typeof value !== 'string' || value.length < validationSchema.val)) return undefined;
  return validationSchema.message;
};

/**
 * Validates a string's maximum length
 *
 * @param validationSchema - The validation rule with maximum length
 * @param value - The string to validate
 * @returns An error message if validation fails, or undefined if validation passes
 */
export const maxLen: TValidationFunctionSignature<Extract<TStringValidation, { type: 'maxLen' }>> = (
  validationSchema,
  value,
  _formValues
) => {
  if (typeof value === 'undefined' || !(typeof value !== 'string' || value.length > validationSchema.val)) return undefined;
  return validationSchema.message;
};

/**
 * Validates a string against a regex pattern
 *
 * @param validationSchema - The validation rule with regex pattern
 * @param value - The string to validate
 * @returns An error message if validation fails, or undefined if validation passes
 */
export const pattern: TValidationFunctionSignature<Extract<TStringValidation, { type: 'pattern' }>> = (
  validationSchema,
  value,
  _formValues
) => {
  if (typeof value === 'undefined') return undefined;
  if (typeof value !== 'string') return validationSchema.message;

  try {
    const regex = new RegExp(validationSchema.val);
    if (!regex.test(value)) return validationSchema.message;
  } catch (_error) {
    // Invalid regex pattern
    return validationSchema.message;
  }

  return undefined;
};

/**
 * Validates a date against a date range
 *
 * @param validationSchema - The validation rule with minimum and maximum date constraints
 * @param value - The date string to validate
 * @param formValues - The current form values for context (not used here)
 * @returns An error message if validation fails, or undefined if validation passes
 */
export const dateRange: TValidationFunctionSignature<TDateValidation> = (validationSchema, value, _formValues) => {
  const minIfAny = validationSchema.min ? evaluateDateExpression(validationSchema.min) : undefined;
  const maxIfAny = validationSchema.max ? evaluateDateExpression(validationSchema.max) : undefined;

  if (typeof value !== 'string') return validationSchema.message;

  const valueToDayJS = dayJS(value);

  if (!withInDateTime(valueToDayJS, minIfAny, maxIfAny)) return validationSchema.message;

  return undefined;
};

/**
 * Validates a date time against a date time range
 *
 * @param validationSchema - The validation rule with minimum and maximum date constraints
 * @param value - The date string to validate
 * @param formValues - The current form values for context (not used here)
 * @returns An error message if validation fails, or undefined if validation passes
 */
export const dateTimeRange: TValidationFunctionSignature<TDateTimeValidation> = (validationSchema, value, _formValues) => {
  const minIfAny = validationSchema.min ? evaluateDateTimeExpression(validationSchema.min) : undefined;
  const maxIfAny = validationSchema.max ? evaluateDateTimeExpression(validationSchema.max) : undefined;

  if (typeof value !== 'string') return validationSchema.message;

  const valueToDayJS = dayJS(value);

  if (!withInDateTime(valueToDayJS, minIfAny, maxIfAny)) return validationSchema.message;

  return undefined;
};
