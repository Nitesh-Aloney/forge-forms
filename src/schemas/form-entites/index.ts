import { z } from 'zod';
import { Declaration } from '@/schemas/form-entites/declarations';
import { Review } from '@/schemas/form-entites/reviews';
import { FormElementSchema } from './form';
import { FormFieldElementSchema } from './form-fields';
import { LayoutElementSchema } from './layout';
import { NudgeElementSchema } from './nudge';
import { ObjectListElementSchema } from './object-list';

/**
 * Element Schema
 *
 * A union type representing all possible element types that can be used in a dynamic form.
 * This includes form elements, layout elements, and form field elements.
 *
 */
export const Element = z.union([
  FormElementSchema,
  LayoutElementSchema,
  FormFieldElementSchema,
  NudgeElementSchema,
  ObjectListElementSchema,
  Review,
  Declaration,
]);
export type TElement = z.infer<typeof Element>;
