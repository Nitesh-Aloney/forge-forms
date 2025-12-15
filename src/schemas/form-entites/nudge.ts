import { z } from 'zod';

export const NudgeType = z.enum(['info', 'warning', 'error', 'success']);
export type TNudgeType = z.infer<typeof NudgeType>;

/**
 * Nudge Element Schema
 *
 * Defines a nudge element used to display informational messages or alerts within a form.
 * Nudges are non-interactive UI elements that provide contextual information, warnings,
 * or guidance to users as they fill out forms.
 *
 * @example
 * // Information nudge with helpful context
 * const infoNudge: TNudgeElement = {
 *   id: 'passwordHelp',
 *   type: 'nudge',
 *   level: 'info',
 *   message: 'Password must be at least 8 characters long and contain special characters.'
 * };
 *
 * @example
 * // Warning nudge for important notice
 * const warningNudge: TNudgeElement = {
 *   id: 'dataWarning',
 *   type: 'nudge',
 *   level: 'warning',
 *   message: 'This information will be shared with third-party services.'
 * };
 */
export const NudgeElementSchema = z
  .object({
    id: z.string(),
    level: NudgeType,
    message: z.string(),
    type: z.literal('nudge'),
  })
  .describe('Nudge Element is used to display informational messages or alerts within a form.');
export type TNudgeElement = z.infer<typeof NudgeElementSchema>;
