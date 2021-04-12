import redis from 'redis';
import config from '../config';

const getClient = () => {
  const redisClient = redis.createClient({
    host: config.redis.host,
    password: config.redis.pass,
  });
  redisClient.on('error', error => {
    console.error(error);
  });
  return redisClient;
};

export const set = (key, value, expire = 0) => {
  try {
    const client = getClient();
    const stringValue =
      typeof value === 'object' ? JSON.stringify(value) : value;
    client.set(key, stringValue);
    if (expire) {
      client.expire(key, expire * 60);
    }
    client.quit();
    return '';
  } catch (error) {
    return { error };
  }
};

export const get = key => {
  return new Promise((resolve, reject) => {
    const client = getClient();
    client.get(key, (err, value) => {
      let objectValue = '';
      try {
        objectValue = JSON.parse(value);
      } catch (e) {
        objectValue = value;
      }
      if (err) {
        reject(err);
      } else {
        resolve(objectValue);
      }
      client.quit();
    });
  });
};
