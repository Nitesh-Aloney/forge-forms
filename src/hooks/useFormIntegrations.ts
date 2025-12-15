import { createContext, type FC, type LazyExoticComponent, type ReactNode, use, useMemo } from 'react';
import type { FieldValues } from 'react-hook-form';
import ConfFormsWebError from '@/schemas/errors/ConfFormsWebError';
import type { TErrorDetails } from '@/schemas/errors/error-response';
import type { TFormElement } from '@/schemas/form-entites/form';
import type { TFileUploadField } from '@/schemas/form-entites/form-fields';
import type { TLazySectionProcessorPrefix } from '@/schemas/form-entites/layout';
import type { TOptionsProcessorPrefix } from '@/schemas/form-entites/option';
import type {
  FileIDFileNameTuple,
  TCustomFunctionSignature,
  THideButtonFunction,
  TLazySectionProcessorFunctionSignature,
  TOnNextFunction,
  TOnPrevFunction,
  TOnSaveFunction,
  TOnSubmitFunction,
  TOptionProcessorFunctionSignature,
  TStepperRendererProps,
  TStepperTitleRendererProps,
} from '@/types';
import type { useFieldMapping } from './useFieldMapping';
import type { useStepControls } from './useStepControls';

export type TFileUploadPlugin = {
  upload: (file: FileList, schema?: TFileUploadField) => Promise<FileIDFileNameTuple[]>;
  onSuccess?: (result: FileIDFileNameTuple[]) => Promise<void>;
  onError?: (error: Error) => Promise<void>;
  onDelete?: (fileId: string) => Promise<void>;
};

export type TCustomFunctionsMap = Record<string, TCustomFunctionSignature>;

export type TProcessorsMap = Prettify<
  Record<`${TOptionsProcessorPrefix}_${string}`, TOptionProcessorFunctionSignature> &
    Record<`${TLazySectionProcessorPrefix}_${string}`, TLazySectionProcessorFunctionSignature>
>;

export type TFormIntegrationsContext = {
  plugins: {
    file?: TFileUploadPlugin;
    customFunctions?: TCustomFunctionsMap;
    processors?: TProcessorsMap;
    components?: Record<string, LazyExoticComponent<FC>>;
    renderers?: {
      stepper?: LazyExoticComponent<FC<TStepperRendererProps>> | FC<TStepperRendererProps>;
      stepTitle?: LazyExoticComponent<FC<TStepperTitleRendererProps>> | FC<TStepperTitleRendererProps>;
    };
  };

  submitting?: boolean;
  submitErrors?: TErrorDetails[];
  saving?: boolean;
  saveFormError?: TErrorDetails[];
  successRenderer?: ReactNode;
  onSubmit: TOnSubmitFunction;
  onNext?: TOnNextFunction;
  onPrev?: TOnPrevFunction;
  onSave?: TOnSaveFunction;

  schema: TFormElement;
  initialData?: FieldValues;
  initialStep?: number;
  context?: FieldValues;
  renderWithFormTag?: boolean;

  // Hide button functions
  hideNext?: THideButtonFunction;
  hidePrev?: THideButtonFunction;
  hideSave?: THideButtonFunction;
} & ReturnType<typeof useFieldMapping> &
  ReturnType<typeof useStepControls>;

export const FormIntegrationsContext = createContext<TFormIntegrationsContext | null>(null);

export function useFormIntegrations() {
  const context = use(FormIntegrationsContext);
  if (!context)
    throw new ConfFormsWebError({ message: 'useFormIntegrations must be used within a FormIntegrationsContextProvider' });

  return context;
}

export function usePlugins() {
  const context = useFormIntegrations();
  return context.plugins;
}

export const useProcessors = (name: string) => {
  const plugins = usePlugins();
  return plugins.processors?.[name as keyof typeof plugins.processors] ?? null;
};

export const useComponent = (componentId: string) => {
  const plugins = usePlugins();
  return useMemo(() => plugins.components?.[componentId] ?? null, [plugins.components, componentId]);
};

export const useRenderer = (type: 'stepper' | 'stepTitle') => {
  const plugins = usePlugins();
  return useMemo(() => plugins.renderers?.[type] ?? null, [plugins.renderers, type]);
};
