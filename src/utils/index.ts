import { FIELD_REFERENCE_REGEX } from '../constants';
import type { TFieldToLocationMapping } from '../hooks/useFieldMapping';
import { SELF_REFERENCE } from '../schemas/form-entites/special-keywords';

/**
 * Constructs a property path by combining a base path with a schema path.
 *
 * @param schemaPath - The schema path to be appended to the base path
 * @param basePath - The base path to prepend to the schema path (default: '')
 * @returns The combined property path
 *
 * @example
 * // Returns "address.street.number"
 * constructPropertyPath("street.number", "address");
 *
 * @example
 * // Returns "properties"
 * constructPropertyPath("properties");
 */
export function constructPropertyPath(schemaPath: string, basePath = ''): string {
  return basePath ? `${basePath}.${schemaPath}` : schemaPath;
}

/**
 * Extracts field reference paths from a string.
 *
 * This function uses a regular expression defined by FIELD_REFERENCE_REGEX to find all matches
 * in the provided string. It extracts the path part from each match (captured in group 1)
 * and returns them as an array of strings.
 *
 * @param {string} str - The string to extract field reference paths from
 * @returns  An array of extracted field reference paths
 *
 * @example
 * extractFieldReferencePaths("Value is {{form.field1}} and {{form.field2}}");
 * // Returns ["form.field1", "form.field2"]
 */
export function extractFieldReferencePaths(str: string) {
  const regex = new RegExp(FIELD_REFERENCE_REGEX, 'g');
  const matches = [];

  let match = regex.exec(str);
  while (match !== null) {
    matches.push(match[1].trim());
    match = regex.exec(str);
  }

  return matches;
}

/**
 * Extracts a field reference from a string if it matches a specific pattern.
 *
 * @param maybeFieldReference - The string to check for a field reference pattern
 * @returns The extracted field reference string or null if no match is found
 *
 * @example
 * extractFieldReference("{{firstName}}") // returns "firstName"
 * extractFieldReference("regular text") // returns null
 */
export function extractFieldReference(maybeFieldReference: string) {
  const fieldRefMatch = maybeFieldReference.match(FIELD_REFERENCE_REGEX);
  if (!fieldRefMatch) return null;
  return fieldRefMatch[1];
}

export function extractFieldReferencesFromArray(arr: unknown[]) {
  const fieldReferencePaths = [];
  for (const item of arr) {
    if (typeof item !== 'string') continue;
    const extracted = extractFieldReference(item);
    if (extracted) fieldReferencePaths.push(extracted);
  }
  return fieldReferencePaths;
}

export function replaceSelfReferencesWithPath(path: string, fieldReferencePaths: string[]) {
  return fieldReferencePaths.map(ref => (ref === SELF_REFERENCE.value ? path : ref));
}

export const getFieldsForStep = (step: string, map: TFieldToLocationMapping): string[] => {
  const fields: string[] = [];

  for (const [fieldPath, location] of Object.entries(map)) {
    if (location.step === step) {
      fields.push(fieldPath);
    }
  }

  return fields;
};
