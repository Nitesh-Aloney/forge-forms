import { z } from 'zod';

/**
 * Keyword used for reference data from context provided.
 *
 * This constant is used to indicate when a form element is referencing context variables,
 * which can be useful for customizing form schemas
 *
 * @example
 * // say context is {env: "qa"}
 * const env = "getValues({{__context__.env}})";
 * //env will have value of "qa"
 *
 */
export const CONTEXT_REFERENCE = z.literal('__context__');
export type TCONTEXT_REFERENCE = z.infer<typeof CONTEXT_REFERENCE>;

/**
 * Keyword used for self-referencing within dynamic forms.
 *
 * This constant is used to indicate when a form element is referencing itself,
 * which can be useful in recursive scenarios or when creating relationships
 * between form elements.
 *
 * @example
 * // say current field's value stored is "John"
 * const value = getValues("{{__self__}}");
 * // value will store "John"
 *
 */
export const SELF_REFERENCE = z.literal('__self__');
export type TSELF_REFERENCE = z.infer<typeof SELF_REFERENCE>;

/**
 * Keyword used for maintaining declarations state within dynamic forms.
 */
export const DECLARATION_REFERENCE = z.literal('__declaration__');
export type TDECLARATION_REFERENCE = z.infer<typeof DECLARATION_REFERENCE>;

export const OBJECT_LIST_CURR_ENTRY = z.literal('__olCurrEntry__');
export type TOBJECT_LIST_CURR_ENTRY = z.infer<typeof OBJECT_LIST_CURR_ENTRY>;

/**
 * Not implemented
 */
export const OBJECT_LIST_ANY_ENTRY = z.literal('__olAnyEntry__');
export type TOBJECT_LIST_ANY_ENTRY = z.infer<typeof OBJECT_LIST_ANY_ENTRY>;
