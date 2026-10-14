// restricted characters break urls, replay file names on windows and eolconf
const teamForbidden = /[/\\?$%#]/;
const kuskiForbidden = /[/\\?$%#<>:"|*]|[^\x20-\x7E]/;

export const validKuski = nick => !kuskiForbidden.test(nick);

export const validTeam = team => !teamForbidden.test(team);

export const kuskiCharsMessage =
  'Nick contains invalid characters. Only ASCII characters are allowed, excluding / \\ ? $ % # < > : " | *';

export const teamCharsMessage =
  'Team contains invalid characters. The following are not allowed: / \\ ? $ % #';
