import { z } from 'zod';
import { ElementBaseSchema } from './element-base';
import { LayoutElementSchema, RowElementSchema, StaticSectionElementSchema } from './layout';

export function generateObjectListElementSchema() {
  return ElementBaseSchema.extend({
    fields: z.array(z.lazy(() => LayoutElementSchema)),
    type: z.literal('object-list'),
  });
}

/**
 * Object List Element Schema
 *
 * Defines a repeatable group of fields that allows users to add multiple entries of the same structure.
 * This is useful for collecting lists of similar items, such as multiple addresses, contact information,
 * or any other repeatable data.
 *
 * @example
 * // Basic object list for collecting multiple addresses
 * const addressList: TObjectListElement = {
 *   type: 'object-list',
 *   title: 'Addresses',
 *   subtitle: 'Add all your addresses',
 *   propertyPath: 'addresses',
 *   items: [
 *     {
 *       type: 'layout',
 *       layoutType: 'row',
 *       id: 'addressRow',
 *       items: [
 *         {
 *           type: 'field',
 *           fieldType: 'input',
 *           inputType: 'text',
 *           title: 'Address Line 1',
 *           propertyPath: 'line1',
 *           id: 'line1'
 *         },
 *         {
 *           type: 'field',
 *           fieldType: 'input',
 *           inputType: 'text',
 *           title: 'Address Line 2',
 *           propertyPath: 'line2',
 *           id: 'line2'
 *         }
 *       ]
 *     }
 *   ]
 * };
 */
export const ObjectListElementSchema = ElementBaseSchema.extend({
  addLabel: z.string().optional().describe('Custom label for the "Add" button'),
  items: z.array(z.union([z.lazy(() => RowElementSchema), z.lazy(() => StaticSectionElementSchema)])),
  max: z.number().min(0).optional().describe('Maximum number of items allowed'),
  min: z.number().min(0).optional().describe('Minimum number of items allowed'),
  type: z.literal('object-list'),
});
export type TObjectListElement = z.infer<typeof ObjectListElementSchema>;
