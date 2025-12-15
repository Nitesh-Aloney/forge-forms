import { Box, Button, Stack, Tooltip } from '@mui/material';
import { type FC, memo, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useFormIntegrations } from '@/hooks/useFormIntegrations';
import { useHide } from '@/hooks/useHide';
import { ObjectListContext } from '@/hooks/useObjectListContext';
import type { TObjectListElement } from '@/schemas/form-entites/object-list';
import type { BaseRendererProps } from '@/types';
import { constructPropertyPath } from '@/utils';
import FieldTitle from './FieldTitle';
import Layout from './Layout';

export type TObjectListProps = BaseRendererProps & {
  schema: TObjectListElement;
};

/**
 * ObjectList Renderer Component
 *
 * Renders a repeatable group of fields that allows users to add multiple entries
 * of the same structure. This is useful for collecting lists of similar items,
 * such as multiple addresses, contact information, or any other repeatable data.
 */
const ObjectList: FC<TObjectListProps> = ({ schema, path }) => {
  const { title, subtitle, min = 0, max } = schema;
  const effectivePropertyPath = constructPropertyPath(schema.propertyPath, path);
  const isHidden = useHide(schema.hide, path ?? '');
  const { control } = useFormContext();
  const { removeFieldMappings } = useFormIntegrations();
  const { fields, append, remove } = useFieldArray({
    control,
    name: effectivePropertyPath,
    rules: {
      ...(min && {
        minLength: {
          message: `Minimum ${min} items required`,
          value: min,
        },
      }),
      ...(max && {
        maxLength: {
          message: `Maximum ${max} items allowed`,
          value: max,
        },
      }),
    },
    shouldUnregister: isHidden,
  });

  const currentCount = fields.length;
  const canRemove = currentCount > min;
  const canAdd = max === undefined || currentCount < max;

  useEffect(() => {
    if (fields.length >= min) return;
    for (let i = 0; i < min; i++) append({});
  }, [fields.length, min, append]);

  if (isHidden) return null;

  return (
    <Stack sx={{ gap: 1, p: 0 }}>
      {title && <FieldTitle subtitle={subtitle} title={title} />}

      <Stack rowGap={2}>
        {fields.map((field, index) => {
          const fieldEffectivePropertyPath = constructPropertyPath(`${index}`, effectivePropertyPath);
          const removeItem = () => {
            if (!canRemove) return;
            removeFieldMappings(constructPropertyPath(`${fields.length - 1}`, effectivePropertyPath));
            remove(index);
          };
          return (
            <ObjectListContext key={field.id} value={{ itemIdx: index, prefix: effectivePropertyPath }}>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 2 }}>
                <Stack sx={{ width: '100%' }}>
                  {schema.items.map(item => (
                    <Box key={item.id} sx={{ flexGrow: 1 }}>
                      <Layout path={fieldEffectivePropertyPath} schema={item} />
                    </Box>
                  ))}
                </Stack>
                {canRemove ? (
                  <Tooltip title={`Minimum ${min} items required`}>
                    <Box component="span" onClick={removeItem} sx={{ cursor: 'pointer' }}>
                      <img alt="Remove item" src="/icons/bin-red-10.svg" />
                    </Box>
                  </Tooltip>
                ) : null}
              </Box>
            </ObjectListContext>
          );
        })}
      </Stack>

      {canAdd ? (
        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', gap: 1 }}>
          <Tooltip title={`Maximum ${max} items allowed`}>
            <Button onClick={() => append({})} size="small" variant="outlined">
              {schema.addLabel || 'Add'}
            </Button>
          </Tooltip>
        </Box>
      ) : null}
    </Stack>
  );
};

export default memo(ObjectList);
