import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { type FC, memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useFormField } from '@/hooks/useFormField';
import useOptions from '@/hooks/useOptions';
import { useValidations } from '@/hooks/useValidations';
import type { TSelectField } from '@/schemas/form-entites/form-fields';
import type { BaseRendererProps } from '@/types';
import { constructPropertyPath } from '@/utils';
import FieldLabel from './FieldLabel';
import OptionsLoader from './OptionsLoader';

interface TSelectProps extends BaseRendererProps {
  schema: TSelectField;
}

/**
 * Select Renderer Component
 *
 * Renders a dropdown select field for single or multiple selections.
 * Integrated with react-hook-form for form state management
 */
const SelectComponent: FC<TSelectProps> = ({ schema, path }) => {
  const { title, helperText, options } = schema;
  const effectivePropertyPath = constructPropertyPath(schema.propertyPath, path);
  const { required, hide, disable } = useFormField();
  const { control } = useFormContext();
  const { isValid } = useValidations(schema.validations || [], effectivePropertyPath);

  const { options: optionItems, loading, error: optionsError } = useOptions(options, effectivePropertyPath, !(hide || disable));

  if (hide) return null;

  return (
    <Controller
      control={control}
      defaultValue={schema.defaultValue}
      name={effectivePropertyPath}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormControl error={!!error || !!optionsError} fullWidth size="small">
            <InputLabel id={field.name}>
              <FieldLabel label={title} required={required} />
            </InputLabel>
            <Select
              disabled={field.disabled || loading || disable}
              id={field.name}
              label={<FieldLabel label={title} required={required} />}
              labelId={field.name}
              multiple={schema.multiple ?? false}
              name={field.name}
              onBlur={field.onBlur}
              onChange={({ target }) => field.onChange(target.value)}
              value={field.value || (schema.multiple ? [] : '')}
            >
              {loading ? (
                <OptionsLoader />
              ) : (
                optionItems.map(option => {
                  const valueStr = String(option.value);
                  return (
                    <MenuItem key={`${option.label}-${option.value}`} value={valueStr}>
                      {option.label}
                    </MenuItem>
                  );
                })
              )}
            </Select>

            {(error || helperText || optionsError) && (
              <FormHelperText>{error ? error.message : optionsError ? 'Error loading options' : helperText}</FormHelperText>
            )}
          </FormControl>
        );
      }}
      rules={{
        required: required && `${schema.title} is required`,
        validate: (value, formValues) => (!schema.validations?.length ? true : isValid(value, formValues)),
      }}
      shouldUnregister={hide}
    />
  );
};

export default memo(SelectComponent);
