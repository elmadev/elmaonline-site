const onlineWindow = 3 * 60; // last 3 min
const awayWindow = 60 * 60; // last hour

export const onlineStatus = LastActive => {
  if (!LastActive) {
    return null;
  }
  const seconds = Math.floor(Date.now() / 1000) - LastActive;
  if (seconds < onlineWindow) {
    return 'online';
  }
  if (seconds < awayWindow) {
    return 'away';
  }
  return null;
};

export const withOnlineStatus = kuski => {
  if (!kuski) {
    return kuski;
  }
  const { LastActive, ...rest } = kuski;
  return { ...rest, OnlineStatus: onlineStatus(LastActive) };
};
