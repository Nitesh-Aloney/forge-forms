import useSWRImmutable from 'swr/immutable';
import { get } from '@/utils/api/fetchers';
import type { TFormElement } from '../schemas/form-entites/form';

export const useGetFormSchema = (url?: string) => {
  const { data, error, isLoading } = useSWRImmutable<TFormElement>(url, get);

  return {
    fetchFormSchemaError: error,
    fetchingFormSchema: isLoading,
    formSchema: data,
  };
};
