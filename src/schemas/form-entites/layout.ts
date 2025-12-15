import { type ZodSchema, z } from 'zod';
import { ElementBaseSchema, type TElementBase } from './element-base';
import { FormFieldElementSchema } from './form-fields';
import { NudgeElementSchema } from './nudge';
import { ObjectListElementSchema, type TObjectListElement } from './object-list';

export const LazySectionProcessorPrefix = z.literal('lazySection');
export type TLazySectionProcessorPrefix = z.infer<typeof LazySectionProcessorPrefix>;

/**
 * Base schema for all layout elements
 */
const LayoutSchemaBase = ElementBaseSchema.omit({ propertyPath: true }).extend({ type: z.literal('layout') });

/**
 * Row Element Schema
 *
 * Defines a row layout element that contains form fields arranged horizontally.
 * Rows can have optional width specifications for each item.
 *
 * @example
 * // Row with custom width distribution (50-25-25)
 * const addressRow: TRowElement = {
 *   type: 'layout',
 *   layoutType: 'row',
 *   widths: [50, 25, 25],
 *   id: 'addressRow',
 *   items: [
 *     {
 *       type: 'field',
 *       fieldType: 'input',
 *       inputType: 'text',
 *       title: 'Street Address',
 *       propertyPath: 'streetAddress',
 *       id: 'streetAddress'
 *     },
 *     {
 *       type: 'field',
 *       fieldType: 'input',
 *       inputType: 'text',
 *       title: 'City',
 *       propertyPath: 'city',
 *       id: 'city'
 *     },
 *     {
 *       type: 'field',
 *       fieldType: 'input',
 *       inputType: 'text',
 *       title: 'ZIP Code',
 *       propertyPath: 'zipCode',
 *       id: 'zipCode'
 *     }
 *   ]
 * };
 */
export const RowElementSchema = LayoutSchemaBase.extend({
  items: z.array(FormFieldElementSchema),
  layoutType: z.literal('row'),
  nudges: NudgeElementSchema.array().optional(),
  widths: z
    .array(z.number().max(100, 'width cannot be greater than 100').min(0, 'width cannot be negative'))
    .refine(data => data.reduce((acc, curr) => acc + curr, 0) === 100, 'Total width must be equal to 100')
    .optional(),
}).refine(s => (!s.widths ? true : s.items.length === s.widths.length), 'Items and widths length mismatch');
export type TRowElement = z.infer<typeof RowElementSchema>;

export const SectionElementSchemaBase = LayoutSchemaBase.extend({
  borderless: z.literal(true).optional(),
  collapsable: z.boolean().optional(),
  layoutType: z.literal('section'),
  nudges: NudgeElementSchema.array().optional(),
});
export type TSectionElementSchemaBase = Prettify<z.infer<typeof SectionElementSchemaBase>>;
export type N = TSectionElementSchemaBase['nudges'];

/**
 * Lazy Section Element Schema
 *
 * Defines a lazy section layout element that loads its content dynamically from a URL.
 * The content is fetched at runtime and then rendered as a regular section.
 * Lazy sections are useful for loading dynamic content or reducing initial bundle size.
 *
 * @example
 * // Lazy section that loads content from an API
 * const dynamicContactSection: TLazySectionElement = {
 *   type: 'layout',
 *   layoutType: 'section',
 *   sectionType: 'lazy',
 *   title: 'Contact Information',
 *   id: 'dynamicContactSection',
 *   url: 'https://api.example.com/forms/contact-fields',
 *   collapsable: true
 * };
 */
export const LazySectionElementSchema = SectionElementSchemaBase.extend({
  layoutType: z.literal('section'),
  processor: z
    .string()
    .refine(
      data => data.startsWith(`${LazySectionProcessorPrefix.value}_`),
      "Lazy section processor name should start with 'lazySection_'"
    )
    .optional()
    .describe('Optional custom functionID to process get section data'),
  sectionType: z.literal('lazy'),
  url: z.string().url(),
});
export type TLazySectionElement = Prettify<z.infer<typeof LazySectionElementSchema>>;

/**
 * Component Section Element Schema
 *
 * Defines a component section layout element that renders a custom component by ID.
 * Component sections allow integration of custom React components within the dynamic form structure.
 * The componentId references a registered component in the form's component registry.
 *
 * @example
 * // Component section that renders a custom verification widget
 * const verificationComponent: TComponentSectionElement = {
 *   type: 'layout',
 *   layoutType: 'section',
 *   sectionType: 'component',
 *   title: 'Identity Verification',
 *   id: 'verificationSection',
 *   componentId: 'BeneficiaryVerification',
 *   collapsable: false
 * };
 */
export const ComponentSectionElementSchema = SectionElementSchemaBase.extend({
  componentId: z.string(),
  layoutType: z.literal('section'),
  sectionType: z.literal('component'),
});
export type TComponentSectionElement = Prettify<z.infer<typeof ComponentSectionElementSchema>>;

/**
 * Section Element Schema
 *
 * Defines a section layout element that groups related rows together.
 * Sections can be collapsable and contain multiple rows or object lists.
 *
 * @example
 * // Basic section with a title and rows
 * const contactSection: TSectionElement = {
 *   type: 'layout',
 *   layoutType: 'section',
 *   sectionType: 'static',
 *   title: 'Contact Information',
 *   id: 'contactSection',
 *   items: [
 *     // Row elements...
 *   ]
 * };
 *
 * @example
 * // Collapsable section
 * const additionalInfoSection: TSectionElement = {
 *   type: 'layout',
 *   layoutType: 'section',
 *   title: 'Additional Information',
 *   subtitle: 'Optional details',
 *   id: 'additionalInfoSection',
 *   collapsable: true,
 *   items: [
 *     // Row elements...
 *   ]
 * };
 */
export const StaticSectionElementSchema: ZodSchema<
  Omit<TElementBase, 'propertyPath'> &
    TSectionElementSchemaBase & {
      sectionType?: 'static';
      items: (TRowElement | TObjectListElement)[];
    }
> = SectionElementSchemaBase.extend({
  items: z.array(z.union([z.lazy(() => RowElementSchema), z.lazy(() => ObjectListElementSchema)])),
  layoutType: z.literal('section'),
  sectionType: z.literal('static').default('static'),
});
export type TStaticSectionElement = Prettify<z.infer<typeof StaticSectionElementSchema>>;

export const SectionElementSchema = z.union([
  StaticSectionElementSchema,
  LazySectionElementSchema,
  ComponentSectionElementSchema,
]);
export type TSectionElement = z.infer<typeof SectionElementSchema>;

/**
 * Step Element Schema
 *
 * Defines a step layout element that represents a page in a multi-step form.
 * Each step contains one or more sections.
 *
 * @example
 * // Basic form step
 * const personalInfoStep: TStepElement = {
 *   type: 'layout',
 *   layoutType: 'step',
 *   title: 'Personal Information',
 *   id: 'personalInfoStep',
 *   sections: [
 *     // Section elements...
 *   ]
 * };
 *
 * @example
 * // Step with multiple sections
 * const accountStep: TStepElement = {
 *   type: 'layout',
 *   layoutType: 'step',
 *   title: 'Account Setup',
 *   subtitle: 'Create your account credentials',
 *   id: 'accountStep',
 *   sections: [
 *     {
 *       type: 'layout',
 *       layoutType: 'section',
 *       title: 'Login Information',
 *       id: 'loginSection',
 *       items: []
 *     },
 *     {
 *       type: 'layout',
 *       layoutType: 'section',
 *       title: 'Security Questions',
 *       id: 'securitySection',
 *       items: []
 *     }
 *   ]
 * };
 */
export const StepElementSchema = LayoutSchemaBase.extend({
  layoutType: z.literal('step'),
  nudges: z.array(NudgeElementSchema).optional(),
  sections: z.array(SectionElementSchema).min(1, 'Atleast on Section in a Step'),
});
export type TStepElement = z.infer<typeof StepElementSchema>;

/**
 * Layout Element Schema
 *
 * A discriminated union of all layout element types: section, row, and step.
 * The 'layoutType' field is used to discriminate between different layout types.
 */
export const LayoutElementSchema: ZodSchema<TSectionElement | TRowElement | TStepElement> = z.union([
  StaticSectionElementSchema,
  RowElementSchema,
  StepElementSchema,
]);
export type TLayoutElement = z.infer<typeof LayoutElementSchema>;
