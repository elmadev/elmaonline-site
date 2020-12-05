import jws from 'jws';
import crypto from 'crypto';
import { Kuski } from 'data/models';
import config from '../config';

const getKuskiData = async (kuski, Password) => {
  const kuskiData = await Kuski.findOne({
    attributes: [
      'KuskiIndex',
      'Kuski',
      'TeamIndex',
      'Country',
      'Password',
      'Confirmed',
      'RAdmin',
      'RMod',
    ],
    where: { Kuski: kuski, Password },
  });
  return kuskiData;
};

export function auth(body) {
  return new Promise(resolve => {
    const { kuski, password } = body;
    const encryptedPassword = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');
    getKuskiData(kuski, encryptedPassword).then(kuskiData => {
      if (kuskiData) {
        if (kuskiData.dataValues.Confirmed === 0) {
          resolve({
            success: false,
            message: 'User not confirmed',
          });
        } else if (encryptedPassword === kuskiData.dataValues.Password) {
          const token = jws.sign({
            header: { alg: config.jwtAlgo },
            payload: {
              username: kuskiData.dataValues.Kuski,
              userid: kuskiData.dataValues.KuskiIndex,
              admin: kuskiData.dataValues.RAdmin,
              mod: kuskiData.dataValues.RMod,
            },
            secret: config.jwtSecret,
          });
          resolve({
            success: true,
            token,
            username: kuskiData.dataValues.Kuski,
            userid: kuskiData.dataValues.KuskiIndex,
            admin: kuskiData.dataValues.RAdmin,
            mod: kuskiData.dataValues.RMod,
          });
        } else {
          resolve({
            success: false,
            message: 'Incorrect credentials',
          });
        }
      } else {
        resolve({
          success: false,
          message: 'Incorrect credentials',
        });
      }
    });
  });
}

export function authContext(req) {
  if (req.cookies.token) {
    if (jws.verify(req.cookies.token, config.jwtAlgo, config.jwtSecret)) {
      const userInfo = jws.decode(req.cookies.token);
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
  return { auth: false };
}
