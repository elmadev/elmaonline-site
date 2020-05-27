import express from 'express';
import generate from 'nanoid/generate';
import crypto from 'crypto';
import { Team, Kuski } from 'data/models';
import { confirmMail, resetMail } from 'utils/email';

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

const UpdatePassword = async (ConfirmCode, Password) => {
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
      const ConfirmCode = generate('0123456789abcdefghijklmnopqrstuvwxyz', 10);
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
    const resetCode = `rez${generate(
      '0123456789abcdefghijklmnopqrstuvwxyz',
      7,
    )}`;
    const reset = await ResetPasswordConfirm(req.body.Email, resetCode);
    if (reset) {
      await resetMail(reset.Kuski, reset.Email, resetCode);
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Email not found' });
    }
  })
  .post('/reset', async (req, res) => {
    const newPassword = generate('0123456789abcdefghijklmnopqrstuvwxyz', 10);
    const newMd5 = crypto
      .createHash('md5')
      .update(newPassword)
      .digest('hex');
    const reset = await UpdatePassword(req.body.confirmCode, newMd5);
    if (reset) {
      res.json({ success: true, newPassword });
    } else {
      res.json({ success: false });
    }
  });

export default router;
