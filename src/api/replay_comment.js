import express from 'express';
import { authContext } from 'utils/auth';
import { createNewCommentNotification } from 'utils/notifications';
import { ReplayComment, Kuski, Replay } from 'data/models';

const router = express.Router();

const getReplayCommentsByReplayId = async ReplayIndex => {
  const data = await ReplayComment.findAll({
    where: { ReplayIndex },
    order: [['ReplayCommentIndex', 'DESC']],
    include: [
      {
        model: Kuski,
        attributes: ['Kuski'],
        as: 'KuskiData',
      },
    ],
  });
  return data;
};

const addReplayComment = async Data => {
  const NewReplayComment = await ReplayComment.create(Data);
  await createNewCommentNotification(NewReplayComment);
  return NewReplayComment;
};

router
  .get('/', async (req, res) => {
    const comments = await ReplayComment.findAll({
      attributes: ['ReplayIndex', 'KuskiIndex', 'Entered', 'Text'],
      order: [['Entered', 'DESC']],
      where: {},
      include: [
        {
          model: Kuski,
          attributes: ['Kuski', 'Country'],
          as: 'KuskiData',
        },
        {
          model: Replay,
          attributes: [
            'ReplayIndex',
            'UUID',
            'RecFileName',
            'ReplayTime',
            'Finished',
            'Uploaded',
            'Unlisted',
          ],
          as: 'Replay',
          where: {
            Unlisted: 0,
          },
          include: [
            {
              model: Kuski,
              attributes: ['Kuski', 'Country'],
              as: 'DrivenByData',
            },
            {
              model: Kuski,
              attributes: ['Kuski', 'Country'],
              as: 'UploadedByData',
            },
          ],
        },
      ],
    });

    res.json(comments.filter(c => c.Replay !== null));
  })
  .get('/:ReplayIndex', async (req, res) => {
    const data = await getReplayCommentsByReplayId(req.params.ReplayIndex);
    res.json(data);
  })
  .post('/add', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await addReplayComment({
        ...req.body,
        KuskiIndex: auth.userid,
      });
      res.json(data);
    } else {
      res.sendStatus(401);
    }
  });

export default router;
