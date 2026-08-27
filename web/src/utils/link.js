import config from 'config';

export const getReplayLink = replay => {
  let link = '';
  let type = 'replay';
  if (replay.UUID.substring(0, 5) === 'local') {
    link = `${config.url}temp/${replay.UUID}-${replay.RecFileName}`;
  } else if (replay.UUID.substring(0, 2) === 'c-') {
    link = `${config.dlUrl}cupreplay/${replay.UUID.split('-')[1]}/${
      replay.RecFileName
    }`.replace('.rec', '');
    type = 'cup';
  } else if (replay.UUID.substring(0, 2) === 'b-') {
    link = `${config.dlUrl}battlereplay/${replay.UUID.split('-')[1]}`;
    type = 'winner';
  } else if (replay.UUID.includes('_')) {
    const [UUID, MD5, TimeIndex] = replay.UUID.split('_');
    link = `${config.s3Url}time/${UUID}-${MD5}/${TimeIndex}.rec`;
    type = 'timefile';
  } else {
    link = `${config.s3Url}replays/${replay.UUID}/${replay.RecFileName}`;
  }
  return { link, type };
};

export const getLgrLink = lgr => {
  return `${config.s3Url}lgr/${lgr.FileLink}`;
};

export const getLgrPreviewLink = lgr => {
  return `${config.s3Url}lgr/${lgr.PreviewLink}`;
};
