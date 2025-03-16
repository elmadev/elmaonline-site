import SibApiV3Sdk from 'sib-api-v3-sdk';
import config from '../config.js';

const fromMail = 'mail@elma.online';
const fromName = 'Elma Online';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.sibApiKey;

export const sendEmail = (email, kuski, template, params) => {
  return new Promise((resolve, reject) => {
    if (!config.sibApiKey) {
      // resolve so code doesn't stop in development
      resolve();
    }
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email, name: kuski }];
    sendSmtpEmail.sender = { email: fromMail, name: fromName };
    sendSmtpEmail.templateId = template;
    sendSmtpEmail.params = params;
    apiInstance.sendTransacEmail(sendSmtpEmail).then(
      data => {
        resolve(data);
      },
      error => {
        reject(error);
      },
    );
  });
};

export const confirmMail = async (kuski, email, confirmId) => {
  const send = await sendEmail(email, kuski, 2, { kuski, confirmId });
  return send;
};

export const resetMail = async (kuski, email, confirmId) => {
  const send = await sendEmail(email, kuski, 3, { kuski, confirmId });
  return send;
};

export const acceptNickMail = async (kuski, email, oldNick) => {
  const send = await sendEmail(email, kuski, 4, { kuski, oldNick });
  return send;
};

export const notificationMail = async (KuskiInfo, type, meta) => {
  let headline = '';
  let text = '';
  let link = '';
  if (type === 'comment') {
    headline = 'Replay comment';
    text = `${meta.kuski} added a comment to your replay: "${meta.Text}"`;
    link = `/r/${meta.replayUUID}/${meta.replayName.replace('.rec', '')}`;
  }
  if (type === 'lgr_comment') {
    headline = 'LGR comment';
    text = `${meta.kuski} added a comment to your lgr ${meta.LGRName}: "${meta.Text}"`;
    link = `/l/${meta.LGRName}`;
  }
  if (type === 'beaten') {
    headline = 'Record beaten';
    text = `${meta.kuski} crushed your record in level ${meta.level}`;
    link = `/levels/${meta.levelIndex}`;
  }
  if (type === 'besttime') {
    headline = 'New record';
    text = `[`;
    meta.levPacks.forEach((pack, index) => {
      text = `${text}${pack.LevelPackName}`;
      text = `${text}${meta.levPacks.length > index + 1 && ', '}`;
    });
    text = `${text}] ${meta.kuski} got record in level ${meta.level} with time ${meta.time}`;
    link = `/levels/${meta.levelIndex}`;
  }
  if (text) {
    const send = await sendEmail(KuskiInfo.Email, KuskiInfo.Kuski, 5, {
      kuski: KuskiInfo.Kuski,
      headline,
      text,
      link,
    });
    return send;
  }
  return null;
};
