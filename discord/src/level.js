import { MessageEmbed } from 'discord.js';
import axios from 'axios';

// Regular expression to capture an ID from a specific URL format
const urlPattern = /https?:\/\/elma\.online\/levels\/(\d+)/;

// Internal level IDs array
const ints = [
  0, 2, 4, 5, 6, 7, 8, 9, 10, 15, 59, 78, 109, 139, 219, 71, 51, 165, 57, 128,
  197, 43, 107, 98, 100, 175, 192, 38, 198, 31, 16, 18, 164, 66, 131, 156, 357,
  45, 13, 408, 412, 24, 416, 415, 95, 29, 33, 46, 21, 52, 257, 135, 133, 413,
  17, 39,
];

async function fetchLevel(levelId) {
  const apiUrl = `https://api.elma.online/api/level/${levelId}`;
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    return null;
  }
}

async function createLevelEmbed(levelId, level, customTitle = null) {
  const imageUrl = `https://api.elma.online/api/level/${levelId}.png`;
  const title = customTitle || `${level.LevelName}.lev - ${level.LongName}`;
  const embed = new MessageEmbed()
    .setColor(0x0099ff)
    .setTitle(title)
    .setImage(imageUrl)
    .setURL(`https://elma.online/levels/${levelId}`);
  return embed;
}

// Event listener for messages
const levelMessage = async message => {
  // Ignore messages from the bot itself
  if (message.author.bot) return;

  // Check if the message contains a URL matching the pattern
  const match = message.content.match(urlPattern);

  if (match) {
    const levelId = match[1]; // Extracted level ID from the URL

    // Fetch data from the API based on the ID
    const level = await fetchLevel(levelId);

    if (level) {
      // Create an embed message using the shared utility
      const embed = await createLevelEmbed(levelId, level);

      // Send the embedded message to the channel
      await message.channel.send(embed);
    } else {
      await message.channel.send('Could not retrieve data for this URL.');
    }
  }
};

// Internal level command handler
const intLevelMessage = async message => {
  // Ignore messages from the bot itself
  if (message.author.bot) return;

  // Check if the message starts with "!int"
  if (message.content.startsWith('!int ')) {
    const args = message.content.slice(5).trim().split(/\s+/);
    const intNumber = parseInt(args[0], 10);

    // Check if the number is valid (1-55)
    if (isNaN(intNumber) || intNumber < 1 || intNumber > 55) {
      return;
    }

    // Get the level ID from the ints array
    const levelId = ints[intNumber];

    if (levelId === undefined) {
      return;
    }

    // Fetch level data
    const level = await fetchLevel(levelId);

    if (level) {
      // Create an embed message using the shared utility
      const embed = await createLevelEmbed(
        levelId,
        level,
        `Internal ${intNumber} - ${level.LongName}`,
      );

      // Send the embedded message to the channel
      await message.channel.send(embed);
    } else {
      await message.reply('Could not retrieve data for this internal level.');
    }
  }
};

export {
  fetchLevel,
  createLevelEmbed,
  urlPattern,
  intLevelMessage,
  levelMessage,
};
