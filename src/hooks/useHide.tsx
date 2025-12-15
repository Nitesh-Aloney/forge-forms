import { useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { TElementBase } from '@/schemas/form-entites/element-base';
import useConditions from './useConditions';
import { useFieldResolvers } from './useFieldResolvers';

export function useHide(hideSchema: TElementBase['hide'], path: string): boolean {
  const { evaluate, extractDependencies } = useConditions(path);
  const { resolvePaths } = useFieldResolvers();
  const { setValue, unregister } = useFormContext();

  const toBeWatchedPaths = useMemo(() => {
    if (typeof hideSchema !== 'object') return [];
    const dependencyFields = extractDependencies(hideSchema);
    return resolvePaths(dependencyFields, path);
  }, [extractDependencies, resolvePaths, path, hideSchema]);

  const hide = useWatch({
    compute: () => {
      if (typeof hideSchema !== 'object') return !!hideSchema;
      return evaluate(hideSchema);
    },
    disabled: !toBeWatchedPaths?.length,
    exact: true,
    name: toBeWatchedPaths,
  });

  const isHidden = typeof hideSchema === 'boolean' || typeof hideSchema === 'undefined' ? !!hideSchema : hide;

  useEffect(() => {
    if (!isHidden || !path) return;
    unregister(path);
    setValue(path, undefined);
  }, [path, isHidden, unregister, setValue]);

  return typeof hideSchema === 'boolean' || typeof hideSchema === 'undefined' ? !!hideSchema : hide;
}
