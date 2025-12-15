import { Box, Typography } from '@mui/material';
import type { FC } from 'react';

const FieldTitle: FC<{ title: string; subtitle?: string; required?: boolean }> = ({ title, subtitle, required }) => {
  return (
    <Box>
      <Typography fontWeight={600} variant="body1">
        {title}
        {required && (
          <Typography color="error" component="span">
            &nbsp;*
          </Typography>
        )}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" variant="subtitle1">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default FieldTitle;
