import { z } from 'zod';
import { DateValueSchema } from '@/schemas/date';
import { DateTimeValueSchema } from '@/schemas/date-time';
import { verifyMinMaxDate } from '@/utils/date';
import { ConditionRuleSchema } from './condition';

/**
 * Schema for validation rules that use a condition with an error message
 *
 * @example
 * // Validation rule that checks if age is at least 18
 * const ageValidation: TValidationRule = {
 *   type: 'condition',
 *   message: "You must be at least 18 years old",
 *   val: ["age", "18", "LT"]
 * };
 */
export const RuleValidationSchema = z.object({
  message: z.string(),
  type: z.literal('condition'),
  val: ConditionRuleSchema,
});
export type TRuleValidation = z.infer<typeof RuleValidationSchema>;

/**
 * Schema for validating the number of selected options in multi-select fields
 *
 * @example
 * // Validation requiring between 2 and 5 options to be selected
 * const multiSelectValidation: TOptionsSelectionValidation = {
 *   type: 'noOfOptions',
 *   min: 2,
 *   max: 5,
 *   message: "Please select between 2 and 5 options"
 * };
 *
 * @example
 * // Validation requiring exactly 3 options
 * const exactSelectionValidation: TOptionsSelectionValidation = {
 *   type: 'noOfOptions',
 *   min: 3,
 *   max: 3,
 *   message: "Please select exactly 3 options"
 * };
 */
export const OptionsSelectionValidationSchema = z.object({
  max: z.number(),
  message: z.string().nonempty(),
  min: z.number(),
  type: z.literal('noOfOptions'),
});
export type TOptionsSelectionValidation = z.infer<typeof OptionsSelectionValidationSchema>;

/**
 * Schema for validating numeric values with minimum or maximum constraints
 *
 * @example
 * // Validation requiring a number to be at least 18
 * const minimumAgeValidation: TNumberValidation = {
 *   type: 'min',
 *   val: 18,
 *   message: "Age must be at least 18"
 * };
 *
 * @example
 * // Validation requiring a number to be at most 100
 * const maximumScoreValidation: TNumberValidation = {
 *   type: 'max',
 *   val: 100,
 *   message: "Score cannot exceed 100"
 * };
 */
export const NumberValidationSchema = z.discriminatedUnion('type', [
  z.object({
    message: z.string().nonempty(),
    type: z.literal('min'),
    val: z.number(),
  }),
  z.object({
    message: z.string().nonempty(),
    type: z.literal('max'),
    val: z.number(),
  }),
]);
export type TNumberValidation = z.infer<typeof NumberValidationSchema>;

/**
 * Schema for validating string values with length or pattern constraints
 *
 * @example
 * // Validation requiring a string to have at least 8 characters
 * const minLengthValidation: TStringValidation = {
 *   type: 'minLen',
 *   val: 8,
 *   message: "Password must be at least 8 characters long"
 * };
 *
 * @example
 * // Validation requiring a string to have at most 100 characters
 * const maxLengthValidation: TStringValidation = {
 *   type: 'maxLen',
 *   val: 100,
 *   message: "Description cannot exceed 100 characters"
 * };
 *
 * @example
 * // Validation requiring a string to match a regex pattern (email)
 * const emailPatternValidation: TStringValidation = {
 *   type: 'pattern',
 *   val: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
 *   message: "Please enter a valid email address"
 * };
 */
export const StringValidationSchema = z.discriminatedUnion('type', [
  z.object({
    message: z.string().nonempty(),
    type: z.literal('minLen'),
    val: z.number().positive('string length cannot be negative'),
  }),
  z.object({
    message: z.string().nonempty(),
    type: z.literal('maxLen'),
    val: z.number().positive('string length cannot be negative'),
  }),
  z.object({
    message: z.string().nonempty(),
    type: z.literal('pattern'),
    val: z.string(),
  }),
]);
export type TStringValidation = z.infer<typeof StringValidationSchema>;

/**
 * Schema for validating date values with minimum and maximum constraints
 *
 * @example
 * // Validation requiring a date to be between 2023-01-01 and today
 * const dateRangeValidation: TDateValidation = {
 *   type: 'dateRange',
 *   min: "2023-01-01",
 *   max: "__today__",
 *   message: "Date must be between January 1, 2023 and today"
 * };
 *
 * @example
 * // Validation for future dates only (appointment scheduling)
 * const futureDateValidation: TDateValidation = {
 *   type: 'dateRange',
 *   min: "__today__",
 *   max: {init: "__today__", offset: { yrs: 1 }},
 *   message: "Please select a date between today and one year from now"
 * };
 */
export const DateValidationSchema = z
  .object({
    max: DateValueSchema,
    message: z.string().nonempty(),
    min: DateValueSchema,
    type: z.literal('dateRange'),
  })
  .refine(data => data.max && data.min && verifyMinMaxDate(data.min, data.max), '"max" cannot be before "min"');
export type TDateValidation = z.infer<typeof DateValidationSchema>;

/**
 * Schema for validating date-time values with minimum and maximum constraints
 *
 * @example
 * // Validation requiring a date-time to be between 2023-01-01T00:00:00Z and now
 * const dateTimeRangeValidation: TDateTimeValidation = {
 *   type: 'dateTimeRange',
 *   min: "2023-01-01T00:00:00Z",
 *   max: "__now__",
 *   message: "Date-time must be between January 1, 2023 and now"
 * };
 */
export const DateTimeValidationSchema = z
  .object({
    max: DateTimeValueSchema,
    message: z.string().nonempty(),
    min: DateTimeValueSchema,
    type: z.literal('dateTimeRange'),
  })
  .refine(data => data.max && data.min && verifyMinMaxDate(data.min, data.max), '"max" cannot be before "min"');
export type TDateTimeValidation = z.infer<typeof DateTimeValidationSchema>;

/**
 * Schema for validations that use custom functions with error messages
 *
 * @example
 * // Validation using a custom function to check if a username is available
 * const usernameValidation: TValidationFunction = {
 *   type: 'customFunc',
 *   functionId: "checkUsernameAvailability",
 *   message: "This username is already taken"
 * };
 *
 * @example
 * // Validation using a custom function for complex password requirements
 * const passwordValidation: TValidationFunction = {
 *   type: 'customFunc',
 *   functionId: "validatePasswordComplexity",
 *   message: "Password must include uppercase, lowercase, number, and special character"
 * };
 */
export const ValidationFunctionSchema = z.object({
  functionId: z.string().nonempty().describe('ID of the custom validation function'),
  message: z.string().nonempty(),
  type: z.literal('customFunc'),
});
export type TValidationFunction = z.infer<typeof ValidationFunctionSchema>;

/**
 * Schema for validating file uploads with size and format constraints
 *
 * @example
 * // Validation for image files under 5MB
 * const imageFileValidation: TFileValidation = {
 *   type: 'file',
 *   maxSize: 5 * 1024 * 1024, // 5MB in bytes
 *   acceptedFormats: ['image/jpeg', 'image/png', 'image/gif'],
 *   message: "Please upload an image file (JPG, PNG, or GIF) under 5MB"
 * };
 *
 * @example
 * // Validation for PDF documents
 * const documentFileValidation: TFileValidation = {
 *   type: 'file',
 *   maxSize: 10 * 1024 * 1024, // 10MB in bytes
 *   acceptedFormats: ['application/pdf'],
 *   message: "Please upload a PDF document under 10MB"
 * };
 */
export const FileValidationSchema = z.object({
  acceptedFormats: z.array(z.string()).describe('List of accepted file formats'),
  maxSize: z.number().positive().describe('Maximum file size in bytes'),
  message: z.string().nonempty(),
  type: z.literal('file'),
});
export type TFileValidation = z.infer<typeof FileValidationSchema>;

export type TValidationSchema =
  | TNumberValidation
  | TStringValidation
  | TDateValidation
  | TValidationFunction
  | TOptionsSelectionValidation
  | TValidationFunction
  | TRuleValidation
  | TDateValidation
  | TDateTimeValidation
  | TFileValidation;
