import { useCallback, useState } from 'react';

export type TFieldToLocationMapping = Record<string, { step: string; section: string; fieldName: string; sectionName: string }>;

/**
 * Hook for managing field-to-location mapping in dynamic forms
 *
 * This hook tracks which fields belong to which step and section,
 * which is useful for validation, navigation, and form state management.
 */
export function useFieldMapping() {
  const [fieldToLocationMapping, setFieldToLocationMapping] = useState<TFieldToLocationMapping>({});

  const addFieldMapping = useCallback(
    (fieldName: string, location: TFieldToLocationMapping[string]) =>
      setFieldToLocationMapping(prev => ({ ...prev, [fieldName]: location })),
    []
  );

  const removeFieldMappings = useCallback(
    (prefix: string) =>
      setFieldToLocationMapping(prev => Object.fromEntries(Object.entries(prev).filter(([key]) => !key.startsWith(prefix)))),
    []
  );

  return {
    addFieldMapping,
    fieldMappings: fieldToLocationMapping,
    removeFieldMappings,
  };
}
