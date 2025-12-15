import { Link } from '@mui/material';
import type { FC } from 'react';

const FieldErrors: FC<{ onClick?: () => void; fieldName: string; messages: string[] }> = ({ onClick, fieldName, messages }) => {
  return (
    <li>
      <Link
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          textDecoration: 'underline',
          ...(!onClick && { color: 'inherit', cursor: 'default', fontWeight: 600, textDecoration: 'none' }),
        }}
      >
        {fieldName}
      </Link>
      <ol>
        {messages.map(msg => (
          <li key={msg}>{msg}</li>
        ))}
      </ol>
    </li>
  );
};

export default FieldErrors;
