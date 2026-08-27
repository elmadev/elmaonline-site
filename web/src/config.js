const url = import.meta.env.VITE_API_URL;
const s3SubFolder = import.meta.env.VITE_S3_SUB_FOLDER;
const upUrl = import.meta.env.VITE_UP_URL;
const recaptcha = import.meta.env.VITE_RECAPTCHA;

const config = {
  url,
  port: 3000,
  s3SubFolder,
  dlUrl: `${url}dl/`,
  api: `${url}api/`,
  up: upUrl,
  maps: 'AIzaSyDE8Prt4OybzNNxo1MzIn1XYNGxm9rI8Zk',
  recaptcha,
  maxUploadSize: 10485760,
  s3Url: `https://space.elma.online/${s3SubFolder}`,
  routerDevTools: false,
  queryDevTools: false,
};

export default config;
