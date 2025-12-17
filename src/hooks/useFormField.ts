import { createContext, use } from 'react';
import FormsForgeWebError from '@/schemas/errors/ForgeFormsWebError';

export type TFormFieldContext = {
  required: boolean;
  hide: boolean;
  disable: boolean;
};
export const FormFieldContext = createContext<TFormFieldContext | null>(null);

export function useFormField() {
  const context = use(FormFieldContext);
  if (!context) throw new FormsForgeWebError({ message: 'useFormField must be used within a FormFieldProvider' });

  return context;
}
