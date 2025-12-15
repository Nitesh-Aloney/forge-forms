import { CircularProgress, Typography } from '@mui/material';
import type { FC } from 'react';

type TOptionsLoaderProps = { text?: string };

const OptionsLoader: FC<TOptionsLoaderProps> = ({ text }) => {
  return (
    <Typography sx={{ alignItems: 'center', display: 'flex', gap: 1, justifyContent: 'center' }} variant="body2">
      <CircularProgress size={16} />
      {text || 'Loading options...'}
    </Typography>
  );
};

export default OptionsLoader;
