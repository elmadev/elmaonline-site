import express from 'express';
import { authContext } from '#utils/auth';
import { createNewCommentNotification } from '#utils/notifications';
import { ReplayComment, Kuski, Replay } from '#data/models';

const router = express.Router();

const getReplayCommentsByReplayId = async ReplayIndex => {
  const query = {
    where: { ReplayIndex },
    order: [['ReplayCommentIndex', 'DESC']],
    include: [
      {
        model: Kuski,
        attributes: ['Kuski'],
        as: 'KuskiData',
      },
    ],
  };
  if (ReplayIndex.includes('b-')) {
    query.where = { BattleIndex: ReplayIndex.split('-')[1] };
  } else if (ReplayIndex.includes('_')) {
    query.where = { UUID: ReplayIndex };
  }
  const data = await ReplayComment.findAll(query);
  return data;
};

const addReplayComment = async Data => {
  const insert = { ...Data };
  if (typeof Data.ReplayIndex === 'string') {
    if (Data.ReplayIndex.includes('b-')) {
      insert.ReplayIndex = 0;
      insert.BattleIndex = Data.ReplayIndex.split('-')[1];
    } else if (Data.ReplayIndex.includes('_')) {
      insert.ReplayIndex = 0;
      insert.UUID = Data.ReplayIndex;
    }
  }
  const NewReplayComment = await ReplayComment.create(insert);
  await createNewCommentNotification(NewReplayComment);
  return NewReplayComment;
};

const getReplayComments = async opts => {
  const { rows, count } = await ReplayComment.findAndCountAll({
    attributes: ['ReplayIndex', 'KuskiIndex', 'Entered', 'Text'],
    order: [['Entered', 'DESC']],
    limit: opts.limit,
    offset: opts.offset,
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

  return {
    rows: rows.filter(r => r.Replay !==  null),
    count
  }
}

router
  .get('/', async (req, res) => {

    const {rows, count} = await getReplayComments({
      limit: +(req.query.limit || 0) || 0,
      offset: +(req.query.offset || 0) || 0,
    });

    res.json({rows, count});
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
