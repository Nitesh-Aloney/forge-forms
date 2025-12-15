import { Alert, Stack } from '@mui/material';
import type { FC } from 'react';
import type { TNudgeElement } from '@/schemas/form-entites/nudge';
import type { BaseRendererProps } from '@/types';

interface TNudgeProps extends BaseRendererProps {
  schema: TNudgeElement;
}

const Nudge: FC<TNudgeProps> = ({ schema }) => {
  return <Alert severity={schema.level}>{schema.message}</Alert>;
};

export const Nudges: FC<{ nudges: TNudgeElement[] }> = ({ nudges }) => {
  return (
    <Stack spacing={1}>
      {nudges.map(nudge => (
        <Nudge key={nudge.id} schema={nudge} />
      ))}
    </Stack>
  );
};

export default Nudge;
