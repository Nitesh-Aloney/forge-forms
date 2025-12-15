import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { type FC, memo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ISO_DATE_PATTERN } from '@/constants';
import { useFormField } from '@/hooks/useFormField';
import { useValidations } from '@/hooks/useValidations';
import { dayJS } from '@/integrations/dayjs';
import type { TDateField } from '@/schemas/form-entites/form-fields';
import type { BaseRendererProps } from '@/types';
import { constructPropertyPath } from '@/utils';
import { evaluateDateExpression, formatDayJSDate } from '@/utils/date';
import FieldLabel from './FieldLabel';

interface TDateFieldProps extends BaseRendererProps {
  schema: TDateField;
}

/**
 * Date Renderer Component
 *
 * Renders a date picker field for selecting dates.
 * Integrated with react-hook-form for form state management
 */
const DateField: FC<TDateFieldProps> = ({ schema, path }) => {
  const { placeholder, helperText } = schema;
  const effectivePropertyPath = constructPropertyPath(schema.propertyPath, path);
  const { required, hide, disable } = useFormField();
  const { control } = useFormContext();
  const { isValid } = useValidations(schema.validations || [], effectivePropertyPath);
  const [open, setOpen] = useState(false);

  if (hide) return null;

  return (
    <Controller
      control={control}
      name={effectivePropertyPath}
      render={({ field, fieldState: { error } }) => {
        const maxDate = schema.max ? evaluateDateExpression(schema.max) : undefined;
        const minDate = schema.min ? evaluateDateExpression(schema.min) : undefined;

        return (
          <DatePicker
            defaultValue={field.value ? dayJS(field.value) : undefined}
            disabled={field.disabled || disable}
            disableFuture={schema.onlyPast}
            disablePast={schema.onlyFuture}
            format={schema?.dateFormat || ISO_DATE_PATTERN}
            label={<FieldLabel label={schema.title} required={required} />}
            maxDate={maxDate ?? undefined}
            minDate={minDate ?? undefined}
            onChange={date => {
              if (date?.isValid()) {
                field.onChange(formatDayJSDate(date, schema?.dateFormat || ISO_DATE_PATTERN));
              } else field.onChange(null);
            }}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            slotProps={{
              textField: {
                disabled: field.disabled || open,
                error: !!error,
                fullWidth: true,
                helperText: error ? error.message : helperText,
                name: effectivePropertyPath,
                onBlur: field.onBlur,
                onClick: () => setOpen(true),
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

export default memo(DateField);
