import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { type FC, memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useFormField } from '@/hooks/useFormField';
import { useValidations } from '@/hooks/useValidations';
import { dayJS } from '@/integrations/dayjs';
import type { TDateTimeField } from '@/schemas/form-entites/form-fields';
import type { BaseRendererProps } from '@/types';
import { constructPropertyPath } from '@/utils';
import { evaluateDateTimeExpression } from '@/utils/date-time';
import FieldLabel from './FieldLabel';

interface TDatetimeProps extends BaseRendererProps {
  schema: TDateTimeField;
}

/**
 * Datetime Renderer Component
 *
 * Renders a datetime picker field for selecting both date and time.
 */
const Datetime: FC<TDatetimeProps> = ({ schema, path }) => {
  const { placeholder, helperText } = schema;
  const effectivePropertyPath = constructPropertyPath(schema.propertyPath, path);
  const { required, hide, disable } = useFormField();
  const { control } = useFormContext();
  const { isValid } = useValidations(schema.validations || [], effectivePropertyPath);

  if (hide) return null;

  return (
    <Controller
      control={control}
      name={effectivePropertyPath}
      render={({ field, fieldState: { error } }) => {
        const maxDateTime = schema.max ? evaluateDateTimeExpression(schema.max) : undefined;
        const minDateTime = schema.min ? evaluateDateTimeExpression(schema.min) : undefined;

        return (
          <DateTimePicker
            defaultValue={dayJS(field.value)}
            disabled={field.disabled || disable}
            disableFuture={schema.onlyPast}
            disablePast={schema.onlyFuture}
            label={<FieldLabel label={schema.title} required={required} />}
            maxDateTime={maxDateTime ?? undefined}
            minDateTime={minDateTime ?? undefined}
            onChange={datetime => datetime && field.onChange(datetime?.toISOString())}
            slotProps={{
              textField: {
                error: !!error,
                fullWidth: true,
                helperText: error ? error.message : helperText,
                name: effectivePropertyPath,
                onBlur: field.onBlur,
                placeholder,
                size: 'small',
              },
            }}
          />
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

export default memo(Datetime);
