import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    // I think necessary to not trigger re-fetch when using navigate:
    refetchOnMount: false,
  },
});
