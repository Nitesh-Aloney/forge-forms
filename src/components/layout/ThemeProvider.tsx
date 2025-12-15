import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';
import { theme } from '@/styles/mui/theme';

const muiTheme = theme();

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => (
  <MuiThemeProvider theme={muiTheme}>
    <CssBaseline />
    {children}
  </MuiThemeProvider>
);

export default ThemeProvider;
