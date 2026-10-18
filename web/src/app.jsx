import React, { lazy, Suspense } from 'react';
import { StoreProvider, createStore } from 'easy-peasy';
import Router, { router } from './router';
import { watchSession } from 'utils/nick';
import model from './easypeasy';
import { queryClient } from './react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import config from 'config';

const ReactQueryDevtools =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === 'production' || !config.queryDevTools
    ? () => null
    : lazy(() =>
        import('@tanstack/react-query-devtools').then(res => ({
          default: res.ReactQueryDevtools,
        })),
      );

const easyPeasyStore = createStore(model, {
  version: 2,
});

watchSession(easyPeasyStore, router);

function App() {
  return (
    <StoreProvider store={easyPeasyStore}>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Suspense>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      </QueryClientProvider>
    </StoreProvider>
  );
}

export default App;
