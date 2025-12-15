import { CircularProgress, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';
import { type FC, memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useFormField } from '@/hooks/useFormField';
import useOptions from '@/hooks/useOptions';
import { useValidations } from '@/hooks/useValidations';
import type { TRadioField } from '@/schemas/form-entites/form-fields';
import type { BaseRendererProps } from '@/types';
import { constructPropertyPath } from '@/utils';
import FieldTitle from './FieldTitle';
import OptionsLoader from './OptionsLoader';

interface TRadioProps extends BaseRendererProps {
  schema: TRadioField;
}

/**
 * Radio Renderer Component
 *
 * Renders a group of radio buttons for single selection.
 */
const RadioComponent: FC<TRadioProps> = ({ schema, path }) => {
  const { options } = schema;
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
        const helperText = error ? error.message : optionsError ? 'Error loading options' : schema.helperText;
        return (
          <FormControl component="fieldset" error={!!error || !!optionsError} fullWidth>
            <FormLabel component="legend">
              <FieldTitle required={required} subtitle={schema.subtitle} title={schema.title} />
              {loading && <CircularProgress size={16} sx={{ ml: 1 }} />}
            </FormLabel>
            <RadioGroup
              name={effectivePropertyPath}
              onChange={(_, value) => field.onChange(value)}
              row
              value={field.value ?? undefined}
            >
              {loading ? (
                <OptionsLoader />
              ) : (
                optionItems.map(option => (
                  <FormControlLabel
                    control={
                      <Radio
                        disabled={field.disabled || loading || disable}
                        id={`${field.name}-${option.value}`}
                        size="small"
                      />
                    }
                    key={`${option.label}-${option.value}`}
                    label={option.label}
                    value={option.value}
                  />
                ))
              )}
            </RadioGroup>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
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

export default memo(RadioComponent);
