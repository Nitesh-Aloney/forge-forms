import { Box, Skeleton } from '@mui/material';
import type { FC } from 'react';

const TitleSkeleton: FC = () => (
  <Box>
    <Skeleton height={40} variant="text" width="50%" />
    <Skeleton height={20} variant="text" width="70%" />
  </Box>
);

export default TitleSkeleton;
