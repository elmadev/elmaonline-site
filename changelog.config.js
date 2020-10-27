module.exports = {
  disableEmoji: true,
  list: ['feat', 'fix', 'test', 'chore', 'docs', 'refactor', 'style'],
  maxMessageLength: 64,
  minMessageLength: 3,
  questions: ['type', 'scope', 'subject', 'issues'],
  scopes: [
    '',
    'other',
    'deps',
    'home',
    'battles',
    'cups',
    'levels',
    'levelpacks',
    'kuskis',
    'search',
    'login',
    'replays',
    'teams',
    'editor',
    'map',
    'settings',
    'help',
    'ranking',
    'config',
    'ui',
  ],
  types: {
    chore: {
      description: 'Build process or auxiliary tool changes',
      value: 'chore',
    },
    docs: {
      description: 'Documentation only changes',
      value: 'docs',
    },
    feat: {
      description: 'A new feature',
      value: 'feat',
    },
    fix: {
      description: 'A bug fix',
      value: 'fix',
    },
    refactor: {
      description: 'A code change that neither fixes a bug or adds a feature',
      value: 'refactor',
    },
    style: {
      description: 'Markup, white-space, formatting, missing semi-colons...',
      value: 'style',
    },
    test: {
      description: 'Adding missing tests',
      value: 'test',
    },
  },
};
