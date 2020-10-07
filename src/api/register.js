import express from 'express';
import { uuid } from 'utils/calcs';
import crypto from 'crypto';
import { Team, Kuski, SiteSetting } from 'data/models';
import { confirmMail, resetMail } from 'utils/email';
import { authContext } from 'utils/auth';

const router = express.Router();

const getKuskiData = async nick => {
  const data = await Kuski.findAll({
    where: { Kuski: nick },
  });
  return data;
};

const checkEmail = async m => {
  const data = await Kuski.findAll({
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
  findKuski = await Kuski.findOne({
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
  findReset = await Kuski.findOne({
    where: { Email },
  });
  if (findReset) {
    await findReset.update({
      ConfirmCode,
    });
  }
  return findReset;
};

const UpdatePasswordConfirm = async (ConfirmCode, Password) => {
  let findReset = false;
  findReset = await Kuski.findOne({
    where: { ConfirmCode },
  });
  if (findReset) {
    await findReset.update({
      ConfirmCode: '',
      Password,
    });
  }
  return findReset;
};

const validateEmail = e => {
  const re = /\S+@\S+\.\S+/;
  return re.test(e);
};

const nickRequest = async (nick, KuskiIndex) => {
  const r = await SiteSetting.create({
    SettingName: 'ChangeNick',
    Setting: nick,
    KuskiIndex,
  });
  return r;
};

const UpdateTeam = async (TeamIndex, KuskiIndex) => {
  await Kuski.update({ TeamIndex }, { where: { KuskiIndex } });
};

const UpdateEmail = async (Email, KuskiIndex) => {
  await Kuski.update({ Email }, { where: { KuskiIndex } });
};

const UpdatePassword = async (Password, KuskiIndex) => {
  await Kuski.update({ Password }, { where: { KuskiIndex } });
};

const UpdateLocked = async (TeamIndex, Locked) => {
  await Team.update({ Locked }, { where: { TeamIndex } });
};

const Player = async KuskiIndex => {
  const data = await Kuski.findOne({
    where: { KuskiIndex },
    attributes: [
      'KuskiIndex',
      'Kuski',
      'TeamIndex',
      'Country',
      'Email',
      'Password',
    ],
    include: [
      {
        model: Team,
        as: 'TeamData',
        attributes: ['Team', 'Locked'],
      },
    ],
  });
  return data;
};

router
  .post('/', async (req, res) => {
    let message = '';
    let TeamIndex = 0;
    const kuskiData = await getKuskiData(req.body.Kuski);
    if (kuskiData.length > 0) {
      message = 'Nickname is already taken.';
    }
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
    if (!message) {
      if (!validateEmail(req.body.Email)) {
        message = 'Invalid email address.';
      }
    }
    if (!message) {
      const emails = await checkEmail(req.body.Email);
      if (emails.length > 0) {
        message = 'Email is already taken.';
      }
    }
    if (message !== '') {
      res.json({
        success: false,
        message,
      });
    } else {
      const ConfirmCode = uuid();
      const data = await addKuski({
        Kuski: req.body.Kuski,
        Password: crypto
          .createHash('md5')
          .update(req.body.Password)
          .digest('hex'),
        Email: req.body.Email,
        Country: req.body.Country,
        TeamIndex,
        ConfirmCode,
      });
      await confirmMail(req.body.Kuski, req.body.Email, ConfirmCode);
      res.json({ success: true, data });
    }
  })
  .post('/confirm', async (req, res) => {
    const confirmed = await updateConfirm(req.body.confirmCode);
    if (confirmed) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  })
  .post('/resetconfirm', async (req, res) => {
    const resetCode = `rez${uuid(7)}`;
    const reset = await ResetPasswordConfirm(req.body.Email, resetCode);
    if (reset) {
      await resetMail(reset.Kuski, reset.Email, resetCode);
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Email not found' });
    }
  })
  .post('/reset', async (req, res) => {
    const newPassword = uuid();
    const newMd5 = crypto
      .createHash('md5')
      .update(newPassword)
      .digest('hex');
    const reset = await UpdatePasswordConfirm(req.body.confirmCode, newMd5);
    if (reset) {
      res.json({ success: true, newPassword });
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
        const kuskiData = await getKuskiData(req.body.Value[0]);
        if (req.body.Value[0].length > 15) {
          message = 'Nick is too long. Maximum number of characters is 15.';
          error = true;
        } else if (kuskiData.length > 0) {
          message = 'Nickname is already taken.';
          error = true;
        } else {
          await nickRequest(req.body.Value[0], auth.userid);
          message =
            'Nick change has been requested, now awaiting moderator approval, you will be notified.';
        }
        // team
      } else if (req.body.Field === 'Team') {
        let TeamIndex = 0;
        if (req.body.Value[0] !== '') {
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
        const old = crypto
          .createHash('md5')
          .update(req.body.Value[0])
          .digest('hex');
        const pass = crypto
          .createHash('md5')
          .update(req.body.Value[1])
          .digest('hex');
        const passAgain = crypto
          .createHash('md5')
          .update(req.body.Value[2])
          .digest('hex');
        const playerInfo = await Player(auth.userid);
        if (old !== playerInfo.Password) {
          message = 'Old password does not match.';
          error = true;
        } else if (pass !== passAgain) {
          message = 'Password again does not match.';
          error = true;
        }
        if (!error) {
          await UpdatePassword(pass, auth.userid);
          message = 'Password has been updated.';
        }
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
