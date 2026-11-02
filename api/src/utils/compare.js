// Compare mode (COMPARE=1), used by compare/compare.ts to diff the sql and
// writes of two api versions. Every request runs in a transaction that is
// always rolled back, so nothing is ever saved, and the sql it sent is kept
// for the runner to fetch. Never enable this on a shared server.
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import Sequelize from 'sequelize';
import sequelize from '#data/sequelize';
import config from '../config.js';

const storage = new AsyncLocalStorage();

// sequelize looks up the current transaction in a cls namespace, this one is
// backed by AsyncLocalStorage instead of cls-hooked
const namespace = {
  get: key => storage.getStore()?.[key],
  set: (key, value) => {
    const store = storage.getStore();
    if (store) store[key] = value;
  },
  // nested managed transactions get their own copy, so finishing one doesn't
  // clear the request's transaction
  run: fn =>
    storage.run({ ...storage.getStore() }, () => fn(storage.getStore())),
  bind: fn => fn,
};

// transaction bookkeeping isn't part of what a handler asks for
const bookkeeping =
  /^\s*(START TRANSACTION|BEGIN|COMMIT|ROLLBACK|SAVEPOINT|RELEASE SAVEPOINT|SET (SESSION )?TRANSACTION|SET autocommit)/i;

const describeQuery = (sql, options = {}) => {
  const text = typeof sql === 'string' ? sql : sql.query;
  const params = options.replacements ?? options.bind ?? sql.values;
  return params === undefined ? text : `${text} -- ${JSON.stringify(params)}`;
};

// compare id -> promise of the sql sent while handling that request
const results = new Map();

// how long to wait after a response before rolling back, so queries a handler
// fires after responding still run in the transaction
const graceMs = 200;

export const enableCompareMode = app => {
  Sequelize.useCLS(namespace);

  const query = sequelize.query.bind(sequelize);
  sequelize.query = (sql, options) => {
    const text = typeof sql === 'string' ? sql : sql.query;
    if (!bookkeeping.test(text)) {
      storage.getStore()?.sql.push(describeQuery(sql, options));
    }
    return query(sql, options);
  };

  // transactions started by handlers become savepoints of the request's
  // transaction, so committing them doesn't save anything
  const transaction = sequelize.transaction.bind(sequelize);
  sequelize.transaction = (options, autoCallback) => {
    if (typeof options === 'function') {
      return sequelize.transaction({}, options);
    }
    const parent = storage.getStore()?.transaction;
    return transaction({ transaction: parent, ...options }, autoCallback);
  };

  // queries that fail because their request was already rolled back
  process.on('unhandledRejection', error => {
    // eslint-disable-next-line no-console
    console.error('compare mode: unhandled rejection', error);
  });

  // the runner checks this before sending writes. external services aren't
  // part of the transaction, so writes are only safe without them
  app.get('/__compare/status', (req, res) => {
    res.json({
      compare: true,
      external: !!(
        config.sibApiKey ||
        config.accessKeyId ||
        config.SWaccessKeyId ||
        config.discord.botApi
      ),
    });
  });

  app.get('/__compare/sql/:id', async (req, res) => {
    const sql = results.get(req.params.id);
    res.json(sql ? await sql : null);
  });

  app.use((req, res, next) => {
    const id = req.header('x-compare-id') || randomUUID();
    const store = { sql: [] };
    let done;
    results.set(
      id,
      new Promise(resolve => {
        done = resolve;
      }),
    );
    storage.run(store, async () => {
      try {
        store.transaction = await transaction();
      } catch (error) {
        next(error);
        return;
      }
      res.once('close', () => {
        setTimeout(async () => {
          try {
            await store.transaction.rollback();
          } catch {
            // already finished
          }
          done(store.sql);
          setTimeout(() => results.delete(id), 60000);
        }, graceMs);
      });
      next();
    });
  });
};
