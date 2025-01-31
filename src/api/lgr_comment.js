import express from 'express';
import { format } from 'date-fns';
import { authContext } from '#utils/auth';
import { createNewLGRCommentNotification } from '#utils/notifications';
import { LGRComment, Kuski } from '#data/models';
import { getLGRByIndex } from './lgr.js';

const router = express.Router();

const getLGRComments = async LGRIndex => {
  const lgrComments = await LGRComment.findAll({
    where: { LGRIndex },
    order: [['LGRCommentIndex', 'DESC']],
    include: [
      {
        model: Kuski,
        attributes: ['Kuski'],
        as: 'KuskiData',
      },
    ],
  });
  return lgrComments;
};

export const deleteLGRComments = async LGRIndex => {
  await LGRComment.destroy({
    where: { LGRIndex },
  });
  return;
};

const addLGRComment = async commentData => {
  const lgr = await getLGRByIndex(commentData.LGRIndex)
  if (!lgr) {
    return { error: 'LGR not found!' };
  }
  const NewLGRComment = await LGRComment.create({
    KuskiIndex: commentData.KuskiIndex,
    LGRIndex: commentData.LGRIndex,
    Entered: format(new Date(), 't'),
    Text: commentData.Text,
  });
  await createNewLGRCommentNotification(lgr, NewLGRComment);
  return NewLGRComment;
};

router.post('/add', async (req, res) => {
  const auth = authContext(req);
  if (!auth.auth) {
    res.status(401).json({ error: 'Access denied.' });
    return;
  }
  const data = await addLGRComment({
    ...req.body,
    KuskiIndex: auth.userid,
  });
  res.json(data);
});

router.get('/get/:LGRIndex', async (req, res) => {
  const LGRIndex = req.params.LGRIndex;
  const lgrComments = await getLGRComments(LGRIndex);
  res.json(lgrComments);
});

export default router;
