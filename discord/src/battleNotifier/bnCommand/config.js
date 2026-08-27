export const emojis = {
  ok: '✅',
  error: '❌',
  notFound: '❓',
};

export const keywords = {
  any: 'any',
  ignore: 'ignore',
  separator: ' by ',
  levelPatternSuffix: '.lev',
};

export const bnAdminIds = ['219518470767902722'];

export const messages = {
  configNotFound:
    'You have no notifications set yet, please write `!bn` to start receiving battle notifications.',
  seeAvailableCommands: 'Write `!bn help` to see the available commands.',
  somethingWentWrong:
    'Something went wrong, please try again (write the command again).',
  userConfigFormat:
    'In each line you can match battle types, level names, attributes, duration and designers with the following format:\n```Battle types, level names ending in .lev (battle attributes between parentheses) >xx <xx by designers```',
  userConfigExample:
    'Example\n```Normal, First Finish, Flag Tag by any\nApple (see others, drunk) by Pab, Markku, Sla\nAny Pob.lev, jbl.lev >20 by any\nIgnore any by Grob```',
};
