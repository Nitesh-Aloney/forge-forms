import type { TStaticSectionElement } from '@/schemas/form-entites/layout';
import type { TLazySectionProcessorFunctionSignature } from '@/types';

export const lazySection_extractIntendedUseOfAccount: TLazySectionProcessorFunctionSignature = <D>(data: D) =>
  data as TStaticSectionElement;
