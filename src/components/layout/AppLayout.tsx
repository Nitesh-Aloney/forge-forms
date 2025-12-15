import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { FC, PropsWithChildren } from 'react';
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary';
import useScrollHashIntoView from '@/hooks/useScrollHashIntoView';
import ThemeProvider from './ThemeProvider';

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  useScrollHashIntoView();
  return (
    <Box>
      <ErrorBoundary>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider>{children}</ThemeProvider>
        </LocalizationProvider>
      </ErrorBoundary>
    </Box>
  );
};

export default AppLayout;
