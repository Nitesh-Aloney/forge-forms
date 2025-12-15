import { z } from 'zod';
import { ConditionsSchema } from './condition';

/**
 * Element Base Schema
 *
 * The foundation schema for all elements in the dynamic form system.
 * Provides common properties that are shared across different element types.
 *
 * @example
 * // Basic element configuration
 * const baseElement: TElementBase = {
 *   id: 'firstName',
 *   title: 'First Name',
 *   propertyPath: 'person.firstName',
 *   required: true
 * };
 *
 * @example
 * // Element with conditional visibility
 * const conditionalElement: TElementBase = {
 *   id: 'spouseName',
 *   title: 'Spouse Name',
 *   propertyPath: 'family.spouseName',
 *   hide: [
 *     ['maritalStatus', 'single', 'EQ']
 *   ]
 * };
 */
export const ElementBaseSchema = z.object({
  disable: z.optional(ConditionsSchema.or(z.boolean())),
  hide: z.optional(ConditionsSchema.or(z.boolean())),
  id: z.string(),
  propertyPath: z.string(),
  required: z.optional(ConditionsSchema.or(z.boolean())),
  subtitle: z.optional(z.string()),
  title: z.optional(z.string()),
});
export type TElementBase = z.infer<typeof ElementBaseSchema>;
