import { authContext } from '#utils/auth';

export default function requireMod(req, res, next) {
  const auth = authContext(req);
  if (!auth.mod) {
    return res.sendStatus(401);
  }
  return next();
}
