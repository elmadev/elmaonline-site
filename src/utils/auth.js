import jws from 'jws';
import crypto from 'crypto';
import { Kuski } from '#data/models';
import config from '../config';

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

const generateToken = async kuskiData => {
  const token = jws.sign({
    header: { alg: config.jwtAlgo },
    payload: {
      username: kuskiData.Kuski,
      userid: kuskiData.KuskiIndex,
      admin: kuskiData.RAdmin,
      mod: kuskiData.RMod,
    },
    secret: config.jwtSecret,
  });
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
  const sha3 = crypto
    .createHash('RSA-SHA3-512')
    .update(`${password}${salt}`)
    .digest('hex');
  await Kuski.update({ Password2: sha3 }, { where: { KuskiIndex } });
};

export const auth = async body => {
  const { kuski, password } = body;
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
    const sha3 = crypto
      .createHash('RSA-SHA3-512')
      .update(`${password}${kuskiData.dataValues.Salt}`)
      .digest('hex');
    if (sha3 === kuskiData.dataValues.Password2) {
      return generateToken(kuskiData.dataValues);
    }
    return {
      success: false,
      message: 'Incorrect credentials',
    };
  }
  if (kuskiData.dataValues.Password) {
    const md5 = crypto.createHash('md5').update(password).digest('hex');
    if (md5 === kuskiData.dataValues.Password) {
      if (kuskiData.dataValues.Salt) {
        await addSha3(
          kuskiData.dataValues.Salt,
          password,
          kuskiData.dataValues.KuskiIndex,
        );
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
    if (jws.verify(token, config.jwtAlgo, config.jwtSecret)) {
      const userInfo = jws.decode(token);
      const payload = JSON.parse(userInfo.payload);
      return {
        auth: true,
        user: payload.username,
        userid: payload.userid,
        admin: payload.admin,
        mod: payload.mod,
        signature: userInfo.signature,
      };
    }
  }
  return { auth: false, userid: 0 };
}

export function authDiscord(req, res, next) {
  if (req.header('Authorization') === config.discord.bnAuth) {
    return next();
  }
  return res.sendStatus(401);
}
