import type { TFileSize } from '../schemas/form-entites/form-fields';

/**
 * Regular expression to match field reference syntax.
 *
 * This pattern matches strings that are wrapped in double curly braces like `{{fieldName}}`.
 * It captures the content between the braces for extraction.
 *
 * @example
 * const fieldRef = "{{user.name}}";
 * const isFieldRef = FIELD_REFERENCE_REGEX.test(fieldRef); // true
 * const match = fieldRef.match(FIELD_REFERENCE_REGEX);
 * if (match) {
 *   const fieldPath = match[1]; // "user.name"
 * }
 */
export const FIELD_REFERENCE_REGEX = /{{(.+?)}}/;

export const ISO_DATE_PATTERN = 'YYYY-MM-DD';

export const DEFAULT_FILE_SIZE: TFileSize = { unit: 'MB', value: 5 };
