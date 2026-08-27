module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:      A bug fix' },
    { value: 'docs', name: 'docs:     Documentation only changes' },
    {
      value: 'style',
      name: 'style:    Markup, white-space, formatting, missing semi-colons',
    },
    {
      value: 'refactor',
      name: 'refactor: A code change that neither fixes a bug or adds a feature',
    },
    { value: 'test', name: 'test:     Adding missing tests' },
    {
      value: 'chore',
      name: 'chore:    Build process or auxiliary tool changes',
    },
  ],

  scopes: [
    { name: 'other' },
    { name: 'deps' },
    { name: 'config' },
    { name: 'ui' },
    { name: 'home' },
    { name: 'battles' },
    { name: 'cups' },
    { name: 'levels' },
    { name: 'levelpacks' },
    { name: 'kuskis' },
    { name: 'search' },
    { name: 'chat' },
    { name: 'login' },
    { name: 'replays' },
    { name: 'teams' },
    { name: 'settings' },
    { name: 'help' },
    { name: 'ranking' },
    { name: 'admin' },
  ],

  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: '',
  ticketNumberRegExp: '',

  messages: {
    type: "Select the type of change that you're committing:",
    scope: '\nDenote the SCOPE of this change:',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject: 'Write a short, imperative tense description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer: 'List any ISSUES CLOSED by this change (optional). E.g.: #31:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },
  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['body', 'customScope', 'breaking'],
  subjectLimit: 100,
  footerPrefix: 'Closes:',
};
