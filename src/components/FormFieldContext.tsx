import type { FC, PropsWithChildren } from 'react';
import { FormFieldContext, type TFormFieldContext } from '@/hooks/useFormField';

type TFormFieldProps = PropsWithChildren & TFormFieldContext;

const FormFieldProvider: FC<TFormFieldProps> = ({ children, ...rest }) => {
  return <FormFieldContext.Provider value={rest}>{children}</FormFieldContext.Provider>;
};

export default FormFieldProvider;
