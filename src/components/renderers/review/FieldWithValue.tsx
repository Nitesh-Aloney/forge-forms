import { Box, Stack, Typography } from '@mui/material';
import { type FC, useMemo } from 'react';

const FieldWithValue: FC<{ value: unknown; name: string }> = ({ value, name }) => {
  const sanitizedValue = useMemo(() => {
    if (typeof value === 'string') return value.length ? value : '';
    if (typeof value === 'number' || typeof value === 'boolean') return value.toString();
    if (Array.isArray(value)) return value.length ? value.join(', ') : '';
    return '';
  }, [value]);

  return (
    <Stack spacing={0.5}>
      <Box>
        <Typography fontWeight={600} variant="body2">
          {name || 'Not available'}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ wordBreak: 'break-all' }} variant="body2">
          {sanitizedValue}
        </Typography>
      </Box>
    </Stack>
  );
};

export default FieldWithValue;
