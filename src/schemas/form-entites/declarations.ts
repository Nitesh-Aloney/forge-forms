import { z } from 'zod';

/**
 * Declaration Schema
 *
 * Defines the structure for form declarations that users must acknowledge or agree to
 * during form submission. Declarations are commonly used for legal agreements,
 * certifications, terms of service, privacy policies, and other acknowledgments.
 *
 * Declarations can be required (must be checked to proceed) or optional (user choice).
 * They are typically rendered as checkboxes with accompanying text in the form interface.
 *
 * @example
 * // Required terms of service declaration
 * const termsDeclaration: TDeclaration = {
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   label: 'I agree to the Terms of Service and Privacy Policy',
 *   propertyPath: 'termsAgreement',
 *   required: true,
 *   type: 'terms'
 * };
 *
 * @example
 * // Optional marketing consent declaration
 * const marketingDeclaration: TDeclaration = {
 *   id: '550e8400-e29b-41d4-a716-446655440001',
 *   label: 'I would like to receive promotional emails and updates',
 *   propertyPath: 'marketingConsent',
 *   required: false,
 *   type: 'marketing'
 * };
 *
 * @example
 * // Financial certification declaration
 * const financialDeclaration: TDeclaration = {
 *   id: '550e8400-e29b-41d4-a716-446655440002',
 *   label: 'I certify that all financial information provided is accurate and complete',
 *   propertyPath: 'financialCertification',
 *   required: true,
 *   type: 'certification'
 * };
 */
export const Declaration = z.object({
  id: z.uuid().describe('Unique identifier for the declaration using UUID format'),
  label: z.string().describe('The text content displayed to users that describes what they are agreeing to or acknowledging'),
  propertyPath: z
    .string()
    .describe('The form field path where the declaration value (true/false) will be stored in the form data'),
  required: z
    .boolean()
    .optional()
    .describe(
      'Whether the declaration must be acknowledged (checked) before form submission. Defaults to false if not specified'
    ),
  type: z
    .string()
    .describe(
      'Category or type of declaration (e.g., "terms", "privacy", "certification", "marketing", "legal") for grouping and styling purposes'
    ),
});

export type TDeclaration = z.infer<typeof Declaration>;
