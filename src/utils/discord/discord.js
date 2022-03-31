const Discord = require('discord.js');
const bbcode2Markdown = require('bbcode-to-markdown');
const moment = require('moment');
const { forEach } = require('lodash');
const config = require('../../config');
const createBN = require('./battleNotifier');
const logger = require('./logger');
const notifMessage = require('./notifications');

const client = new Discord.Client();

const isProdEnv = process.env.NODE_ENV === 'production';
const { storePath, logsPath, fallbackChannelId } = config.discord.bn;

const bnStorePath = isProdEnv ? storePath : './bn/bn.store.json';
const battleNotifier = createBN({ bnStorePath, client, fallbackChannelId });

const bnLogsPath = isProdEnv ? logsPath : './bn/';
logger.initialize(bnLogsPath);

function discord() {
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
  client.on('disconnect', () => {
    if (config.discord.token) {
      client.user.setPresence({
        status: 'online',
        game: {
          name: 'Elma Online',
          type: 'WATCHING',
          url: config.discord.url,
        },
      });
      client.login(config.discord.token);
    }
  });
}

function sendMessage(channel, message) {
  if (config.discord.token) {
    client.channels.cache.get(channel).send(message);
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

const levelIsInternal = level => {
  return (
    level.substring(0, 6) === 'QWQUU0' &&
    parseInt(level.substring(6, 8), 10) <= 55
  );
};

const formatLevel = level => {
  if (levelIsInternal(level)) {
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

const extraRules = content => {
  let text = ' (';
  if (content.seeOthers) {
    text += 'others shown, ';
  }
  if (!content.seeTimes) {
    text += 'times hidden, ';
  }
  if (content.acceptBugs) {
    text += 'bugs allowed, ';
  }
  if (text.length > 2) {
    text = text.substring(0, text.length - 2);
    text += ')';
    return text;
  }
  return '';
};

function discordChatline(content) {
  const ts = moment(content.timestamp, 'YYYY-MM-DD HH:mm:ss UTC').format(
    'HH:mm:ss',
  );
  sendMessage(
    config.discord.channels.battle,
    `[${ts}] (${content.kuski}): ${content.chatline}`,
  );
}

function discordBesttime(content) {
  if (!content.battleIndex) {
    let text = '';

    if (levelIsInternal(content.level)) {
      text += `**${formatLevel(content.level)}**:`;
    } else {
      text += `${formatLevel(content.level)}:`;
    }

    text += ` ${content.time} by ${content.kuski} (${content.position}.)`;

    if (content.position === 1) {
      text += ' :first_place:';
    }

    sendMessage(config.discord.channels.times, text);
  }
}

function discordBestmultitime(content) {
  if (!content.battleIndex) {
    sendMessage(
      config.discord.channels.times,
      `${formatLevel(content.level)}: ${content.time} (M) by ${
        content.kuski1
      } & ${content.kuski2} (${content.position}.)`,
    );
  }
}

const battleToString = battle => {
  let text = `${config.discord.icons.started} **`;
  text += battleIn(battle.battleType, battle.level);
  text += `${cripple(battle)} started by ${battle.designer},`;
  text += ` ${battle.durationMinutes} mins${extraRules(battle)}**\n`;
  text += `More info: <${config.discord.url}battles/${battle.battleIndex}>`;
  return text;
};

async function discordBattlestart(content) {
  const battleString = battleToString(content);
  sendMessage(config.discord.channels.battle, battleString);

  try {
    await battleNotifier.notifyBattle(content, battleString);
  } catch (error) {
    logger.log({
      action: 'discord-notify-battle',
      message: error.message || error,
      stack: error.stack,
    });
  }
}

function discordBattlequeue(content) {
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

function discordBattleEnd(content) {
  if (content.aborted) {
    let text = `${config.discord.icons.ended} **`;
    text += `${battleIn(content.battleType, content.level)}${cripple(
      content,
    )} aborted**`;
    sendMessage(config.discord.channels.battle, text);
  }
}

function discordBattleresults(content) {
  let text = `${config.discord.icons.results} **`;
  text += battleIn(content.battleType, content.level);
  text += `${cripple(content)} by ${content.designer} over**\n`;
  text += `More info: <${config.discord.url}battles/${content.battleIndex}>`;
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

/* Notifications */

const discordNotification = async (userId, type, meta) => {
  let user;
  try {
    user = await client.users.fetch(userId);
    let text = null;
    if (type === 'news') {
      text = new Discord.MessageEmbed()
        .setTitle(meta.Headline)
        .setURL(config.discord.url)
        .setDescription(bbcode2Markdown(meta.text))
        .setFooter(`News article posted by ${meta.kuski}`);
    } else {
      text = notifMessage(type, meta, config.discord.url);
    }
    if (text) {
      await user.send(text);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

/* Battle Notifier */

const spacesRegexp = / +/;

const parseUserMessage = ({ message, commandPrefix }) => {
  const args = message.content
    .slice(commandPrefix.length)
    .trim()
    .split(spacesRegexp);
  const commandName = args.shift().toLowerCase();
  return { commandName, args };
};

client.on('message', async message => {
  const commandPrefix = config.discord.prefix;
  const isPrefixedMessage = message.content.startsWith(commandPrefix);
  const isBotMessage = message.author.bot;
  if (!isPrefixedMessage || isBotMessage) return;

  const { commandName, args } = parseUserMessage({ message, commandPrefix });

  if (commandName !== battleNotifier.commandName) return;

  try {
    await battleNotifier.handleMessage({ message, args });
  } catch (error) {
    message.reply('There was an error trying to execute that command!');
    logger.log({
      userName: message.author.username,
      userId: message.author.id,
      action: commandName,
      message: error.message || error,
      stack: error.stack,
    });
  }
});

module.exports = {
  discord,
  sendMessage,
  discordChatline,
  discordBesttime,
  discordBestmultitime,
  discordBattlestart,
  discordBattlequeue,
  discordBattleEnd,
  discordBattleresults,
  discordNotification,
};
