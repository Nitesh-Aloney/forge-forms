import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';
import { type FC, memo, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useFormField } from '@/hooks/useFormField';
import { useValidations } from '@/hooks/useValidations';
import type { TRadioBinaryField } from '@/schemas/form-entites/form-fields';
import type { BaseRendererProps } from '@/types';
import { constructPropertyPath } from '@/utils';
import FieldTitle from './FieldTitle';

interface TRadioBinaryComponentProps extends BaseRendererProps {
  schema: TRadioBinaryField;
}

/**
 * Binary Radio Renderer Component
 *
 * Renders a group of radio buttons for single selection.
 */
const RadioBinaryComponent: FC<TRadioBinaryComponentProps> = ({ schema, path }) => {
  const effectivePropertyPath = constructPropertyPath(schema.propertyPath, path);
  const { required, hide, disable } = useFormField();
  const { control } = useFormContext();
  const { isValid } = useValidations(schema.validations || [], effectivePropertyPath);

  const optionItems = useMemo(() => {
    return [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ];
  }, []);

  if (hide) return null;

  return (
    <Controller
      control={control}
      defaultValue={schema.defaultValue}
      name={effectivePropertyPath}
      render={({ field, fieldState: { error } }) => {
        const helperText = error ? error.message : schema.helperText;
        return (
          <FormControl component="fieldset" error={!!error} fullWidth>
            <FormLabel component="legend">
              <FieldTitle required={required} subtitle={schema.subtitle} title={schema.title} />
            </FormLabel>
            <RadioGroup
              name={effectivePropertyPath}
              onChange={(_, value) => {
                field.onChange(value === 'true');
              }}
              row
              value={field.value}
            >
              {optionItems.map(option => {
                return (
                  <FormControlLabel
                    control={<Radio disabled={field.disabled || disable} id={`${field.name}-${option.value}`} size="small" />}
                    key={`${option.label}-${option.value}`}
                    label={option.label}
                    value={option.value}
                  />
                );
              })}
            </RadioGroup>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );
      }}
      rules={{
        validate: (value, formValues) => {
          if (required && (typeof value === 'undefined' || value === null)) return `${schema.title} is required`;
          return !schema.validations?.length ? true : isValid(value, formValues);
        },
      }}
      shouldUnregister={hide}
    />
  );
};

export default memo(RadioBinaryComponent);
