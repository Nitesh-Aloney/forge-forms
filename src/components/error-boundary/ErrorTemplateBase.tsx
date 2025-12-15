import { Box, Stack, Typography } from '@mui/material';
import type { FC, ReactNode } from 'react';

type TErrorTemplateBaseProps = {
  imgUrl?: string;
  error?: ReactNode;
  message?: string;
  subtitle?: string;
};

const ErrorTemplateBase: FC<TErrorTemplateBaseProps> = ({ imgUrl = '/images/error.svg', message, subtitle, error }) => {
  return (
    <Stack sx={{ alignItems: 'center', p: '2rem' }}>
      {/* icon */}
      <Box alt="Error symbol" component="img" src={imgUrl} />
      {/* error rendering */}
      {error}
      {!error && (
        <Typography fontWeight={500} variant="body1">
          {message || 'An unexpected error has occurred.'}
        </Typography>
      )}
      {/* subtitle error rendering */}
      {subtitle && <Typography variant="body2">{subtitle}</Typography>}
    </Stack>
  );
};

export default ErrorTemplateBase;
