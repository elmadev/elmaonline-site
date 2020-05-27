import SibApiV3Sdk from 'sib-api-v3-sdk';
import config from '../config';

const fromMail = 'mail@elma.online';
const fromName = 'Elma Online';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.sibApiKey;

export const confirmMail = (kuski, email, confirmId) => {
  return new Promise((resolve, reject) => {
    const apiInstance = new SibApiV3Sdk.SMTPApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email, name: kuski }];
    sendSmtpEmail.sender = { email: fromMail, name: fromName };
    sendSmtpEmail.templateId = 2;
    sendSmtpEmail.params = { kuski, confirmId };
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

export const resetMail = (kuski, email, confirmId) => {
  return new Promise((resolve, reject) => {
    const apiInstance = new SibApiV3Sdk.SMTPApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email, name: kuski }];
    sendSmtpEmail.sender = { email: fromMail, name: fromName };
    sendSmtpEmail.templateId = 3;
    sendSmtpEmail.params = { kuski, confirmId };
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

export const newsMail = () => {
  return new Promise(resolve => {
    resolve(true);
  });
};
