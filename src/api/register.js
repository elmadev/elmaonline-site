import express from 'express';
import generate from 'nanoid/generate';
import crypto from 'crypto';
import { Team, Kuski } from 'data/models';
import { confirmMail } from 'utils/email';

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
    if (!message) {
      const teamData = await getTeamData(req.body.Team);
      if (teamData.length > 0) {
        if (teamData[0].dataValues.Locked) {
          message = 'Team is locked';
        } else {
          TeamIndex = teamData[0].dataValues.TeamIndex;
        }
      }
    }
    if (!message) {
      if (!validateEmail(req.body.Email)) {
        message = 'Invalid email adresse.';
      }
    }
    if (!message) {
      const emails = await checkEmail();
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
  });

export default router;
