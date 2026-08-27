import config from 'config';
import { authToken } from 'utils/nick';
import { toPairs, orderBy } from 'lodash';
import { create } from 'apisauce';

export const downloadWithAuth = async (path, filename, mime) => {
  const res = await fetch(`${config.dlUrl}${path}`, {
    method: 'GET',
    headers: {
      Authorization: authToken(),
    },
  });
  const blob = await res.blob();
  const zipBlob = new Blob([blob], { type: mime });
  const objectUrl = window.URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  link.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(objectUrl);
  }, 250);
};

export const camelToTitleCase = text => {
  if (typeof text !== 'string') {
    return '';
  }
  const t = text.replace(/([A-Z])/g, ' $1').trim();
  return `${t.charAt(0).toUpperCase()}${t.slice(1)}`;
};

export const stripSpace = text => {
  if (typeof text === 'string') {
    return text.replace(/\s/g, '').trim();
  }
  return '';
};

export const alphaNumeric = text => {
  if (typeof text === 'string') {
    return text.replace(/[^0-9a-z]/gi, '');
  }
  return '';
};

export const pluralize = (count = 0, noun = '', suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`;

// returns the values of obj, sorted by the objects keys.
export const getOrderedValues = obj => {
  return orderBy(toPairs(obj), [p => p[1]], ['desc']).map(p => p[1]);
};

export const renameFile = (originalFile, newName) => {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
};

export const createRecName = (LevelName, nick, recTime, apple = false) => {
  let timeAsString = `${recTime}`;
  if (apple) {
    if (recTime === 9999100 || recTime === 10000000) {
      timeAsString = '0ap';
    }
    if (recTime >= 999900 && recTime <= 999999) {
      timeAsString = `${1000000 - recTime}ap`;
    }
    if (recTime >= 9999000 && recTime <= 9999999) {
      timeAsString = `${10000000 - recTime}ap`;
    }
  }
  const levName =
    LevelName.substring(0, 6) === 'QWQUU0'
      ? LevelName.substring(6, 8)
      : LevelName;
  return `${levName}${nick.substring(
    0,
    Math.min(15 - (levName.length + timeAsString.length), 4),
  )}${timeAsString}.rec`;
};

export const downloadRec = (url, levName, kuski, time) => {
  const newName = createRecName(levName, kuski, time);

  const api = create({
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    responseType: 'blob',
  });
  api.get(url).then(response => {
    const a = document.createElement('a');
    const tempUrl = window.URL.createObjectURL(response.data);
    a.href = tempUrl;
    a.download = newName;
    a.click();
  });
};

export const highlightTime = (time, level, isMedalsTargets) => {
  let colors = [
    '#aa43dd',
    '#ff66cc',
    '#ff9c00',
    '#b3aa00',
    '#00b300',
    '#0090ff',
    '#e2e77e',
    '',
  ];
  if (isMedalsTargets) {
    colors = ['#c9b037', '#b4b4b4', '#ad8a56', '', '', '', '', ''];
  }
  if (level.Targets) {
    const targets = level.Targets.split(',');
    let color = '';
    targets.every((target, index) => {
      if (parseInt(time) <= parseInt(target)) {
        color = colors[index];
        return false;
      }
      return true;
    });
    return color;
  }
  return '';
};

export const colorPool = [
  '#cb52e2',
  '#0075DC',
  '#993F00',
  '#005C31',
  '#2BCE48',
  '#00998F',
  '#740AFF',
  '#FF5005',
  '#ce7a26',
  '#8F7C00',
  '#9DCC00',
  '#C20088',
  '#FFA405',
  '#FFA8BB',
  '#426600',
  '#FF0010',
  '#2ec6c7',
  '#990000',
];
