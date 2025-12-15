import '@mui/material/Tooltip';

declare module '@mui/material/Tooltip' {
  interface TooltipProps {
    variant?: 'rich' | 'plain';
  }
}
