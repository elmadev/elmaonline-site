import { ThemeProvider } from '@emotion/react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import {
  RouterContextProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router';
import { StoreProvider, createStore } from 'easy-peasy';
import { themes, muiTheme } from '../src/theme';
import GlobalStyle from '../src/globalStyle';
import model from '../src/easypeasy';

const defaultTheme = Object.keys(themes)[0];

const store = createStore(model);

const router = createRouter({
  routeTree: createRootRoute(),
  history: createMemoryHistory(),
});

// decorators call Story() directly, rendering <Story /> breaks storybook hooks
const withMuiTheme = (Story, context) => (
  <MuiThemeProvider theme={muiTheme(context.globals.theme || defaultTheme)}>
    {Story()}
  </MuiThemeProvider>
);

const withAppContext = Story => (
  <StoreProvider store={store}>
    <RouterContextProvider router={router}>{Story()}</RouterContextProvider>
  </StoreProvider>
);

export const decorators = [
  withThemeFromJSXProvider({
    themes,
    defaultTheme,
    Provider: ThemeProvider,
    GlobalStyles: GlobalStyle,
  }),
  withMuiTheme,
  withAppContext,
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: { storySort: { order: ['Introduction'] } },
};
