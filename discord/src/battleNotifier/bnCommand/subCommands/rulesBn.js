import { messages } from '../config.js';

const rulesMessage = `Always write one line per rule, use \`!bn\` to set your notifications.

${messages.userConfigFormat}
${messages.userConfigExample}
Always use the word "by" to separate designers from everything else.

**Ignore (optional).** Write "Ignore" at the beginning of a line to ignore (blacklist) that specific rule.

**Battle types.** Match battle types or write the word "any" to indicate "any battle types".\nCheck \`!bn alias\` to see all possible values.

**Level names.** Match level names starting with a specified text, use this format: \`text.lev\`.\nCan use regular expression to match complex patterns.

**Battle attributes.** Match any number of battle attributes between parentheses.\nCheck \`!bn alias\` to see all possible values.

**Battle duration.** Write the great than (>) or less than (<) symbol, followed by a number\nto respectively match battles minimum and maximum duration in minutes.

**Designers.** Match designers (EOL names) or write the word "any" to indicate "any designer".

Tips:
- You can always separate the values with comma or spaces.
- To ignore your own battles set the following rule: \`Ignore any by [your EOL name here]\``;

const rulesBn = async user => {
  await user.send(rulesMessage);
};

export default rulesBn;
