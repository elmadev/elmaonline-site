import SibApiV3Sdk from 'sib-api-v3-sdk';
import config from '../config';

const fromMail = 'mail@elma.online';
const fromName = 'Elma Online';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.sibApiKey;

export const sendEmail = (email, kuski, template, params) => {
  return new Promise((resolve, reject) => {
    const apiInstance = new SibApiV3Sdk.SMTPApi();
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

export const newsMail = () => {
  return new Promise(resolve => {
    resolve(true);
  });
};
