import { z } from 'zod';

export const OptionsProcessorPrefix = z.literal('options');
export type TOptionsProcessorPrefix = z.infer<typeof OptionsProcessorPrefix>;

/**
 * Option Item Schema
 *
 * Defines an individual option item with a label and value.
 * Used in select, checkbox, radio, and other option-based fields.
 *
 * @example
 * const genderOption: TOptionItem = {
 *   label: 'Male',
 *   value: 'male'
 * };
 */
export const OptionItemSchema = z.object({
  label: z.string().nonempty(),
  value: z.union([z.string().nonempty(), z.number(), z.boolean()]),
});
export type TOptionItem = z.infer<typeof OptionItemSchema>;

/**
 * Static Option Schema
 *
 * Defines a list of predefined options for selection fields.
 * All options are defined directly in the schema.
 *
 * @example
 * const genderOptions: TStaticOption = {
 *   type: 'static',
 *   items: [
 *     { label: 'Male', value: 'male' },
 *     { label: 'Female', value: 'female' },
 *     { label: 'Non-binary', value: 'non-binary' },
 *     { label: 'Prefer not to say', value: 'not-specified' }
 *   ],
 *   defaultValue: 'not-specified'
 * };
 */
export const StaticOptionSchema = z.object({
  defaultValue: z.string().optional(),
  items: z.array(OptionItemSchema),
  type: z.literal('static'),
});
export type TStaticOption = z.infer<typeof StaticOptionSchema>;

/**
 * Dynamic Option Schema
 *
 * Defines a source for dynamically loading options from an API endpoint.
 * Options will be fetched at runtime rather than being hardcoded.
 *
 * @example
 * const countryOptions: TDynamicOption = {
 *   type: 'dynamic',
 *   url: 'https://api.example.com/countries'
 * };
 *
 * @example
 * const stateOptions: TDynamicOption = {
 *   type: 'dynamic',
 *   url: 'https://api.example.com/states?country=${country}'
 * };
 */
export const DynamicOptionSchema = z.object({
  processor: z
    .string()
    .refine(data => data.startsWith(`${OptionsProcessorPrefix.value}_`), "Options processor name should start with 'options-'")
    .optional()
    .describe('Optional custom functionID to process into Option Items'),
  type: z.literal('dynamic'),
  url: z.string().nonempty(),
});
export type TDynamicOption = z.infer<typeof DynamicOptionSchema>;

/**
 * Options Schema
 *
 * A discriminated union of static and dynamic options.
 * The 'type' field determines whether the options are static or dynamically loaded.
 */
export const OptionsSchema = z.discriminatedUnion('type', [StaticOptionSchema, DynamicOptionSchema]);
export type TOptions = z.infer<typeof OptionsSchema>;
