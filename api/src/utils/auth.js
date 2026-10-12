import jws from 'jws';
import crypto from 'crypto';
import { Kuski } from '#data/models';
import config from '../config.js';

// the hash format is shared with the game server, don't change it
export const hashPassword = (password, salt) =>
  crypto.createHash('RSA-SHA3-512').update(`${password}${salt}`).digest('hex');

// constant time comparison so response times don't leak how much of a hash
// matched
export const hashesMatch = (hash, expected) => {
  if (
    typeof hash !== 'string' ||
    typeof expected !== 'string' ||
    !expected ||
    hash.length !== expected.length
  ) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expected));
};

// rules for new passwords, returns an error message or '' if it's valid.
// max length is limited by the game
export const passwordMinLength = 6;
export const passwordMaxLength = 26;
export const validatePassword = password => {
  if (typeof password !== 'string' || password === '') {
    return 'Password is missing.';
  }
  if (password.length < passwordMinLength) {
    return `Password is too short. Minimum number of characters is ${passwordMinLength}.`;
  }
  if (password.length > passwordMaxLength) {
    return `Password is too long. Maximum number of characters is ${passwordMaxLength}.`;
  }
  return '';
};

const getKuskiData = async k => {
  const kuskiData = await Kuski.findOne({
    attributes: [
      'KuskiIndex',
      'Kuski',
      'TeamIndex',
      'Country',
      'Password',
      'Password2',
      'Salt',
      'Confirmed',
      'RAdmin',
      'RMod',
    ],
    where: { Kuski: k },
  });
  return kuskiData;
};

// sliding sessions: a token is valid for tokenLifetime and is renewed while
// it's being used (see middlewares/renewToken.js), but never beyond
// tokenMaxAge after the original login.
// keep tokenMaxAge in sync with the cookie maxAge in web/src/utils/nick.js
const day = 24 * 60 * 60;
const tokenLifetime = 30 * day;
const tokenMaxAge = 300 * day;
const tokenRenewAfter = 3 * day;

const now = () => Math.floor(Date.now() / 1000);

// mod and admin rights should not be stored in the token
const signToken = ({ username, userid, loginAt }) => {
  const iat = now();
  return jws.sign({
    header: { alg: config.jwtAlgo },
    payload: {
      username,
      userid,
      loginAt,
      iat,
      exp: Math.min(iat + tokenLifetime, loginAt + tokenMaxAge),
    },
    secret: config.jwtSecret,
  });
};

// returns a renewed token if the current one is valid, more than 3 days old
// and renewing would extend it (not already at the absolute cap)
export const renewedToken = req => {
  const auth = authContext(req);
  if (!auth.auth || now() - auth.iat < tokenRenewAfter) {
    return null;
  }
  if (auth.exp >= auth.loginAt + tokenMaxAge) {
    return null;
  }
  return signToken({
    username: auth.user,
    userid: auth.userid,
    loginAt: auth.loginAt,
  });
};

const generateToken = async kuskiData => {
  const token = signToken({
    username: kuskiData.Kuski,
    userid: kuskiData.KuskiIndex,
    loginAt: now(),
  });
  // mod and admin are returned for showing mod/admin ui only
  return {
    success: true,
    token,
    username: kuskiData.Kuski,
    userid: kuskiData.KuskiIndex,
    admin: kuskiData.RAdmin,
    mod: kuskiData.RMod,
  };
};

const addSha3 = async (salt, password, KuskiIndex) => {
  await Kuski.update(
    { Password2: hashPassword(password, salt) },
    { where: { KuskiIndex } },
  );
};

const deleteMD5 = async KuskiIndex => {
  await Kuski.update({ Password: '' }, { where: { KuskiIndex } });
};

export const auth = async body => {
  const { kuski, password } = body;
  if (typeof kuski !== 'string' || typeof password !== 'string') {
    return {
      success: false,
      message: 'Incorrect credentials',
    };
  }
  const kuskiData = await getKuskiData(kuski);
  if (!kuskiData) {
    return {
      success: false,
      message: 'Incorrect credentials',
    };
  }
  if (kuskiData.dataValues.Confirmed === 0) {
    return {
      success: false,
      message: 'User not confirmed',
    };
  }
  if (kuskiData.dataValues.Salt && kuskiData.dataValues.Password2) {
    const sha3 = hashPassword(password, kuskiData.dataValues.Salt);
    if (hashesMatch(sha3, kuskiData.dataValues.Password2)) {
      return generateToken(kuskiData.dataValues);
    }
    return {
      success: false,
      message: 'Incorrect credentials',
    };
  }
  if (kuskiData.dataValues.Password) {
    const md5 = crypto.createHash('md5').update(password).digest('hex');
    if (hashesMatch(md5, kuskiData.dataValues.Password)) {
      if (kuskiData.dataValues.Salt) {
        await addSha3(
          kuskiData.dataValues.Salt,
          password,
          kuskiData.dataValues.KuskiIndex,
        );
        await deleteMD5(kuskiData.dataValues.KuskiIndex);
      }
      return generateToken(kuskiData.dataValues);
    }
  }
  return {
    success: false,
    message: 'Incorrect credentials',
  };
};

export function authContext(req) {
  let token = '';
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization) {
    token = req.headers.authorization;
  }
  if (token) {
    try {
      if (jws.verify(token, config.jwtAlgo, config.jwtSecret)) {
        const userInfo = jws.decode(token);
        const payload = JSON.parse(userInfo.payload);
        // tokens without exp and loginAt were issued before tokens expired,
        // reject them
        if (
          typeof payload.exp === 'number' &&
          typeof payload.iat === 'number' &&
          typeof payload.loginAt === 'number' &&
          payload.exp > now()
        ) {
          return {
            auth: true,
            user: payload.username,
            userid: payload.userid,
            iat: payload.iat,
            exp: payload.exp,
            loginAt: payload.loginAt,
            signature: userInfo.signature,
          };
        }
      }
    } catch {
      // malformed or invalid token
    }
  }
  return { auth: false, userid: 0 };
}

// authContext plus mod and admin rights read from the database
export const authRights = async req => {
  if (req.authRights) {
    return req.authRights;
  }
  const auth = authContext(req);
  let rights = { ...auth, mod: false, admin: false };
  if (auth.auth) {
    const kuski = await Kuski.findOne({
      attributes: ['RMod', 'RAdmin'],
      where: { KuskiIndex: auth.userid },
    });
    if (kuski) {
      rights = {
        ...auth,
        mod: Boolean(kuski.RMod),
        admin: Boolean(kuski.RAdmin),
      };
    }
  }
  req.authRights = rights;
  return rights;
};
