import Discord from 'discord.js';
import moment from 'moment';
import { forEach } from 'lodash';
import config from '../config';

const client = new Discord.Client();

export function discord() {
  client.once('ready', () => {
    client.user.setPresence({
      status: 'online',
      game: {
        name: 'Elma Online',
        type: 'WATCHING',
        url: config.discord.url,
      },
    });
  });
  if (config.discord.token) {
    client.login(config.discord.token);
  }
  client.on('disconnect', event => {
    // eslint-disable-next-line no-console
    console.log('Discord disconnect:');
    // eslint-disable-next-line no-console
    console.log(event);
    client.login(config.discord.token);
  });
}

export function sendMessage(channel, message) {
  if (config.discord.token) {
    client.channels.get(channel).send(message);
  }
}

const alignPlacement = no => {
  if (no < 10) {
    return ` ${no}`;
  }
  return no;
};

const alignKuski = (kuski, kuski2) => {
  let trailingSpaces = 16 - kuski.length;
  if (kuski2) {
    trailingSpaces = 32 - kuski.length - kuski2.length;
  }
  let alignedKuski = kuski;
  if (kuski2) {
    alignedKuski = `${kuski} & ${kuski2}`;
  }
  while (trailingSpaces > 0) {
    alignedKuski += ' ';
    trailingSpaces -= 1;
  }
  return alignedKuski;
};

const alignTime = time => {
  let leadingSpaces = 10 - time.length;
  let alignedTime = time;
  while (leadingSpaces > 0) {
    alignedTime = ` ${alignedTime}`;
    leadingSpaces -= 1;
  }
  return alignedTime;
};

const formatLevel = level => {
  if (
    level.substring(0, 6) === 'QWQUU0' &&
    parseInt(level.substring(6, 8), 10) <= 55
  ) {
    return `Internal ${level.substring(6, 8)}`;
  }
  return `${level}.lev`;
};

const battleIn = (type, level) => {
  let battletype = '';
  if (type !== 'normal') {
    battletype = `${type
      .toLowerCase()
      .replace(/(^| )(\w)/g, s => s.toUpperCase())} `;
  }
  if (type === '1 hour tt') {
    return `1 Hour TT Battle`;
  }
  return `${battletype}Battle in ${formatLevel(level)}`;
};

const cripple = content => {
  let text = ' (';
  const cripples = {
    noVolt: 'no-volt',
    noTurn: 'no-turn',
    oneTurn: 'one-turn',
    noBrake: 'no-brake',
    noThrottle: 'no-throttle',
    alwaysThrottle: 'always throttle',
    oneWheel: 'one-wheel',
    drunk: 'drunk',
    multi: 'multi',
  };
  forEach(cripples, (typeText, type) => {
    if (content[type]) {
      text += `${typeText}, `;
    }
  });
  if (text.length > 2) {
    text = text.substring(0, text.length - 2);
    text += ')';
    return text;
  }
  return '';
};

export function discordChatline(content) {
  const ts = moment(content.timestamp, 'YYYY-MM-DD HH:mm:ss UTC').format(
    'HH:mm:ss',
  );
  sendMessage(
    config.discord.channels.battle,
    `[${ts}] (${content.kuski}): ${content.chatline}`,
  );
}

export function discordBesttime(content) {
  if (!content.battleIndex) {
    let text = `${formatLevel(content.level)}:`;
    text += ` ${content.time} by ${content.kuski} (${content.position}.)`;
    if (content.position === 1) {
      text += ' :first_place:';
    }
    sendMessage(config.discord.channels.times, text);
  }
}

export function discordBestmultitime(content) {
  if (!content.battleIndex) {
    sendMessage(
      config.discord.channels.times,
      `${formatLevel(content.level)}: ${content.time} (M) by ${
        content.kuski1
      } & ${content.kuski2} (${content.position}.)`,
    );
  }
}

export function discordBattlestart(content) {
  let text = `${config.discord.icons.started} **`;
  text += battleIn(content.battleType, content.level);
  text += `${cripple(content)} started by ${content.designer},`;
  text += ` ${content.durationMinutes} mins**\n`;
  text += `More info <${config.discord.url}battles/${content.battleIndex}>`;
  sendMessage(config.discord.channels.battle, text);
}

export function discordBattlequeue(content) {
  if (content.queue.length > 0) {
    let text = `${config.discord.icons.queue} **Queue:`;
    content.queue.map(q => {
      text += ` ${q.durationMinutes} mins ${q.battleType} by ${q.designer},`;
      return q;
    });
    text = text.substring(0, text.length - 1);
    text += '**';
    sendMessage(config.discord.channels.battle, text);
  } else if (content.updateReason === 'aborted from queue') {
    sendMessage(
      config.discord.channels.battle,
      `${config.discord.icons.queue} **Queue is now empty**`,
    );
  }
}

export function discordBattleEnd(content) {
  if (content.aborted) {
    let text = `${config.discord.icons.ended} **`;
    text += `${battleIn(content.battleType, content.level)}${cripple(
      content,
    )} aborted**`;
    sendMessage(config.discord.channels.battle, text);
  }
}

export function discordBattleresults(content) {
  let text = `${config.discord.icons.results} **`;
  text += battleIn(content.battleType, content.level);
  text += `${cripple(content)} by ${content.designer} over**\n`;
  text += `More info: <${config.discord.url}/battles/${content.battleIndex}>`;
  text += '```\n';
  content.results.map(r => {
    text += `${alignPlacement(r.position)}. `;
    if (content.multi) {
      text += `${alignKuski(r.kuski1, r.kuski2)} ${alignTime(r.time)}\n`;
    } else {
      text += `${alignKuski(r.kuski)} ${alignTime(r.time)}\n`;
    }
    return r;
  });
  text += '```\n';
  sendMessage(config.discord.channels.battle, text);
}
