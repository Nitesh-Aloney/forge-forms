import { z } from 'zod';
import { DateValueSchema } from '@/schemas/date';
import { DateTimeValueSchema } from '@/schemas/date-time';
import { verifyMinMaxDate } from '@/utils/date';
import { verifyMinMaxDateTime } from '@/utils/date-time';
import { ElementBaseSchema } from './element-base';
import { OptionsSchema } from './option';
import {
  DateTimeValidationSchema,
  DateValidationSchema,
  FileValidationSchema,
  NumberValidationSchema,
  OptionsSelectionValidationSchema,
  RuleValidationSchema,
  StringValidationSchema,
  ValidationFunctionSchema,
} from './validation';

/**
 * Base schema for all form field elements
 * Provides common properties for all field types
 */
export const FormFieldBaseSchema = ElementBaseSchema.omit({ title: true }).extend({
  helperText: z.string().optional(),
  placeholder: z.string().optional(),
  title: z.string(),
  type: z.literal('field'),
});
export type TFormFieldBase = z.infer<typeof FormFieldBaseSchema>;

/**
 * Text Area Field Schema
 *
 * A multi-line text input field for longer text entries
 *
 * @example
 * const descriptionField: TTextAreaField = {
 *   type: 'field',
 *   fieldType: 'textarea',
 *   title: 'Description',
 *   propertyPath: 'description',
 *   id: 'description',
 *   placeholder: 'Enter a detailed description...',
 *   helperText: 'Provide as much detail as possible'
 * };
 */
export const TextAreaFieldSchema = FormFieldBaseSchema.extend({
  fieldType: z.literal('textarea'),
  validations: z.array(z.union([RuleValidationSchema, ValidationFunctionSchema])).optional(),
});
export type TTextAreaField = z.infer<typeof TextAreaFieldSchema>;

/**
 * Checkbox Field Schema
 *
 * A field for selecting multiple options from a list
 *
 * @example
 * const hobbiesField: TCheckboxField = {
 *   type: 'field',
 *   fieldType: 'checkbox',
 *   title: 'Hobbies',
 *   propertyPath: 'hobbies',
 *   id: 'hobbies',
 *   options: {
 *     type: 'static',
 *     items: [
 *       { label: 'Reading', value: 'reading' },
 *       { label: 'Sports', value: 'sports' },
 *       { label: 'Music', value: 'music' },
 *       { label: 'Travel', value: 'travel' }
 *     ]
 *   },
 *   helperText: 'Select all that apply'
 * };
 */
export const CheckboxFieldSchema = FormFieldBaseSchema.extend({
  defaultValue: z.string().array().optional(),
  fieldType: z.literal('checkbox'),
  options: OptionsSchema,
  validations: z.array(z.union([RuleValidationSchema, ValidationFunctionSchema, OptionsSelectionValidationSchema])).optional(),
});
export type TCheckboxField = z.infer<typeof CheckboxFieldSchema>;

/**
 * Select Field Schema
 *
 * A dropdown field for selecting one or multiple options from a list
 *
 * @example
 * const countryField: TSelectField = {
 *   type: 'field',
 *   fieldType: 'select',
 *   title: 'Country',
 *   propertyPath: 'country',
 *   id: 'country',
 *   options: {
 *     type: 'static',
 *     items: [
 *       { label: 'United States', value: 'us' },
 *       { label: 'Canada', value: 'ca' },
 *       { label: 'United Kingdom', value: 'uk' }
 *     ],
 *     defaultValue: 'us'
 *   },
 *   placeholder: 'Select your country'
 * };
 *
 * @example
 * // Multi-select example
 * const languagesField: TSelectField = {
 *   type: 'field',
 *   fieldType: 'select',
 *   title: 'Languages',
 *   propertyPath: 'languages',
 *   id: 'languages',
 *   multiple: true,
 *   options: {
 *     type: 'static',
 *     items: [
 *       { label: 'English', value: 'en' },
 *       { label: 'Spanish', value: 'es' },
 *       { label: 'French', value: 'fr' }
 *     ]
 *   }
 * };
 */
export const SelectFieldSchema = FormFieldBaseSchema.extend({
  defaultValue: z.union([z.string().array(), z.string()]).optional(),
  fieldType: z.literal('select'),
  multiple: z.boolean().optional(),
  options: OptionsSchema,
  validations: z.array(z.union([RuleValidationSchema, ValidationFunctionSchema, OptionsSelectionValidationSchema])).optional(),
});
export type TSelectField = z.infer<typeof SelectFieldSchema>;

/**
 * Radio Field Schema
 *
 * A field for selecting a single option from a list of radio buttons
 *
 * @example
 * const genderField: TRadioField = {
 *   type: 'field',
 *   fieldType: 'radio',
 *   title: 'Gender',
 *   propertyPath: 'gender',
 *   id: 'gender',
 *   options: {
 *     type: 'static',
 *     items: [
 *       { label: 'Male', value: 'male' },
 *       { label: 'Female', value: 'female' },
 *       { label: 'Non-binary', value: 'non-binary' }
 *     ]
 *   }
 * };
 */
export const RadioFieldSchema = FormFieldBaseSchema.extend({
  defaultValue: z.string().optional(),
  fieldType: z.literal('radio'),
  options: OptionsSchema,
  validations: z.array(z.union([RuleValidationSchema, ValidationFunctionSchema])).optional(),
});
export type TRadioField = z.infer<typeof RadioFieldSchema>;

/**
 * Radio Binary Field Schema
 *
 * A field for selecting a single option from a yes or no
 * the property path will be set with a true for yes and false for no
 *
 * @example
 * const isPepField: TBinaryRadioField = {
 *   type: 'field',
 *   fieldType: 'radio-binary',
 *   title: 'Are you a Politically Exposed Person (PEP)?',
 *   propertyPath: 'isPep',
 *   id: 'pep'
 * };
 */
export const RadioBinaryFieldSchema = FormFieldBaseSchema.extend({
  defaultValue: z.boolean().optional(),
  fieldType: z.literal('radio-binary'),
  validations: z.array(z.union([RuleValidationSchema, ValidationFunctionSchema])).optional(),
});
export type TRadioBinaryField = z.infer<typeof RadioBinaryFieldSchema>;

/**
 * Switch Field Schema
 *
 * A toggle switch field for binary choices
 *
 * @example
 * const notificationsField: TSwitchField = {
 *   type: 'field',
 *   fieldType: 'switch',
 *   title: 'Email Notifications',
 *   propertyPath: 'emailNotifications',
 *   id: 'emailNotifications',
 *   options: {
 *     type: 'static',
 *     items: [
 *       { label: 'Enable', value: 'true' },
 *       { label: 'Disable', value: 'false' }
 *     ]
 *   },
 *   defaultValue: 'true',
 *   helperText: 'Receive updates about your account'
 * };
 */
export const SwitchFieldSchema = FormFieldBaseSchema.extend({
  fieldType: z.literal('switch'),
  options: OptionsSchema,
  validations: z.array(z.union([RuleValidationSchema, ValidationFunctionSchema])).optional(),
});
export type TSwitchField = z.infer<typeof SwitchFieldSchema>;

/**
 * Date Field Schema
 *
 * A field for selecting dates with optional constraints
 *
 * @example
 * const birthDateField: TDateField = {
 *   type: 'field',
 *   fieldType: 'date',
 *   title: 'Date of Birth',
 *   propertyPath: 'dob',
 *   id: 'dob',
 *   onlyPast: true,
 *   helperText: 'Your date of birth'
 * };
 *
 * @example
 * const appointmentField: TDateField = {
 *   type: 'field',
 *   fieldType: 'date',
 *   title: 'Appointment Date',
 *   propertyPath: 'appointmentDate',
 *   id: 'appointmentDate',
 *   onlyFuture: true,
 *   max: '2024-12-31', // Limit to appointments within current year
 *   helperText: 'Select a date for your appointment'
 * };
 */
export const DateFieldSchema = FormFieldBaseSchema.extend({
  dateFormat: z.string().optional().describe('Format in which date is stored'),
  defaultValue: DateValueSchema.optional(),
  fieldType: z.literal('date'),
  max: DateValueSchema.optional().describe('Maximum date allowed'),
  min: DateValueSchema.optional().describe('Minimum date allowed'),
  onlyFuture: z.literal(true).optional().describe('Only future dates are allowed'),
  onlyPast: z.literal(true).optional().describe('Only past dates are allowed'),
  validations: z.array(z.union([RuleValidationSchema, ValidationFunctionSchema, DateValidationSchema])).optional(),
})
  .refine(data => !(data.onlyFuture && data.onlyPast), 'Only one of "onlyFuture" and "onlyPast" is allowed')
  .refine(data => !(data.onlyFuture && data.min), '"min" cannot be used with "onlyFuture"')
  .refine(data => !(data.onlyPast && data.max), '"max" cannot be used with "onlyPast"')
  .refine(data => !data.max || !data.min || verifyMinMaxDate(data.min, data.max), '"max" must be greater than "min"');
export type TDateField = z.infer<typeof DateFieldSchema>;

/**
 * Time Field Schema
 *
 * A field for selecting time values
 *
 * @example
 * const appointmentTimeField: TTimeField = {
 *   type: 'field',
 *   fieldType: 'time',
 *   title: 'Appointment Time',
 *   propertyPath: 'appointmentTime',
 *   id: 'appointmentTime',
 *   helperText: 'Select your preferred time'
 * };
 */
export const TimeFieldSchema = FormFieldBaseSchema.extend({
  fieldType: z.literal('time'),
  validations: z.array(z.union([RuleValidationSchema, ValidationFunctionSchema])).optional(),
});
export type TTimeField = z.infer<typeof TimeFieldSchema>;

/**
 * DateTime Field Schema
 *
 * A field for selecting both date and time with optional constraints
 *
 * @example
 * const meetingField: TDateTimeField = {
 *   type: 'field',
 *   fieldType: 'datetime',
 *   title: 'Meeting Schedule',
 *   propertyPath: 'meetingTime',
 *   id: 'meetingTime',
 *   helperText: 'Select date and time for the meeting'
 * };
 *
 * @example
 * const appointmentField: TDateTimeField = {
 *   type: 'field',
 *   fieldType: 'datetime',
 *   title: 'Appointment Date & Time',
 *   propertyPath: 'appointmentDateTime',
 *   id: 'appointmentDateTime',
 *   onlyFuture: true,
 *   max: '2024-12-31T23:59:59Z', // Limit to appointments within current year
 *   helperText: 'Select date and time for your appointment'
 * };
 */
export const DateTimeFieldSchema = FormFieldBaseSchema.extend({
  defaultValue: DateTimeValueSchema.optional(),
  fieldType: z.literal('datetime'),
  max: DateTimeValueSchema.optional().describe('Maximum date and time allowed'),
  min: DateTimeValueSchema.optional().describe('Minimum date and time allowed'),
  onlyFuture: z.literal(true).optional().describe('Only future date-times are allowed'),
  onlyPast: z.literal(true).optional().describe('Only past date-times are allowed'),
  validations: z.array(z.union([RuleValidationSchema, ValidationFunctionSchema, DateTimeValidationSchema])).optional(),
})
  .refine(data => !(data.onlyFuture && data.onlyPast), 'Only one of "onlyFuture" and "onlyPast" is allowed')
  .refine(data => !(data.onlyFuture && data.min), '"min" cannot be used with "onlyFuture"')
  .refine(data => !(data.onlyPast && data.max), '"max" cannot be used with "onlyPast"')
  .refine(data => !data.max || !data.min || verifyMinMaxDateTime(data.min, data.max), '"max" must be greater than "min"');
export type TDateTimeField = z.infer<typeof DateTimeFieldSchema>;

/**
 * Input Field Base Schema
 *
 * Base schema for all input-type fields
 *
 * @example
 * // This is a base schema, typically extended by specific input types
 * const inputBase: TInputFieldBaseSchema = {
 *   type: 'field',
 *   fieldType: 'input',
 *   title: 'Input Field',
 *   propertyPath: 'inputField',
 *   id: 'inputField'
 * };
 */
export const InputFieldBaseSchema = FormFieldBaseSchema.extend({ fieldType: z.literal('input') });
export type TInputFieldBaseSchema = z.infer<typeof InputFieldBaseSchema>;

/**
 * String Input Field Schema
 *
 * A field for text-based input with various input types
 *
 * @example
 * const emailField: TStringInputField = {
 *   type: 'field',
 *   fieldType: 'input',
 *   inputType: 'email',
 *   title: 'Email Address',
 *   propertyPath: 'email',
 *   id: 'email',
 *   placeholder: 'example@domain.com',
 *   validations: [
 *     {
 *       type: 'pattern',
 *       val: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
 *       message: "Please enter a valid email address"
 *     }
 *   ]
 * };
 */
export const StringInputFieldSchema = InputFieldBaseSchema.extend({
  defaultValue: z.string().optional(),
  inputType: z.enum(['email', 'password', 'text', 'url', 'tel']),
  multiline: z.number().min(1, '"multiline" should be >= 1').optional(),
  validations: z.array(z.union([StringValidationSchema, ValidationFunctionSchema, RuleValidationSchema])).optional(),
}).refine(data => !(data.multiline && data.inputType !== 'text'), '"multiline" is only supported for \'text\' inputType');
export type TStringInputField = z.infer<typeof StringInputFieldSchema>;

/**
 * Number Input Field Schema
 *
 * A field for numeric input values
 *
 * @example
 * const ageField: TNumberInputField = {
 *   type: 'field',
 *   fieldType: 'input',
 *   inputType: 'number',
 *   title: 'Age',
 *   propertyPath: 'age',
 *   id: 'age',
 *   validations: [
 *     {
 *       type: 'min',
 *       val: 18,
 *       message: "You must be at least 18 years old"
 *     },
 *     {
 *       type: 'max',
 *       val: 120,
 *       message: "Please enter a valid age"
 *     }
 *   ]
 * };
 */
export const NumberInputFieldSchema = InputFieldBaseSchema.extend({
  defaultValue: z.number().optional(),
  inputType: z.literal('number'),
  validations: z.array(z.union([NumberValidationSchema, ValidationFunctionSchema, RuleValidationSchema])).optional(),
});
export type TNumberInputField = z.infer<typeof NumberInputFieldSchema>;

/**
 * Input Field Schema
 *
 * A union of all input field types
 *
 * @example
 * // This schema is a union type, used as:
 * const inputField: TInputField = {
 *   type: 'field',
 *   fieldType: 'input',
 *   inputType: 'text',
 *   title: 'Username',
 *   propertyPath: 'username',
 *   id: 'username',
 *   placeholder: 'Enter your username'
 * };
 */
export const InputFieldSchema = z.union([StringInputFieldSchema, NumberInputFieldSchema]);
export type TInputField = z.infer<typeof InputFieldSchema>;

export const FileSizeUnitSchema = z.enum(['B', 'KB', 'MB', 'GB']);
export const FileSizeSchema = z.object({
  unit: FileSizeUnitSchema,
  value: z.number().positive(),
});
export type TFileSize = z.infer<typeof FileSizeSchema>;

/**
 * Fileupload Field Schema
 *
 * A schema for file upload fields in a dynamic form.
 *
 * @example
 * const fileUploadField: TFileUploadField = {
 *   type: 'field',
 *   fieldType: 'file-upload',
 *   title: 'Upload File',
 *   propertyPath: 'fileUpload',
 *   id: 'fileUpload',
 *   accept: ['image/*'],
 *   multiple: true,
 *   maxSize: {
 *     value: 5,
 *     unit: 'MB'
 *   },
 *   validations: [
 *     {
 *       type: 'file',
 *       maxSize: {
 *         value: 5,
 *         unit: 'MB'
 *       },
 *       acceptedFormats: ['image/jpeg', 'image/png'],
 *       message: "File must be an image and less than 5MB."
 *     }
 *   ]
 * };
 */
export const FileUploadFieldSchema = FormFieldBaseSchema.extend({
  accept: z.string().array().optional(),
  fieldType: z.literal('file-upload'),
  maxSize: FileSizeSchema.optional(),
  multiple: z.literal(true).optional(),
  validations: z.array(z.union([FileValidationSchema, ValidationFunctionSchema, RuleValidationSchema])).optional(),
});
export type TFileUploadField = z.infer<typeof FileUploadFieldSchema>;

/**
 * Form Field Element Schema
 *
 * A union of all possible form field types
 *
 * @example
 * // This schema is a union type, used throughout the form system
 * // Example form definition containing multiple field types:
 * const formFields: TFormFieldElement[] = [
 *   {
 *     type: 'field',
 *     fieldType: 'input',
 *     inputType: 'text',
 *     title: 'Full Name',
 *     propertyPath: 'fullName',
 *     id: 'fullName'
 *   },
 *   {
 *     type: 'field',
 *     fieldType: 'date',
 *     title: 'Date of Birth',
 *     propertyPath: 'dob',
 *     id: 'dob',
 *     onlyPast: true
 *   },
 *   {
 *     type: 'field',
 *     fieldType: 'select',
 *     title: 'Country',
 *     propertyPath: 'country',
 *     id: 'country',
 *     options: {
 *       type: 'static',
 *       items: [
 *         { label: 'United States', value: 'us' },
 *         { label: 'Canada', value: 'ca' }
 *       ]
 *     }
 *   }
 * ];
 */
export const FormFieldElementSchema = z.union([
  TextAreaFieldSchema,
  CheckboxFieldSchema,
  SelectFieldSchema,
  RadioBinaryFieldSchema,
  RadioFieldSchema,
  SwitchFieldSchema,
  InputFieldSchema,
  DateFieldSchema,
  DateTimeFieldSchema,
  FileUploadFieldSchema,
]);
export type TFormFieldElement = z.infer<typeof FormFieldElementSchema>;
