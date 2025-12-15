import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import useSWR from 'swr';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { OptionItemSchema, type TOptionItem, type TOptions } from '@/schemas/form-entites/option';
import type { TOptionProcessorFunctionSignature } from '@/types';
import { extractFieldReferencePaths } from '@/utils';
import { get } from '@/utils/api/fetchers';
import { useFieldResolvers } from './useFieldResolvers';
import { useProcessors } from './useFormIntegrations';

export const sanitize = (options?: unknown): TOptionItem[] => {
  if (!OptionItemSchema.array().safeParse(options).success) return [];
  return options as TOptionItem[];
};

export interface UseOptionsResult {
  options: TOptionItem[];
  loading: boolean;
  error: Error | null;
}

/**
 * useOptions
 * Resolves a static or dynamic options schema into runtime options.
 * Dynamic schemas are fetched (with validation) using SWR.
 *
 * @param optionsSchema TOptions schema (static | dynamic)
 */
function useOptions(optionsSchema: TOptions, path: string, shouldCall: boolean): UseOptionsResult {
  const { getValues } = useFormContext();
  const { resolvePath } = useFieldResolvers();

  /**
   * Map of resolved field paths to raw field reference paths
   */
  const resolvedToRawPathMapping = useMemo(() => {
    const result = new Map<string, string>();

    if (optionsSchema.type !== 'dynamic') return result;

    const rawPaths = extractFieldReferencePaths(optionsSchema.url);
    for (const rawPath of rawPaths) result.set(resolvePath(rawPath, path), rawPath);

    return result;
  }, [optionsSchema, path, resolvePath]);

  const watchPaths = useMemo(() => Array.from(resolvedToRawPathMapping.keys()), [resolvedToRawPathMapping]);

  const processedUrl = useWatch({
    compute: () => {
      if (optionsSchema.type !== 'dynamic') return undefined;
      let finalUrl = optionsSchema.url;
      for (const watchPath of watchPaths) {
        const rawPath = resolvedToRawPathMapping.get(watchPath) ?? '';
        const fieldValue = getValues(watchPath) ?? '';
        finalUrl = finalUrl.replace(`{{${rawPath}}}`, fieldValue);
      }
      return finalUrl;
    },
    disabled: !shouldCall || !watchPaths?.length,
    exact: true,
    name: watchPaths,
  });

  const finalUrl = useDebouncedValue(processedUrl);
  const { data, error, isValidating, isLoading } = useSWR<unknown>(shouldCall ? finalUrl : undefined, get, {
    revalidateOnFocus: false,
  });

  const processor = useProcessors(optionsSchema.type === 'dynamic' ? (optionsSchema.processor ?? '') : '');

  const processedOptions = useMemo(() => {
    try {
      if (!data || optionsSchema.type === 'static') return [];
      if (!processor) return data as TOptionItem[];
      return (processor as TOptionProcessorFunctionSignature)(data);
    } catch (error) {
      console.error('Error processing options:', error);
      return [];
    }
  }, [processor, data, optionsSchema.type]);

  if (optionsSchema.type === 'static') {
    // For static options, just use the items directly
    return {
      error: null,
      loading: false,
      options: sanitize(optionsSchema.items),
    };
  }

  return {
    error: error ?? null,
    loading: isValidating || isLoading,
    options: sanitize(processedOptions),
  };
}

export default useOptions;
