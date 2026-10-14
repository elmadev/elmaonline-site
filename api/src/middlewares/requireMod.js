import { authRights } from '#utils/auth';

// only lets mods through, rights are checked against the database
// the auth context with mod and admin rights is available as req.auth
export default async function requireMod(req, res, next) {
  const auth = await authRights(req);
  if (!auth.mod) {
    return res.sendStatus(401);
  }
  req.auth = auth;
  return next();
}
