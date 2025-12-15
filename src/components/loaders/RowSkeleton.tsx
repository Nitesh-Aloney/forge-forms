import { Box, Skeleton } from '@mui/material';
import { type FC, useMemo } from 'react';

type Props = {
  noOfFields: number;
};

const RowSkeleton: FC<Props> = ({ noOfFields }) => {
  const fields = useMemo(() => Array.from({ length: noOfFields }).map(_ => crypto.randomUUID()), [noOfFields]);

  return (
    <Box sx={{ columnGap: 2, display: 'grid', gridTemplateColumns: `repeat(${noOfFields}, 1fr)` }}>
      {fields.map(f => (
        <Box key={f} sx={{ borderRadius: 4 }}>
          <Skeleton height={40} variant="rounded" />
        </Box>
      ))}
    </Box>
  );
};

export default RowSkeleton;
