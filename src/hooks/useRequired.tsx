import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import type { TElementBase } from '@/schemas/form-entites/element-base';
import useConditions from './useConditions';
import { useFieldResolvers } from './useFieldResolvers';

export function useRequired(requiredSchema: TElementBase['required'], path: string): boolean {
  const { evaluate, extractDependencies } = useConditions(path);
  const { resolvePaths } = useFieldResolvers();

  const toBeWatchedPaths = useMemo(() => {
    if (typeof requiredSchema !== 'object') return [];

    const dependencyFields = extractDependencies(requiredSchema);
    return resolvePaths(dependencyFields, path);
  }, [extractDependencies, resolvePaths, path, requiredSchema]);

  const required = useWatch({
    compute: () => {
      if (typeof requiredSchema !== 'object') return !!requiredSchema;
      return evaluate(requiredSchema);
    },
    disabled: !toBeWatchedPaths?.length,
    exact: true,
    name: toBeWatchedPaths,
  });

  if (typeof requiredSchema === 'boolean' || typeof requiredSchema === 'undefined' || requiredSchema === null)
    return !!requiredSchema;

  return required;
}
