import { createTheme } from '@mui/material/styles';

const pad = 4;

const elmaGreenLight = {
  name: 'Elma Green (Light)',
  // colors
  type: 'light',
  primary: '#219653',
  primaryLight: '#2ed175',
  primaryDark: '#17693a',
  primaryAlpha: 'rgba(33, 150, 83, 0.1)',
  primaryAlpha3: 'rgba(33, 150, 83, 0.3)',
  secondary: '#0097a7',
  secondaryLight: '#00cfe6',
  secondaryDark: '#005c66',
  linkColor: '#219653',
  linkHover: '#2ed175',
  pageBackground: '#f1f1f1',
  pageBackgroundDark: '#c4c4c4',
  paperBackground: 'white',
  headerColor: '#1b3a57',
  hoverColor: '#ededed',
  selectedColor: '#f5f5f5',
  highlightColor: '#dddddd',
  borderColor: '#e2e3e4',
  errorColor: '#a20e2f',
  paperBorder: 'none',

  // battles
  ongoing: '#bae1ff',
  inqueue: '#baffc9',
  aborted: '#ffb3ba',

  // paddings
  padXXSmall: `${pad}px`, // 4px
  padXSmall: `${pad * 1.5}px`, // 6px
  padSmall: `${pad * 2}px`, // 8px
  padMedium: `${pad * 4}px`, // 16px
  padLarge: `${pad * 6}px`, // 24px
  padXLarge: `${pad * 9}px`, // 36px
  padXXLarge: `${pad * 12}px`, // 48px

  // texts
  fontFamily: `'Segoe UI', 'HelveticaNeue-Light', sans-serif`,
  fontSize: '1em',
  smallFont: '14px',
  fontColor: '#222',
  lightTextColor: '#767676',
  buttonFontColor: '#fff',
};

const powerPinkDark = {
  ...elmaGreenLight,
  name: 'Power Pink (Dark)',
  // colors
  type: 'dark',
  primary: '#d81b60',
  primaryLight: '#ff5c8d',
  primaryDark: '#a00037',
  primaryAlpha: 'rgba(216, 27, 96, 0.1)',
  primaryAlpha3: 'rgba(216, 27, 96, 0.3)',
  secondary: '#0097a7',
  secondaryLight: '#00cfe6',
  secondaryDark: '#005c66',
  linkColor: '#ff5c8d',
  linkHover: '#ff80a6',
  pageBackground: '#263238',
  pageBackgroundDark: '#151b1e',
  paperBackground: '#102027',
  headerColor: '#fafafa',
  selectedColor: '#34444c',
  highlightColor: '#1d3d49',
  hoverColor: '#0C191E',
  borderColor: '#37474f',
  errorColor: '#b0ffbf',

  //battles
  ongoing: 'rgba(186, 225, 255, .2)',
  inqueue: 'rgba(186, 255, 201, .2)',
  aborted: 'rgba(255, 179, 186, .2)',

  // texts
  fontColor: 'white',
  lightTextColor: '#bfbfbf',
};

const oceanBlueDark = {
  ...powerPinkDark,
  name: 'Ocean Blue (Dark)',
  // colors
  primary: '#1976d2',
  primaryLight: '#63a4ff',
  primaryDark: '#004ba0',
  primaryAlpha: 'rgba(25, 118, 210, 0.1)',
  primaryAlpha3: 'rgba(25, 118, 210, 0.3)',
  secondary: '#f57c00',
  secondaryLight: '#ffad42',
  secondaryDark: '#bb4d00',
  linkColor: '#63a4ff',
  errorColor: '#e97dc3',
};

const oceanBlueLight = {
  ...elmaGreenLight,
  name: 'Ocean Blue (Light)',
  // colors
  primary: '#0d47a1',
  primaryLight: '#5472d3',
  primaryDark: '#002171',
  primaryAlpha: 'rgba(13, 71, 161, 0.1)',
  primaryAlpha3: 'rgba(13, 71, 161, 0.3)',
  secondary: '#f57c00',
  secondaryLight: '#ffad42',
  secondaryDark: '#bb4d00',
  linkColor: '#5472d3',
};

const elmastatsDark = {
  ...powerPinkDark,
  name: 'Elmastats (Dark)',
  // colors
  pageBackground: '#303030',
  pageBackgroundDark: '#303030',
  paperBackground: '#303030',
  primary: '#1F1F1F',
  // mui controls need a visible accent, primary is too dark on this background
  muiPrimary: '#1976d2',
  primaryLight: '#63a4ff',
  primaryDark: '#004ba0',
  primaryAlpha: 'rgba(25, 118, 210, 0.1)',
  primaryAlpha3: 'rgba(25, 118, 210, 0.3)',
  secondary: '#f57c00',
  secondaryLight: '#ffad42',
  secondaryDark: '#bb4d00',
  linkColor: '#4671D5',
  linkHover: '#7AA2F7',
  hoverColor: '#202020',
  borderColor: '#000000',
  errorColor: '#4671D5',
  paperBorder: '1px solid #000',
  //battles
  ongoing: 'rgba(186, 225, 255, .2)',
  inqueue: 'rgba(186, 255, 201, .2)',
  aborted: 'rgba(255, 179, 186, .2)',
};

const themes = [
  elmaGreenLight,
  oceanBlueLight,
  powerPinkDark,
  oceanBlueDark,
  elmastatsDark,
];

const previews = [
  'https://up.elma.online/u/w77aszpiki/ElmaGreenLight.png',
  'https://up.elma.online/u/84rwrjqcwe/OceanBlueLight.png',
  'https://up.elma.online/u/6zocp6lq8n/PowerPinkDark.png',
  'https://up.elma.online/u/8nm2weck7p/OceanBlueDark.png',
  'https://up.elma.online/u/tie1z4w5ix/elmastatsDark.png',
];

const muiTheme = themeId =>
  createTheme({
    palette: {
      mode: themes[themeId].type,
      primary: {
        light: themes[themeId].primaryLight,
        main: themes[themeId].muiPrimary || themes[themeId].primary,
        dark: themes[themeId].primaryDark,
        contrastText: themes[themeId].buttonFontColor,
      },
      secondary: {
        main: themes[themeId].secondary,
      },
      // v5 components like ListSubheader read this instead of the Paper override
      background: {
        paper: themes[themeId].paperBackground,
      },
    },
    // keep v4 breakpoints and default colors so layouts and visuals stay the same
    breakpoints: {
      values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
    },
    components: {
      MuiTabs: {
        defaultProps: {
          textColor: 'inherit',
        },
      },
      // v4 tab sizing, v5 tabs shrink to fit their label
      MuiTab: {
        styleOverrides: {
          root: ({ theme }) => ({
            maxWidth: 264,
            minWidth: 72,
            padding: '6px 12px',
            [theme.breakpoints.up('sm')]: {
              minWidth: 160,
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: themes[themeId].paperBackground,
            color: themes[themeId].fontColor,
            border: themes[themeId].paperBorder || undefined,
            // v5 adds a lightening gradient to elevated paper in dark mode
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        // v4 defaulted to color="default"; inherit is the v5 equivalent
        defaultProps: {
          color: 'inherit',
        },
        styleOverrides: {
          // only uncolored buttons, so primary/secondary keep their palette colors
          root: ({ ownerState, theme }) => {
            if (ownerState.color !== 'inherit') return {};
            if (ownerState.variant !== 'contained') {
              return { color: themes[themeId].fontColor };
            }
            // v5 hovers grey buttons with grey.A100 (#f5f5f5), v4's A100 was #d5d5d5
            return theme.palette.mode === 'light'
              ? { '&:hover': { backgroundColor: '#d5d5d5' } }
              : {};
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: {
            color: themes[themeId].fontColor,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: themes[themeId].lightTextColor,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: themes[themeId].linkColor,
          },
        },
      },
      MuiChip: {
        // only uncolored chips, so primary/secondary keep their contrast text
        styleOverrides: {
          root: ({ ownerState }) =>
            ownerState.color === 'default'
              ? { color: themes[themeId].lightTextColor }
              : {},
          outlined: ({ ownerState }) =>
            ownerState.color === 'default'
              ? { border: `1px solid ${themes[themeId].lightTextColor}` }
              : {},
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          // unchecked only, so checked boxes keep the primary color
          root: {
            '&:not(.Mui-checked):not(.MuiCheckbox-indeterminate):not(.Mui-disabled)':
              {
                color: 'inherit',
              },
          },
        },
      },
    },
  });

export { muiTheme, themes, previews };
