import { useCallback, useState } from 'react';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';
import type { FileIDFileNameTuple } from '../types';
import { usePlugins } from './useFormIntegrations';

interface UseFileUploadState {
  loading: boolean;
  error: Error | null;
  data: FileIDFileNameTuple[];
}

export function useFileUpload(field: ControllerRenderProps<FieldValues>) {
  const { file: filePlugins } = usePlugins();

  const [state, setState] = useState<UseFileUploadState>(() => {
    if (Array.isArray(field.value) && field.value.length > 0) {
      const existingData: FileIDFileNameTuple[] = field.value.map((fileId: string) => [
        fileId,
        `File ${fileId.slice(0, 8)}...`,
      ]);
      return {
        data: existingData,
        error: null,
        loading: false,
      };
    }

    return {
      data: [],
      error: null,
      loading: false,
    };
  });

  const upload = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;

      setState(prev => ({ ...prev, error: null, loading: true }));
      if (!filePlugins) return;
      filePlugins
        .upload(fileList)
        .then(data => {
          setState(prev => ({ ...prev, data, loading: false }));
          field.onChange(data.map(([id]) => id));
          filePlugins.onSuccess?.(data);
        })
        .catch(error => {
          const errorObj = error instanceof Error ? error : new Error('Unknown error occurred');
          setState(prev => ({ ...prev, error: errorObj, loading: false }));
          filePlugins.onError?.(errorObj);
        });
    },
    [filePlugins?.upload, filePlugins?.onSuccess, filePlugins?.onError, field.onChange, filePlugins]
  );

  const reset = useCallback(() => setState({ data: [], error: null, loading: false }), []);

  const remove = useCallback(
    (fileId: string) => {
      setState(prev => ({ ...prev, data: prev.data.filter(([id]) => id !== fileId) }));
      field.onChange(field.value?.filter((id: string) => id !== fileId));
      filePlugins?.onDelete?.(fileId);
    },
    [filePlugins?.onDelete, field.onChange, field.value]
  );

  return {
    data: state.data,
    error: state.error,
    loading: state.loading,
    remove,
    reset,
    upload,
  };
}
