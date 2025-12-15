import { TextField } from '@mui/material';
import { type FC, memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useFormField } from '@/hooks/useFormField';
import { useValidations } from '@/hooks/useValidations';
import type { TInputField } from '@/schemas/form-entites/form-fields';
import type { BaseRendererProps } from '@/types';
import { constructPropertyPath } from '@/utils';
import FieldLabel from './FieldLabel';

interface TInputProps extends BaseRendererProps {
  schema: TInputField;
}

/**
 * Input Renderer Component
 *
 * Renders an input field based on the schema configuration.
 * Supports different input types: text, email, password, url, number
 * Integrated with react-hook-form for form state management
 */
const Input: FC<TInputProps> = ({ schema, path }) => {
  const effectivePropertyPath = constructPropertyPath(schema.propertyPath, path);
  const multiline = schema.inputType === 'text' && schema.multiline;
  const { required, hide, disable } = useFormField();
  const { control } = useFormContext();
  const { isValid } = useValidations(schema.validations || [], effectivePropertyPath);

  if (hide) return null;

  return (
    <Controller
      control={control}
      defaultValue={schema.defaultValue}
      name={effectivePropertyPath}
      render={({ field, fieldState: { error } }) => (
        <TextField
          autoComplete="off"
          defaultValue={field.value}
          disabled={field.disabled || disable}
          error={!!error}
          fullWidth
          helperText={error ? error.message : schema.helperText}
          id={field.name}
          label={<FieldLabel label={schema.title} required={required} />}
          maxRows={multiline ? multiline : 1}
          multiline={!!multiline}
          name={field.name}
          onBlur={field.onBlur}
          onChange={e => {
            if (schema.inputType === 'number') field.onChange(Number(e.target.value));
            else field.onChange(e.target.value);
          }}
          placeholder={schema.placeholder}
          size="small"
          type={schema.inputType}
          variant="outlined"
        />
      )}
      rules={{
        required: required && `${schema.title} is required`,
        validate: (value, formValues) => (!schema.validations?.length ? true : isValid(value, formValues)),
      }}
      shouldUnregister={hide}
    />
  );
};

export default memo(Input);
