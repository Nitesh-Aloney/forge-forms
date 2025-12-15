import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import type { TElementBase } from '@/schemas/form-entites/element-base';
import useConditions from './useConditions';
import { useFieldResolvers } from './useFieldResolvers';

export function useDisable(disableSchema: TElementBase['disable'], path: string): boolean {
  const { evaluate, extractDependencies } = useConditions(path);
  const { resolvePaths } = useFieldResolvers();

  const toBeWatchedPaths = useMemo(() => {
    if (typeof disableSchema !== 'object') return [];

    const dependencyFields = extractDependencies(disableSchema);
    return resolvePaths(dependencyFields, path);
  }, [extractDependencies, resolvePaths, path, disableSchema]);

  const disable = useWatch({
    compute: () => {
      if (typeof disableSchema !== 'object') return !!disableSchema;
      return evaluate(disableSchema);
    },
    disabled: !toBeWatchedPaths?.length,
    exact: true,
    name: toBeWatchedPaths,
  });

  if (typeof disableSchema === 'boolean' || typeof disableSchema === 'undefined') return !!disableSchema;

  return disable;
}
