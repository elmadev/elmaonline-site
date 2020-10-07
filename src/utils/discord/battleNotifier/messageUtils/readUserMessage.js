const replyMinutes = 5;
const replyTimeout = replyMinutes * 60 * 1000;

class TimeOutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeOutError';
  }
}

const readUserMessage = channel => async user => {
  const sameAuthorFilter = msg => user.id === msg.author.id;

  try {
    const messages = await channel.awaitMessages(sameAuthorFilter, {
      time: replyTimeout,
      max: 1,
      errors: ['time'],
    });
    return messages.first();
  } catch (error) {
    throw new TimeOutError(
      `⏳ You took to long to reply to this message, please write the same command again and reply in under ${replyMinutes} minutes.`,
    );
  }
};

module.exports = readUserMessage;
module.exports.TimeOutError = TimeOutError;
