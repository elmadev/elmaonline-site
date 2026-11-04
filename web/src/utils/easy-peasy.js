import { action, thunk } from 'easy-peasy';

export const getSetter = key => {
  return action((state, payload) => {
    state[key] = payload;
  });
};

export const getUpdater = () => {
  return action((state, payload) => {
    state = payload(state);
    return state;
  });
};

// human readable message for a failed apisauce response
export const formatError = response => {
  switch (response.problem) {
    case 'TIMEOUT_ERROR':
      return 'The request took too long. Please try again, or narrow your search.';
    case 'CONNECTION_ERROR':
    case 'NETWORK_ERROR':
      return 'Could not reach the server. Check your connection and try again.';
    case 'CANCEL_ERROR':
      return 'The request was cancelled.';
    default:
  }
  switch (response.status) {
    case 401:
    case 403:
      return 'You are not allowed to see this. Try logging in again.';
    case 404:
      return 'Nothing was found.';
    case 429:
      return 'Too many requests. Please wait a minute and try again.';
    case 503:
      return 'This is temporarily unavailable. Please try again later.';
    default:
  }
  if (response.problem === 'SERVER_ERROR') {
    return 'Something went wrong on the server. Please try again later.';
  }
  return 'Something went wrong. Please try again.';
};

export const model = (
  endpoint,
  create = null,
  update = null,
  remove = null,
  settings = {
    doNotRefetch: false, // true means a create/update/delete will not refetch
  },
) => ({
  data: null,
  loading: false,
  error: '',
  fetchPayload: null,
  response: null,
  setData: action((state, response) => {
    state.data = response;
    state.loading = false;
  }),
  startLoading: action((state, payload) => {
    state.loading = true;
    state.error = '';
    if (payload) {
      state.fetchPayload = payload;
    }
  }),
  setError: action((state, problem) => {
    state.error = problem;
    state.loading = false;
  }),
  setResponse: action((state, response) => {
    state.response = response;
    state.loading = false;
  }),
  fetch: thunk(async (actions, payload) => {
    actions.startLoading(payload);
    const response = await endpoint(payload);
    if (response.ok) {
      actions.setData(response.data);
      return;
    }
    actions.setError(formatError(response));
  }),
  refetch: thunk(async (actions, payload, { getState }) => {
    const response = await endpoint(getState().fetchPayload);
    if (response.ok) {
      actions.setData(response.data);
      return;
    }
    actions.setError(formatError(response));
  }),
  create: thunk(async (actions, payload) => {
    if (create) {
      actions.startLoading();
      const post = await create(payload);
      if (post.ok) {
        actions.setResponse(post.data);
        if (!settings.doNotRefetch) {
          actions.refetch();
        }
      }
    }
  }),
  update: thunk(async (actions, payload) => {
    if (update) {
      actions.startLoading();
      const post = await update(payload);
      if (post.ok) {
        actions.setResponse(post.data);
        if (!settings.doNotRefetch) {
          actions.refetch();
        }
      }
    }
  }),
  remove: thunk(async (actions, payload) => {
    if (remove) {
      actions.startLoading();
      const post = await remove(payload);
      if (post.ok) {
        actions.setResponse(post.data);
        if (!settings.doNotRefetch) {
          actions.refetch();
        }
      }
    }
  }),
});
