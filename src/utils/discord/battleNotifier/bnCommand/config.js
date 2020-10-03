module.exports = {
  emojis: {
    ok: '✅',
    error: '❌',
    notFound: '❓',
  },
  keywords: {
    any: 'any',
    ignore: 'ignore',
    separator: ' by ',
    levelPatternSuffix: '.lev',
  },
  bnAdminIds: ['219518470767902722'],
  messages: {
    configNotFound:
      'You have no notifications set yet, please write `!bn` to start receiving battle notifications.',
    seeAvailableCommands: 'Write `!bn help` to see the available commands.',
    somethingWentWrong:
      'Something went wrong, please try again (write the command again).',
    userConfigFormat:
      'In each line you can match the battle type, attributes, duration, level name and designer with the following format:\n```Battle types, level names ending in .lev (battle attributes between parentheses) >xx <xx by designers```',
  },
};
