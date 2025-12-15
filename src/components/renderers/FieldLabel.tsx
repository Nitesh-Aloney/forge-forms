import { Typography } from '@mui/material';
import type { FC } from 'react';

const FieldLabel: FC<{ label: string; required?: boolean }> = ({ label, required }) => {
  return (
    <Typography variant="body1">
      {label}
      {required && (
        <Typography color="error" component="span">
          &nbsp;*
        </Typography>
      )}
    </Typography>
  );
};

export default FieldLabel;
