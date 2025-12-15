import useSWRImmutable from 'swr/immutable';
import type { TFormElement } from '@/schemas/form-entites/form';
import { get } from '@/utils/api/fetchers';

export const useGetFormSchema = (url?: string) => {
  const { data, error, isLoading } = useSWRImmutable<TFormElement>(url, get);

  return {
    fetchFormSchemaError: error,
    fetchingFormSchema: isLoading,
    formSchema: data,
  };
};
