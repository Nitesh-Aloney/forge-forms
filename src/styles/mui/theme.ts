import type { PaletteOptions } from '@mui/material';
import { createTheme } from '@mui/material';
import { colors } from '@/styles/colors';

/**
 * Material UI theme with NIUM Brand standards
 */
export const theme = (mode: PaletteOptions['mode'] = 'light') => {
  return createTheme({
    breakpoints: {
      values: {
        lg: 1008,
        md: 640,
        sm: 390,
        xl: 1280,
        xs: 0,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.gray[10],
            borderBottom: `2px solid ${colors['ink-blue'][30]}`,
            boxShadow: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: ({ ownerState }) => {
            const borderRadius = '24px';
            let padding = '6px 20px';
            let fontSize = '14px';

            if (ownerState.size === 'small') {
              padding = '2px 12px';
              fontSize = '12px';
            }
            if (ownerState.size === 'large') {
              padding = '8px 20px';
              fontSize = '16px';
            }

            return {
              borderRadius,
              fontSize,
              padding,
              textTransform: 'inherit',
              ...(ownerState.color === 'primary' &&
                ownerState.variant === 'contained' && {
                  '&:hover': { backgroundColor: colors['dark-blue'][50] },
                }),
              ...(ownerState.disabled && {
                '&:disabled': {
                  ...(ownerState.variant === 'contained' && {
                    backgroundColor: colors.gray[40],
                  }),
                  color: colors.gray[60],
                  ...(ownerState.variant === 'outlined' && {
                    borderColor: colors.gray[60],
                  }),
                },
              }),
            };
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: ({ ownerState }) => {
            return {
              ...(ownerState.disabled && { color: colors.gray[60] }),
            };
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: () => ({
            border: `1px solid ${colors['dark-blue'][70]}`,
            borderRadius: '24px',
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.1)',
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '0.5rem',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colors['dark-blue'][10],
            border: 0,
          },
        },
      },
      MuiPaginationItem: {
        styleOverrides: {
          root: ({ ownerState }) => {
            return {
              borderColor: colors.gray[50],
              ...(ownerState.variant === 'outlined' &&
                ownerState.shape === 'rounded' && {
                  '&.Mui-selected': {
                    backgroundColor: colors['dark-blue'][70],
                    color: colors.gray[10],
                  },
                  borderRadius: 0,
                  marginInline: 0,
                }),
              ...(['first', 'last', 'next', 'previous'].includes(ownerState.type ?? '') && { border: 'none' }),
            };
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: ({ ownerState }) => {
            return {
              '& > .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': {
                ...(ownerState.color === 'primary' && {
                  backgroundColor: colors.gray[50],
                }),
              },
              '& > .MuiSwitch-switchBase+.MuiSwitch-track': {
                ...(ownerState.color === 'primary' && {
                  backgroundColor: colors.gray[50],
                }),
              },
            };
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            backgroundColor: ownerState.selected ? colors['dark-blue'][30] : colors['dark-blue'][10],
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            minHeight: 'auto',
            paddingBlock: '8px',
            textTransform: 'none',
          }),
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            border: `1px solid ${colors.gray[40]}`,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: colors['dark-blue'][10],
            borderBottom: `2px solid ${colors.gray[60]}`,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${colors.gray[40]}`,
            textAlign: 'center',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 'auto',
          },
        },
      },
      MuiTooltip: {
        defaultProps: {
          variant: 'plain',
        },
        styleOverrides: {
          arrow: ({ ownerState }) => {
            if (ownerState.variant === 'rich') return { color: colors['dark-blue'][30] };
            return { color: colors.gray[70] };
          },
          tooltip: ({ ownerState }) => {
            const commonProps = { borderStyle: 'solid', borderWidth: '1px', lineHeight: '1rem' };
            if (ownerState.variant === 'rich')
              return {
                ...commonProps,
                backgroundColor: colors['dark-blue'][10],
                borderColor: colors['dark-blue'][30],
                boxShadow: '4px 0px 4px 0px #4B61831A',
                color: colors.gray[70],
              };
            return {
              ...commonProps,
              backgroundColor: colors.gray[70],
              borderColor: colors.gray[70],
              color: colors.gray[10],
            };
          },
        },
      },
    },
    palette: {
      divider: colors.gray[30],
      error: {
        contrastText: colors.gray[10],
        dark: colors.red[60],
        light: colors.red[50],
        main: colors.red[70],
      },
      info: {
        contrastText: colors.gray[10],
        dark: colors['sky-blue'][60],
        light: colors['sky-blue'][40],
        main: colors['sky-blue'][70],
      },
      mode,
      primary: {
        contrastText: colors.gray[20],
        dark: colors['dark-blue'][60],
        light: colors['dark-blue'][50],
        main: colors['dark-blue'][70],
      },
      secondary: {
        contrastText: colors.gray[10],
        dark: colors['ink-blue'][60],
        light: colors['ink-blue'][50],
        main: colors['ink-blue'][70],
      },
      success: {
        contrastText: colors.gray[10],
        dark: colors.green[60],
        light: colors.green[50],
        main: colors.green[70],
      },
      text: {
        primary: colors.gray[70],
      },
      warning: {
        contrastText: colors.gray[10],
        dark: colors.orange[60],
        light: colors.orange[50],
        main: colors.orange[70],
      },
    },
    typography: {
      allVariants: {
        color: colors.gray[70],
      },
      body1: {
        fontSize: '16px',
        lineHeight: '24px',
      },
      body2: {
        fontSize: '14px',
        lineHeight: '20px',
      },
      caption: {
        fontSize: '12px',
        lineHeight: '20px',
      },
      fontFamily: 'Montserrat, Inter, Arial, sans-serif',
      h1: {
        fontSize: '64px',
        lineHeight: '80px',
      },
      h2: {
        fontSize: '48px',
        lineHeight: '64px',
      },
      h3: {
        fontSize: '32px',
        lineHeight: '48Px',
      },
      h4: {
        fontSize: '24px',
        lineHeight: '36px',
      },
      h5: {
        fontSize: '20px',
        lineHeight: '30px',
      },
      h6: {
        fontSize: '18px',
        lineHeight: '28px',
      },
      overline: {
        fontSize: '12px',
        lineHeight: '20px',
      },
      // donot use subtitle 2 as nium components donot have variation
      subtitle1: {
        fontSize: '12px',
        lineHeight: '20px',
      },
    },
  });
};
