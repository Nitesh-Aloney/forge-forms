import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { OBJECT_LIST_CURR_ENTRY, SELF_REFERENCE } from '@/schemas/form-entites/special-keywords';
import type { TFormValue } from '@/types';
import { constructPropertyPath, extractFieldReference } from '@/utils';
import { useObjectListContext } from './useObjectListContext';

export function useFieldResolvers() {
  const { getValues } = useFormContext();
  const { prefix, itemIdx } = useObjectListContext();

  const resolvePath = useCallback(
    (rawPath: string, currAbsolutePath: string): string => {
      if (!rawPath) return rawPath;

      if (rawPath === SELF_REFERENCE.value) return currAbsolutePath;

      if (rawPath.startsWith(OBJECT_LIST_CURR_ENTRY.value)) {
        if (!prefix || typeof itemIdx === 'undefined') return '';
        const [, relativePath] = rawPath.split(`${OBJECT_LIST_CURR_ENTRY.value}.`);
        if (!relativePath) return '';
        const basePath = `${prefix}.${itemIdx}`;
        return constructPropertyPath(relativePath, basePath);
      }

      return rawPath;
    },
    [itemIdx, prefix]
  );

  const resolvePaths = useCallback(
    (rawPaths: string[], currAbsolutePath: string) => rawPaths.map(rw => resolvePath(rw, currAbsolutePath)),
    [resolvePath]
  );

  const resolveValues = useCallback(
    (value: TFormValue, currAbsolutePath: string): TFormValue => {
      if (typeof value === 'number' || typeof value === 'boolean') return value;
      if (Array.isArray(value)) return value.map(v => resolveValues(v, currAbsolutePath)) as TFormValue;

      const rawPath = extractFieldReference(value);
      if (!rawPath) return value;

      const fieldPath = resolvePath(rawPath, currAbsolutePath);
      return getValues(fieldPath);
    },
    [getValues, resolvePath]
  );

  return { resolvePath, resolvePaths, resolveValues };
}
