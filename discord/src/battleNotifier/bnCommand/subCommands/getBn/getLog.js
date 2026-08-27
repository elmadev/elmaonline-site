import { format } from 'date-fns';
import Discord from 'discord.js';
import Logger from '../../../../logger.js';

const getErrorMessage = input =>
  `Could not find a log for date: ${input}.\nPass in the date as an argument to \`!bn get log\` with the format 'yyyy-MM-dd'\nWithout any argument it will get today's log by default.`;

const getLog = async ({ user, date }) => {
  const dateString = date || format(new Date(), 'yyyy-MM-dd');
  try {
    const embed = new Discord.MessageEmbed()
      .setTitle(`Log file for date: ${dateString}`)
      .attachFiles([Logger.getFilePath(dateString)]);
    await user.send(embed);
  } catch (error) {
    await user.send(getErrorMessage(dateString));
  }
};

export default getLog;
