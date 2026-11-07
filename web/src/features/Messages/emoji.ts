// :name: shortcodes for emojis
type Shortcodes = [string, string][];

let shortcodes: Promise<Shortcodes> | null = null;

export const loadShortcodes = () => {
  if (!shortcodes) {
    shortcodes = import('virtual:emoji-shortcodes').then(m => m.default);
  }
  return shortcodes;
};

export type ShortcodeMatch = { name: string; emoji: string };

const maxSuggestions = 8;

export const findShortcodes = (
  list: Shortcodes,
  query: string,
  recent: string[],
): ShortcodeMatch[] => {
  const q = query.toLowerCase();
  const rank = ([name, emoji]: [string, string]) => {
    const recentIndex = recent.indexOf(emoji);
    return [
      name.startsWith(q) ? 0 : 1,
      recentIndex === -1 ? recent.length : recentIndex,
    ];
  };
  const seen = new Set<string>();
  return list
    .filter(([name]) => name.includes(q))
    .map(entry => ({ entry, rank: rank(entry) }))
    .sort((a, b) => a.rank[0] - b.rank[0] || a.rank[1] - b.rank[1])
    .filter(({ entry }) => {
      if (seen.has(entry[1])) {
        return false;
      }
      seen.add(entry[1]);
      return true;
    })
    .slice(0, maxSuggestions)
    .map(({ entry: [name, emoji] }) => ({ name, emoji }));
};

export const findExactShortcode = (list: Shortcodes, name: string) =>
  list.find(([n]) => n === name.toLowerCase())?.[1];

export const shortcodeAtCursor = (text: string, cursor: number) => {
  const match = /(^|\s):([a-z0-9_+-]{2,})(:?)$/i.exec(text.slice(0, cursor));
  if (!match) {
    return null;
  }
  const start = match.index + match[1].length;
  return { start, query: match[2], closed: match[3] === ':' };
};
