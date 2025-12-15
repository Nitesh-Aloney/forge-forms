import { Box, Stack } from '@mui/material';
import { type FC, memo } from 'react';
import { useHide } from '@/hooks/useHide';
import type { TRowElement } from '@/schemas/form-entites/layout';
import type { BaseRendererProps } from '@/types';
import FormField from './FormField';
import { Nudges } from './Nudge';

export type TRowProps = BaseRendererProps & {
  schema: TRowElement;
};

/**
 * Row Renderer Component
 *
 * Renders a row layout element containing form fields arranged horizontally.
 * Supports custom width specifications for each item.
 */
const Row: FC<TRowProps> = ({ schema, path }) => {
  const isHidden = useHide(schema.hide, path ?? '');

  if (isHidden) return null;

  // Calculate the total units of width and create widths array if not provided
  const widths = schema.widths || schema.items.map(() => 1);

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {schema.nudges?.length && <Nudges nudges={schema.nudges} />}

      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: { md: widths.map(width => `${width}fr`).join(' '), sm: '1fr' },
          width: '100%',
        }}
      >
        {schema.items.map(item => (
          <Box key={item.id} sx={{ mb: { md: 0, xs: 0.5 }, minWidth: 0 }}>
            <FormField path={path} schema={item} />
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

export default memo(Row);
