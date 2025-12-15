import { z } from 'zod';
import { Declaration } from './declarations';

/**
 * Review Schema
 *
 * Defines the structure for a form review step that allows users to review and confirm
 * their form submission before final submission. The review can include optional
 * declarations that users must acknowledge or agree to.
 *
 * Review steps are typically used at the end of multi-step forms to:
 * - Display a summary of all entered data
 * - Present legal declarations, terms, or agreements
 * - Allow final confirmation before submission
 * - Provide a last chance to edit previous steps
 *
 * @example
 * // Basic review step without declarations
 * const basicReview: TReview = {
 *   type: 'review'
 * };
 *
 * @example
 * // Review step with legal declarations
 * const reviewWithDeclarations: TReview = {
 *   type: 'review',
 *   declarations: [
 *     {
 *       id: '550e8400-e29b-41d4-a716-446655440000',
 *       label: 'I certify that all information provided is accurate and complete',
 *       propertyPath: 'certificationDeclaration',
 *       required: true,
 *       type: 'certification'
 *     },
 *     {
 *       id: '550e8400-e29b-41d4-a716-446655440001',
 *       label: 'I agree to the Terms of Service and Privacy Policy',
 *       propertyPath: 'termsAgreement',
 *       required: true,
 *       type: 'agreement'
 *     },
 *     {
 *       id: '550e8400-e29b-41d4-a716-446655440002',
 *       label: 'I would like to receive marketing communications (optional)',
 *       propertyPath: 'marketingConsent',
 *       required: false,
 *       type: 'consent'
 *     }
 *   ]
 * };
 *
 * @example
 * // Review step for financial application
 * const financialReview: TReview = {
 *   type: 'review',
 *   declarations: [
 *     {
 *       id: '550e8400-e29b-41d4-a716-446655440003',
 *       label: 'I declare that the financial information provided is true and accurate',
 *       propertyPath: 'financialDeclaration',
 *       required: true,
 *       type: 'financial'
 *     },
 *     {
 *       id: '550e8400-e29b-41d4-a716-446655440004',
 *       label: 'I understand that providing false information may result in application rejection',
 *       propertyPath: 'fraudWarning',
 *       required: true,
 *       type: 'warning'
 *     }
 *   ]
 * };
 */
export const Review = z.object({
  declarations: z
    .array(z.lazy(() => Declaration))
    .optional()
    .describe(
      'Optional array of declarations that users must acknowledge before form submission. Each declaration can be required or optional and will be rendered as checkboxes or agreement controls in the review interface.'
    ),
  type: z
    .string()
    .describe(
      "The type identifier for the review step. This should typically be set to 'review' to indicate this is a review/confirmation step in the form flow."
    ),
});

export type TReview = z.infer<typeof Review>;
