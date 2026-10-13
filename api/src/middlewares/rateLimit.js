import { rateLimit, ipKeyGenerator } from 'express-rate-limit';

const minute = 60 * 1000;

// live and test run behind cloudflare and caddy. caddy only sees cloudflare's
// ip, the real client ip is in cf-connecting-ip. falls back to the socket ip
// when not behind cloudflare (local dev)
export const clientIp = req => req.headers['cf-connecting-ip'] || req.ip;

const ipKey = req => ipKeyGenerator(clientIp(req));

// keys on a request body field (nick, email) so limits can't be avoided by
// switching ip. falls back to the ip if the field is missing
const bodyKey = field => req => {
  const value = req.body?.[field];
  if (typeof value === 'string' && value) {
    return `${field}:${value.toLowerCase()}`;
  }
  return ipKey(req);
};

const limiter = ({ minutes, limit, key = ipKey, onlyFailed, body }) =>
  rateLimit({
    windowMs: minutes * minute,
    limit,
    keyGenerator: key,
    // login responds 200 for wrong passwords, so the route marks success in
    // res.locals and only failed attempts are counted
    ...(onlyFailed && {
      skipSuccessfulRequests: true,
      requestWasSuccessful: (req, res) => res.locals.success === true,
    }),
    handler: (req, res) =>
      res
        .status(429)
        .json(
          body(`Too many attempts, please try again in ${minutes} minutes.`),
        ),
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    // the ip comes from cf-connecting-ip, not x-forwarded-for / trust proxy
    validate: { xForwardedForHeader: false, trustProxy: false },
  });

const loginBody = message => ({ Response: { success: false, message } });
const registerBody = message => ({ success: false, message });

// failed logins per ip, and per nick so one account can't be guessed at from
// many ips. the nick limit is higher to make locking someone out harder
export const loginLimit = [
  limiter({ minutes: 15, limit: 10, onlyFailed: true, body: loginBody }),
  limiter({
    minutes: 60,
    limit: 20,
    key: bodyKey('kuski'),
    onlyFailed: true,
    body: loginBody,
  }),
];

// new accounts per ip
export const registerLimit = limiter({
  minutes: 60,
  limit: 10,
  body: registerBody,
});

// password reset emails per ip, and per email address so nobody can flood
// someone's inbox
export const resetRequestLimit = [
  limiter({ minutes: 60, limit: 5, body: registerBody }),
  limiter({ minutes: 60, limit: 3, key: bodyKey('Email'), body: registerBody }),
];

// confirm and reset codes per ip, so codes can't be guessed
export const codeLimit = limiter({
  minutes: 15,
  limit: 20,
  body: registerBody,
});
