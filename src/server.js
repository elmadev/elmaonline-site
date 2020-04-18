/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import Promise from 'bluebird';
import express from 'express';
import session from 'express-session';
import grant from 'grant-express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { graphql } from 'graphql';
import expressGraphQL from 'express-graphql';
import nodeFetch from 'node-fetch';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getDataFromTree } from 'react-apollo';
import PrettyError from 'pretty-error';
import stream from 'stream';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import {
  MuiThemeProvider,
  createGenerateClassName,
} from '@material-ui/core/styles';
import { ServerStyleSheet } from 'styled-components';
import { setRuntimeVariable } from 'actions/runtime';
import App from 'components/App';
import Html from 'components/Html';
import createApolloClient from 'core/createApolloClient';
import schema from 'data/schema';
import configureStore from 'store/configureStore';
import { getReplayByBattleId, getLevel } from 'utils/download';
import uploadReplayS3 from 'utils/upload';
import createFetch from 'utils/createFetch';
import {
  chatline,
  besttime,
  bestmultitime,
  battlestart,
  battlequeue,
  battleend,
  battleresults,
} from 'utils/events';
import { discord } from 'utils/discord';
import { auth, authContext } from 'utils/auth';
import { kuskimap } from 'utils/dataImports';
import { updateRanking, deleteRanking } from './ranking';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import router from './router';
import config from './config';
import muiTheme from './muiTheme';
import apiRoutes from './api';

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

//
// Authentication
// -----------------------------------------------------------------------------

app.use(session({ secret: 'grant' }));
app.use(
  grant({
    ...config.grant,
  }),
);

if (__DEV__) {
  app.enable('trust proxy');
}

app.post('/token', async (req, res) => {
  const authResponse = await auth(req.body);
  res.json({ Response: authResponse });
});

//
// Rest API
//--------------------------------------------
app.use('/api', apiRoutes);

//
// Events API
//--------------------------------------------
app.post('/events/chatline', (req, res) => {
  chatline(req, res);
});
app.post('/events/besttime', (req, res) => {
  besttime(req, res);
});
app.post('/events/bestmultitime', (req, res) => {
  bestmultitime(req, res);
});
app.post('/events/battlestart', (req, res) => {
  battlestart(req, res);
});
app.post('/events/battlequeue', (req, res) => {
  battlequeue(req, res);
});
app.post('/events/battleend', (req, res) => {
  battleend(req, res);
});
app.post('/events/battleresults', (req, res) => {
  battleresults(req, res);
});

//
// Discord bot
//--------------------------------------------
discord();

//
// Downloading files
//--------------------------------------------
app.get('/dl/battlereplay/:id', async (req, res, next) => {
  try {
    const { file, filename } = await getReplayByBattleId(req.params.id);
    const readStream = new stream.PassThrough();
    readStream.end(file);
    res.set({
      'Content-disposition': `attachment; filename=${filename}`,
      'Content-Type': 'application/octet-stream',
    });
    readStream.pipe(res);
  } catch (e) {
    next({
      status: 403,
      msg: e.message,
    });
  }
});

app.get('/dl/level/:id', async (req, res, next) => {
  try {
    const { file, filename } = await getLevel(req.params.id);
    const readStream = new stream.PassThrough();
    readStream.end(file);
    res.set({
      'Content-disposition': `attachment; filename=${filename}`,
      'Content-Type': 'application/octet-stream',
    });
    readStream.pipe(res);
  } catch (e) {
    next({
      status: 403,
      msg: e.message,
    });
  }
});

//
// ranking
//--------------------------------------------
app.get('/run/ranking/delete', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    const data = await deleteRanking();
    res.json({ deleted: data });
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});
app.get('/run/ranking/:limit', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    const limit = Math.round(
      Math.min(parseInt(req.params.limit, 10), 10000) / 10,
    );
    res.json({ status: 'started' });
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});

//
// Data imports
// -------------------------------------------
app.get('/run/kuskimap', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    await kuskimap();
    res.json({ status: 'done' });
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});

//
// Uploading files
//--------------------------------------------
app.post('/upload/:type', async (req, res) => {
  const replayFile = req.files.file;
  let folder = 'misc';
  if (req.params.type === 'replay') {
    folder = 'replays';
    const {
      file,
      uuid,
      time,
      finished,
      LevelIndex,
      error,
      MD5,
      replayInfo,
    } = await uploadReplayS3(replayFile, folder, req.body.filename);
    if (!error) {
      res.json({
        file,
        uuid,
        time,
        finished,
        LevelIndex,
        MD5,
      });
    } else {
      res.json({
        error,
        replayInfo,
        file,
      });
    }
  }
});

//
// Register API middleware
// -----------------------------------------------------------------------------
// https://github.com/graphql/express-graphql#options
const graphqlMiddleware = expressGraphQL(req => ({
  schema,
  graphiql: __DEV__,
  rootValue: { request: req },
  context: authContext(req),
  pretty: __DEV__,
}));

app.use('/graphql', graphqlMiddleware);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    const insertCss = (...styles) => {
      // eslint-disable-next-line no-underscore-dangle
      styles.forEach(style => css.add(style._getCss()));
    };

    const apolloClient = createApolloClient({
      schema,
      rootValue: { request: req },
      context: authContext(req),
    });

    // Universal HTTP client
    const fetch = createFetch(nodeFetch, {
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
      apolloClient,
      schema,
      graphql,
    });

    const initialState = {
      user: req.user || null,
    };

    const store = configureStore(initialState, {
      cookie: req.headers.cookie,
      fetch,
      // I should not use `history` on server.. but how I do redirection? follow universal-router
      history: null,
    });

    store.dispatch(
      setRuntimeVariable({
        name: 'initialNow',
        value: Date.now(),
      }),
    );

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      insertCss,
      fetch,
      // The twins below are wild, be careful!
      pathname: req.path,
      query: req.query,
      // You can access redux through react-redux connect
      store,
      storeSubscription: null,
      // Apollo Client for use with react-apollo
      client: apolloClient,
    };

    const route = await router.resolve(context);

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    const sheetsRegistry = new SheetsRegistry();
    const sheetsManager = new Map();
    const generateClassName = createGenerateClassName();
    const styledSheet = new ServerStyleSheet();

    const rootComponent = (
      <JssProvider
        registry={sheetsRegistry}
        generateClassName={generateClassName}
      >
        <MuiThemeProvider theme={muiTheme} sheetsManager={sheetsManager}>
          <StyleContext.Provider value={{ insertCss }}>
            <App context={context}>{route.component}</App>
          </StyleContext.Provider>
        </MuiThemeProvider>
      </JssProvider>
    );
    await getDataFromTree(rootComponent);
    // this is here because of Apollo redux APOLLO_QUERY_STOP action
    await Promise.delay(0);
    data.children = await ReactDOMServer.renderToString(
      styledSheet.collectStyles(rootComponent),
    );
    const materialUICss = sheetsRegistry.toString();
    const styledStyles = styledSheet.getStyleTags();
    data.styles = [
      { id: 'css', cssText: [...css].join('') },
      { id: 'materialUI', cssText: materialUICss },
      { id: 'styled', cssText: styledStyles },
    ];

    data.scripts = [assets.vendor.js];
    if (route.chunks) {
      data.scripts.push(...route.chunks.map(chunk => assets[chunk].js));
    }
    data.scripts.push(assets.client.js);

    // Furthermore invoked actions will be ignored, client will not receive them!
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('Serializing store...');
    }
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
      apolloState: context.client.extract(),
      s3SubFolder: config.s3SubFolder,
      recaptcha: config.recaptcha.client,
      google: config.google,
    };

    const html = ReactDOMServer.renderToStaticMarkup(<Html {...data} />); // eslint-disable-line
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  res.status(err.status || 500);
  res.send(err.msg);
});

//
// Launch the server
// -----------------------------------------------------------------------------
if (!module.hot) {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
