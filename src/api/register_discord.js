import express from 'express';
import { authContext } from 'utils/auth';
import OAuthClient from 'disco-oauth';
import { Setting } from '../data/models';
import config from '../config';

const router = express.Router();
const client = new OAuthClient(
  config.discord.clientId,
  config.discord.clientSecret,
);

router
  .post('/', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      client.setRedirect(`${req.body.url}/settings/notifications`);
      client.setScopes('identify');
      const url = client.auth;
      res.json({ url: url.link });
    } else {
      res.sendStatus(401);
    }
  })
  .post('/code', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      try {
        const key = await client.getAccess(req.body.code);
        const user = await client.getUser(key);
        await Setting.upsert({
          KuskiIndex: auth.userid,
          DiscordId: user.id,
          DiscordTag: user.tag,
          DiscordUrl: user.avatarUrl(512),
        });
        res.json({
          id: user.id,
          tag: user.tag,
          avatarUrl: user.avatarUrl(512),
        });
      } catch (error) {
        res.json({ user: null, error });
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/remove', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      await Setting.update(
        {
          DiscordId: 0,
          DiscordTag: null,
          DiscordUrl: null,
        },
        { where: { KuskiIndex: auth.userid } },
      );
      res.json({ success: 1 });
    } else {
      res.sendStatus(401);
    }
  });

export default router;
