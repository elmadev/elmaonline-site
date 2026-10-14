import express from 'express';
import { uuid } from '#utils/calcs';
import { format } from 'date-fns';
import { Team, Kuski, SiteSetting, Country } from '#data/models';
import { confirmMail, resetMail } from '#utils/email';
import {
  authContext,
  hashPassword,
  hashesMatch,
  validatePassword,
} from '#utils/auth';
import { sendMessage } from '#utils/discord';
import {
  validKuski,
  validTeam,
  kuskiCharsMessage,
  teamCharsMessage,
} from '#utils/names';
import {
  registerLimit,
  resetRequestLimit,
  codeLimit,
} from '#middlewares/rateLimit';
import Discord from './register_discord.js';
import config from '../config.js';

const router = express.Router();

const getKuskiData = async nick => {
  const data = await Kuski.scope(null).findAll({
    where: { Kuski: nick },
  });
  return data;
};

const checkEmail = async m => {
  const data = await Kuski.scope(null).findAll({
    where: { Email: m },
  });
  return data;
};

const getTeamData = async t => {
  const data = await Team.findAll({
    where: { Team: t },
  });
  return data;
};

const addKuski = async data => {
  const NewReplayComment = await Kuski.create(data);
  return NewReplayComment;
};

const createTeam = async data => {
  const newTeam = await Team.create(data);
  return newTeam;
};

const updateConfirm = async ConfirmCode => {
  let findKuski = false;
  findKuski = await Kuski.scope(null).findOne({
    where: { ConfirmCode },
  });
  if (findKuski) {
    await findKuski.update({
      ConfirmCode: '',
      Confirmed: 1,
      RPlay: 1,
      RMultiPlay: 1,
      RChat: 1,
    });
  }
  return findKuski;
};

const ResetPasswordConfirm = async (Email, ConfirmCode) => {
  let findReset = false;
  findReset = await Kuski.scope(null).findOne({
    where: { Email },
  });
  if (findReset) {
    await findReset.update({
      ConfirmCode,
    });
  }
  return findReset;
};

const UpdatePasswordConfirm = async ConfirmCode => {
  const newPassword = uuid();
  const findReset = await Kuski.scope(null).findOne({
    where: { ConfirmCode },
  });
  if (findReset) {
    let { Salt } = findReset.dataValues;
    if (!Salt) {
      Salt = uuid(32);
    }
    await findReset.update({
      ConfirmCode: '',
      Password2: hashPassword(newPassword, Salt),
      Salt,
    });
    return newPassword;
  }
  return null;
};

const validConfirmCode = c => typeof c === 'string' && /^[0-9a-z]{10}$/.test(c);
const validResetCode = c => validConfirmCode(c) && c.startsWith('rez');

const validateEmail = e => {
  const re = /\S+@\S+\.\S+/;
  return re.test(e);
};

const nickRequest = async (nick, KuskiIndex, oldNick) => {
  const r = await SiteSetting.create({
    SettingName: 'ChangeNick',
    Setting: nick,
    KuskiIndex,
  });
  sendMessage(
    config.discord.channels.admin,
    `:pencil2: New nick change request: ${oldNick} >> ${nick}`,
  );
  return r;
};

const UpdateTeam = async (TeamIndex, KuskiIndex) => {
  await Kuski.update({ TeamIndex }, { where: { KuskiIndex } });
  await SiteSetting.create({
    SettingName: 'TeamChange',
    Setting: TeamIndex,
    KuskiIndex,
    Value1: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  });
};

const UpdateEmail = async (Email, KuskiIndex) => {
  await Kuski.update({ Email }, { where: { KuskiIndex } });
};

const UpdatePassword = async (Password2, KuskiIndex, Salt) => {
  await Kuski.update({ Password2, Salt }, { where: { KuskiIndex } });
};

const UpdateLocked = async (TeamIndex, Locked) => {
  await Team.update({ Locked }, { where: { TeamIndex } });
};

const LogoUpdate = async (LogoUrl, TeamIndex) => {
  let message = '';
  let error = false;
  if (!TeamIndex) {
    message = 'You need to be in a team to update the logo.';
    error = true;
  } else if (LogoUrl.length > 155) {
    message = 'Logo filename is too long. Maximum number of characters is 155.';
    error = true;
  } else {
    const split = LogoUrl.split('/u/');
    if (split[0] === LogoUrl) {
      message = 'Invalid logo URL.';
      error = true;
    }
    const url = `https://eol.ams3.digitaloceanspaces.com/${config.s3SubFolder}files/${split[1]}`;
    await Team.update({ Logo: url }, { where: { TeamIndex } });
    message = 'Logo has been updated.';
  }
  return { message, error };
};

const Player = async KuskiIndex => {
  const data = await Kuski.findOne({
    where: { KuskiIndex },
    attributes: ['KuskiIndex', 'Kuski', 'TeamIndex', 'Country', 'Email'],
    include: [
      {
        model: Team,
        as: 'TeamData',
        attributes: ['Team', 'Locked', 'Logo'],
      },
    ],
  });
  return data;
};

// kept separate from Player so the hash is never sent in a response
const PlayerPassword = async KuskiIndex => {
  const data = await Kuski.findOne({
    where: { KuskiIndex },
    attributes: ['Password2', 'Salt'],
  });
  return data;
};

router
  .post('/', registerLimit, async (req, res) => {
    let message = '';
    let TeamIndex = 0;
    const isFilled = v => typeof v === 'string' && v.trim() !== '';
    if (
      !isFilled(req.body.Kuski) ||
      !isFilled(req.body.Password) ||
      !isFilled(req.body.Email) ||
      !isFilled(req.body.Country)
    ) {
      message = 'Mandatory field is missing.';
    } else if (req.body.Team && typeof req.body.Team !== 'string') {
      message = 'Invalid team.';
    } else if (req.body.Kuski.length > 15) {
      message = 'Nick is too long. Maximum number of characters is 15.';
    } else if (validatePassword(req.body.Password)) {
      message = validatePassword(req.body.Password);
    } else if (req.body.Team && req.body.Team.length > 9) {
      message = 'Team is too long. Maximum number of characters is 9.';
    } else if (!validKuski(req.body.Kuski)) {
      message = kuskiCharsMessage;
    } else if (req.body.Team && !validTeam(req.body.Team)) {
      message = teamCharsMessage;
    } else if (req.body.Email.length > 255) {
      message = 'Email is too long. Maximum number of characters is 255.';
    } else if (!validateEmail(req.body.Email)) {
      message = 'Invalid email address.';
    }
    if (!message) {
      const country = await Country.findByPk(req.body.Country);
      if (!country) {
        message = 'Invalid country.';
      }
    }
    if (!message) {
      const kuskiData = await getKuskiData(req.body.Kuski);
      if (kuskiData.length > 0) {
        message = 'Nickname is already taken.';
      }
    }
    if (!message) {
      const emails = await checkEmail(req.body.Email);
      if (emails.length > 0) {
        message = 'Email is already taken.';
      }
    }
    // team is created last so a failed registration doesn't leave a new team behind
    if (!message && req.body.Team) {
      const teamData = await getTeamData(req.body.Team);
      if (teamData.length > 0) {
        if (teamData[0].dataValues.Locked) {
          message = 'Team is locked';
        } else {
          TeamIndex = teamData[0].dataValues.TeamIndex;
        }
      } else {
        const addTeam = await createTeam({ Team: req.body.Team });
        TeamIndex = addTeam.TeamIndex;
      }
    }
    if (message !== '') {
      res.json({
        success: false,
        message,
      });
    } else {
      const ConfirmCode = uuid();
      const Salt = uuid(32);
      await addKuski({
        Kuski: req.body.Kuski,
        Password2: hashPassword(req.body.Password, Salt),
        Salt,
        Email: req.body.Email,
        Country: req.body.Country,
        TeamIndex,
        ConfirmCode,
      });
      await confirmMail(req.body.Kuski, req.body.Email, ConfirmCode);
      // don't return the new row, it has the password hash and confirm code
      res.json({ success: true });
    }
  })
  .use('/discord', Discord)
  .post('/confirm', codeLimit, async (req, res) => {
    if (!validConfirmCode(req.body.confirmCode)) {
      res.json({ success: false });
      return;
    }
    const confirmed = await updateConfirm(req.body.confirmCode);
    if (confirmed) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  })
  .post('/resetconfirm', resetRequestLimit, async (req, res) => {
    if (!validateEmail(req.body.Email)) {
      res.json({ success: false, message: 'Email not found' });
      return;
    }
    const resetCode = `rez${uuid(7)}`;
    const reset = await ResetPasswordConfirm(req.body.Email, resetCode);
    if (reset) {
      await resetMail(reset.Kuski, reset.Email, resetCode);
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Email not found' });
    }
  })
  .post('/reset', codeLimit, async (req, res) => {
    if (!validResetCode(req.body.confirmCode)) {
      res.json({ success: false });
      return;
    }
    const reset = await UpdatePasswordConfirm(req.body.confirmCode);
    if (reset) {
      res.json({ success: true, newPassword: reset });
    } else {
      res.json({ success: false });
    }
  })
  .post('/update', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      let message = '';
      let error = false;
      // nick
      if (req.body.Field === 'Kuski') {
        const nick = req.body.Value?.[0];
        if (typeof nick !== 'string' || nick.trim() === '') {
          message = 'Invalid nick.';
          error = true;
        } else if (nick.length > 15) {
          message = 'Nick is too long. Maximum number of characters is 15.';
          error = true;
        } else if (!validKuski(nick)) {
          message = kuskiCharsMessage;
          error = true;
        } else if ((await getKuskiData(nick)).length > 0) {
          message = 'Nickname is already taken.';
          error = true;
        } else {
          await nickRequest(req.body.Value[0], auth.userid, auth.user);
          message =
            'Nick change has been requested, now awaiting moderator approval, you will be notified.';
        }
        // team
      } else if (req.body.Field === 'Team') {
        let TeamIndex = 0;
        if (typeof req.body.Value?.[0] !== 'string') {
          message = 'Invalid team.';
          error = true;
        } else if (req.body.Value[0].length > 9) {
          message = 'Team is too long. Maximum number of characters is 9.';
          error = true;
        } else if (!validTeam(req.body.Value[0])) {
          message = teamCharsMessage;
          error = true;
        } else if (req.body.Value[0] !== '') {
          const teamData = await getTeamData(req.body.Value[0]);
          if (teamData.length > 0) {
            if (teamData[0].dataValues.Locked) {
              message = 'Team is locked';
              error = true;
            } else {
              TeamIndex = teamData[0].dataValues.TeamIndex;
            }
          } else {
            const addTeam = await createTeam({ Team: req.body.Value[0] });
            TeamIndex = addTeam.TeamIndex;
          }
        }
        if (!error) {
          await UpdateTeam(TeamIndex, auth.userid);
          message = `Team updated to ${req.body.Value[0]}`;
        }
        // logo
      } else if (req.body.Field === 'Logo') {
        const player = await Player(auth.userid);
        const updateLogo = await LogoUpdate(req.body.Value, player.TeamIndex);
        error = updateLogo.error;
        message = updateLogo.message;
        // email
      } else if (req.body.Field === 'Email') {
        if (!validateEmail(req.body.Value[0])) {
          message = 'Invalid email address.';
          error = true;
        } else {
          const emails = await checkEmail(req.body.Value[0]);
          if (emails.length > 0) {
            message = 'Email is already taken.';
            error = true;
          }
        }
        if (!error) {
          await UpdateEmail(req.body.Value[0], auth.userid);
          message = `Email updated to ${req.body.Value[0]}`;
        }
        // password
      } else if (req.body.Field === 'Password') {
        const playerInfo = await PlayerPassword(auth.userid);
        let { Salt } = playerInfo;
        if (!Salt) {
          Salt = uuid(32);
        }
        const [oldPassword, newPassword, newPasswordAgain] = Array.isArray(
          req.body.Value,
        )
          ? req.body.Value
          : [];
        if (
          typeof oldPassword !== 'string' ||
          !hashesMatch(hashPassword(oldPassword, Salt), playerInfo.Password2)
        ) {
          message = 'Old password does not match.';
          error = true;
        } else if (validatePassword(newPassword)) {
          message = validatePassword(newPassword);
          error = true;
        } else if (newPassword !== newPasswordAgain) {
          message = 'Password again does not match.';
          error = true;
        }
        if (!error) {
          await UpdatePassword(
            hashPassword(newPassword, Salt),
            auth.userid,
            Salt,
          );
          message = 'Password has been updated.';
        }
        // team lock
      } else if (req.body.Field === 'Locked') {
        const playerInfo = await Player(auth.userid);
        await UpdateLocked(playerInfo.TeamIndex, req.body.Value[0]);
        if (req.body.Value[0]) {
          message = 'Team has been locked.';
        } else {
          message = 'Team has been unlocked.';
        }
      }
      if (error) {
        res.json({ success: 0, message });
      } else {
        const info = await Player(auth.userid);
        res.json({ success: 1, info, message });
      }
    } else {
      res.sendStatus(401);
    }
  });

export default router;
