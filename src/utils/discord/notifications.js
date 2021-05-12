function notifMessage(type, meta, url) {
  let text = '';
  if (type === 'comment') {
    text = `${meta.kuski} added a comment to your replay: "${
      meta.Text
    }" <${url}r/${meta.replayUUID}/${meta.replayName.replace('.rec', '')}>`;
  }
  if (type === 'beaten') {
    text = `${meta.kuski} crushed your record in level ${meta.level} <${url}levels/${meta.levelIndex}>`;
  }
  if (type === 'besttime') {
    text = `[`;
    meta.levPacks.forEach((pack, index) => {
      text = `${text}${pack.LevelPackName}`;
      text = `${text}${meta.levPacks.length > index + 1 && ', '}`;
    });
    text = `${text}] ${meta.kuski} got record in level ${meta.level} with time ${meta.time} <${url}levels/${meta.levelIndex}>`;
  }
  return text;
}

module.exports = notifMessage;
