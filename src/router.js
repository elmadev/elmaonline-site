/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

import UniversalRouter from 'universal-router';

// The top-level (parent) route
const routes = {
  path: '',

  // Keep in mind, routes are evaluated in order
  children: [
    // The home route is added to client.js to make sure shared components are
    // added to client.js as well and not repeated in individual each route chunk.
    {
      path: '',
      load: () => import(/* webpackChunkName: 'home' */ './pages/home'),
    },
    {
      path: '/battles/ranking',
      load: () => import(/* webpackChunkName: 'ranking' */ './pages/ranking'),
    },
    {
      path: '/battles/:id',
      load: () => import(/* webpackChunkName: 'battle' */ './pages/battle'),
    },
    {
      path: '/battles',
      load: () => import(/* webpackChunkName: 'battles' */ './pages/battles'),
    },
    {
      path: '/editor',
      load: () => import(/* webpackChunkName: 'editor' */ './pages/editor'),
    },
    {
      path: '/kuskis',
      load: () => import(/* webpackChunkName: 'kuskis' */ './pages/kuskis'),
    },
    {
      path: '/kuskis/:name',
      load: () => import(/* webpackChunkName: 'kuski' */ './pages/kuski'),
    },
    {
      path: '/levels',
      load: () => import(/* webpackChunkName: 'levels' */ './pages/levels'),
    },
    {
      path: '/levels/:id',
      load: () => import(/* webpackChunkName: 'level' */ './pages/level'),
    },
    {
      path: '/levels/packs/:name',
      load: () =>
        import(/* webpackChunkName: 'levelpack' */ './pages/levelpack'),
    },
    {
      path: '/r/:uuid',
      load: () => import(/* webpackChunkName: 'replay' */ './pages/replay'),
    },
    {
      path: '/search',
      load: () => import(/* webpackChunkName: 'search' */ './pages/search'),
    },
    {
      path: '/cups',
      load: () => import(/* webpackChunkName: 'cups' */ './pages/cups'),
    },
    {
      path: '/cup/:id',
      load: () => import(/* webpackChunkName: 'battle' */ './pages/cup'),
    },
    {
      path: '/confirm/:confirmCode',
      load: () => import(/* webpackChunkName: 'confirm' */ './pages/confirm'),
    },
    // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
    {
      path: '(.*)',
      load: () =>
        import(/* webpackChunkName: 'not-found' */ './pages/not-found'),
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'}`;
    route.description = route.description || '';

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./pages/error').default,
  });
}

export default new UniversalRouter(routes, {
  resolveRoute(context, params) {
    if (typeof context.route.load === 'function') {
      return context.route
        .load()
        .then(action => action.default(context, params));
    }
    if (typeof context.route.action === 'function') {
      return context.route.action(context, params);
    }
    return undefined;
  },
});
