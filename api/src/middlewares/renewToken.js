import { renewedToken } from '#utils/auth';

export const renewedTokenHeader = 'X-Renewed-Token';

// sends a renewed token with the response when the current one is due for
// renewal, the web client swaps it in so active users stay logged in
export default function renewToken(req, res, next) {
  const token = renewedToken(req);
  if (token) {
    res.set(renewedTokenHeader, token);
  }
  next();
}
