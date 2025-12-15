import { z } from 'zod';
import { StepElementSchema } from './layout';
import { Review } from './reviews';

/**
 * Form Element Schema
 *
 * Defines the structure of a dynamic form, which is the top-level container for all form elements.
 * A form consists of a title, optional subtitle, and one or more steps.
 *
 * @example
 * // Basic single-step form
 * const singleStepForm: TFormElement = {
 *   type: 'form',
 *   title: 'Contact Information',
 *   subtitle: 'Please provide your contact details',
 *   steps: [{
 *     type: 'layout',
 *     layoutType: 'step',
 *     id: 'contactStep',
 *     sections: [...]
 *   }]
 * };
 *
 * @example
 * // Multi-step form
 * const multiStepForm: TFormElement = {
 *   type: 'form',
 *   title: 'Registration Form',
 *   subtitle: 'Complete all steps to register',
 *   multistep: true,
 *   haveReview: true,
 *   steps: [
 *     {
 *       type: 'layout',
 *       layoutType: 'step',
 *       title: 'Personal Information',
 *       id: 'personalInfoStep',
 *       sections: [...]
 *     },
 *     {
 *       type: 'layout',
 *       layoutType: 'step',
 *       title: 'Account Details',
 *       id: 'accountDetailsStep',
 *       sections: [...]
 *     }
 *   ]
 * };
 */
export const FormElementSchema = z
  .object({
    id: z.string().nonempty(),
    multistep: z.literal(true).optional(),
    review: Review.optional(),
    steps: z.array(StepElementSchema).min(1, 'Atleast on step is required'),
    subtitle: z.string().optional(),
    title: z.string(),
    type: z.literal('form'),
  })
  .refine(data => (data.multistep ? data.steps.length > 1 : data.steps.length === 1), 'Invalid number of steps');
export type TFormElement = z.infer<typeof FormElementSchema>;
