const replyTimeout = 120000;

class TimeOutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeOutError';
  }
}

const readUserMessage = async ({ channel, user }) => {
  const sameAuthorFilter = msg => user.id === msg.author.id;

  try {
    const messages = await channel.awaitMessages(sameAuthorFilter, {
      time: replyTimeout,
      maxMatches: 1,
      errors: ['time'],
    });
    return messages.first();
  } catch (error) {
    throw new TimeOutError('⏳ Time ran out, please try again.');
  }
};

module.exports = readUserMessage;
module.exports.TimeOutError = TimeOutError;
