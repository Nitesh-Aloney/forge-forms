import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import useSWRImmutable from 'swr/immutable';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { TLazySectionElement, TStaticSectionElement } from '@/schemas/form-entites/layout';
import { get } from '@/utils/api/fetchers';
import type { TLazySectionProcessorFunctionSignature } from '../types';
import { extractFieldReferencePaths } from '../utils';
import { useFieldResolvers } from './useFieldResolvers';
import { useProcessors } from './useFormIntegrations';

/**
 * Hook for fetching and transforming lazy section elements into static section elements.
 *
 * Takes a LazySectionElement with a URL and fetches the section items dynamically,
 * then returns a SectionElement with the loaded items.
 *
 * @param lazySectionElement - The lazy section element containing the URL to fetch from
 * @param path - Current form path for field resolution
 * @param shouldCall - Whether to make the API call
 * @returns static section with loading and error states
 */
export const useGetLazySectionElement = (lazySectionElement: TLazySectionElement, path = '', shouldCall = true) => {
  const { getValues } = useFormContext();
  const { resolvePath } = useFieldResolvers();

  /**
   * Map of resolved field paths to raw field reference paths
   */
  const resolvedToRawPathMapping = useMemo(() => {
    const result = new Map<string, string>();
    const rawPaths = extractFieldReferencePaths(lazySectionElement.url);

    for (const rawPath of rawPaths) {
      result.set(resolvePath(rawPath, path), rawPath);
    }

    return result;
  }, [lazySectionElement.url, path, resolvePath]);

  const watchPaths = useMemo(() => Array.from(resolvedToRawPathMapping.keys()), [resolvedToRawPathMapping]);

  const processedUrl = useWatch({
    compute: () => {
      let finalUrl = lazySectionElement.url;
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
  const { data, error, isLoading } = useSWRImmutable<unknown>(shouldCall ? finalUrl : undefined, get);

  const processor = useProcessors(lazySectionElement.processor ?? '');

  const processedSection = useMemo(() => {
    try {
      if (!data) return undefined;
      if (!processor) return data as TStaticSectionElement;
      return (processor as TLazySectionProcessorFunctionSignature)(data);
    } catch (error) {
      console.error('Error processing lazy section:', error);
      return undefined;
    }
  }, [processor, data]);

  return {
    error: error ?? null,
    isLoading,
    section: processedSection as TStaticSectionElement | undefined,
  };
};

export default useGetLazySectionElement;
