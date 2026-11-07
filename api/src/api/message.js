import express from 'express';
import { Op } from 'sequelize';
import { authContext, secretMatches } from '#utils/auth';
import { messageLimit } from '#middlewares/rateLimit';
import { withOnlineStatus } from '#utils/online';
import { dbquery } from '#data/sequelize';
import {
  Message,
  MessageConversation,
  MessageMember,
  Kuski,
  Ignored,
} from '#data/models';
import config from '../config.js';

const router = express.Router();

const maxTextLength = 2000;
const maxNameLength = 50;
const maxGroupSize = 20;
const pageSize = 50;
const lastActiveThrottle = 60;

const hour = 60 * 60;
const day = 24 * hour;
const expireOptions = [0, hour, day, 7 * day, 30 * day, 365 * day];

const toExpireAfter = value => {
  if (value === undefined || value === null) {
    return 0;
  }
  const n = parseInt(value, 10);
  return expireOptions.includes(n) ? n : null;
};

const now = () => Math.floor(Date.now() / 1000);

// sql condition for messages that haven't expired, needs :now in replacements
const notExpiredSql = alias =>
  `(${alias}ExpiresAt IS NULL OR ${alias}ExpiresAt > :now)`;

const notExpired = () => ({
  [Op.or]: [{ ExpiresAt: null }, { ExpiresAt: { [Op.gt]: now() } }],
});

const kuskiAttributes = ['KuskiIndex', 'Kuski', 'Country', 'LastActive'];

const toInt = value => {
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const toIntList = value =>
  Array.isArray(value) ? [...new Set(value.map(toInt).filter(Boolean))] : [];

const cleanText = (text, maxLength) => {
  if (typeof text !== 'string') {
    return null;
  }
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > maxLength) {
    return null;
  }
  return trimmed;
};

const getIgnoredIndexes = async KuskiIndex => {
  const rows = await Ignored.findAll({
    where: { KuskiIndex },
    attributes: ['IgnoredKuskiIndex'],
  });
  return rows.map(r => r.IgnoredKuskiIndex);
};

const isIgnoredEitherWay = async (a, b) => {
  const count = await Ignored.count({
    where: {
      [Op.or]: [
        { KuskiIndex: a, IgnoredKuskiIndex: b },
        { KuskiIndex: b, IgnoredKuskiIndex: a },
      ],
    },
  });
  return count > 0;
};

const getMembership = async (ConversationIndex, KuskiIndex) => {
  const member = await MessageMember.findOne({
    where: { ConversationIndex, KuskiIndex, LeftAt: null },
    include: [{ model: MessageConversation, as: 'Conversation' }],
  });
  return member;
};

const getActiveMemberIndexes = async ConversationIndex => {
  const members = await MessageMember.findAll({
    where: { ConversationIndex, LeftAt: null },
    attributes: ['KuskiIndex'],
  });
  return members.map(m => m.KuskiIndex);
};

const getLatestMessageIndex = async ConversationIndex => {
  const latest = await Message.max('MessageIndex', {
    where: { ConversationIndex },
  });
  return latest || 0;
};

const findDirectConversation = async (a, b) => {
  const rows = await dbquery(
    `
    SELECT c.ConversationIndex
    FROM message_conversation c
    JOIN message_member m ON m.ConversationIndex = c.ConversationIndex
    WHERE c.IsGroup = 0 AND m.KuskiIndex IN (:a, :b)
    GROUP BY c.ConversationIndex
    HAVING COUNT(*) = 2
    LIMIT 1
    `,
    { a, b },
  );
  return rows.length ? rows[0].ConversationIndex : null;
};

const addMessage = async (
  conversation,
  KuskiIndex,
  Text,
  Type = 'text',
  ExpireAfter = 0,
) => {
  const CreatedAt = now();
  const message = await Message.create({
    ConversationIndex: conversation.ConversationIndex,
    KuskiIndex,
    Text,
    CreatedAt,
    Type,
    ExpiresAt: ExpireAfter ? CreatedAt + ExpireAfter : null,
  });
  await MessageConversation.update(
    { LastMessageAt: CreatedAt },
    { where: { ConversationIndex: conversation.ConversationIndex } },
  );
  // your own messages are read
  await MessageMember.update(
    { LastReadMessageIndex: message.MessageIndex },
    {
      where: {
        ConversationIndex: conversation.ConversationIndex,
        KuskiIndex,
      },
    },
  );
  return message;
};

// adds kuskis to a conversation, or rejoins them if they left. history is
// visible but starts out as read
const addMembers = async (ConversationIndex, KuskiIndexes) => {
  const JoinedAt = now();
  const LastReadMessageIndex = await getLatestMessageIndex(ConversationIndex);
  const existing = await MessageMember.findAll({
    where: { ConversationIndex, KuskiIndex: KuskiIndexes },
  });
  const existingIndexes = existing.map(m => m.KuskiIndex);
  if (existingIndexes.length) {
    await MessageMember.update(
      { LeftAt: null, JoinedAt, LastReadMessageIndex },
      { where: { ConversationIndex, KuskiIndex: existingIndexes } },
    );
  }
  const newIndexes = KuskiIndexes.filter(k => !existingIndexes.includes(k));
  if (newIndexes.length) {
    await MessageMember.bulkCreate(
      newIndexes.map(KuskiIndex => ({
        ConversationIndex,
        KuskiIndex,
        JoinedAt,
        LastReadMessageIndex,
      })),
    );
  }
};

const getNicks = async KuskiIndexes => {
  const kuskis = await Kuski.findAll({
    where: { KuskiIndex: KuskiIndexes },
    attributes: ['KuskiIndex', 'Kuski'],
  });
  return kuskis.map(k => k.Kuski);
};

// unread messages per conversation, own and system messages don't count
const getUnreadCounts = async (KuskiIndex, ignored) => {
  const rows = await dbquery(
    `
    SELECT m.ConversationIndex, COUNT(*) AS Unread
    FROM message m
    JOIN message_member mm ON mm.ConversationIndex = m.ConversationIndex
      AND mm.KuskiIndex = :KuskiIndex AND mm.LeftAt IS NULL
    WHERE m.MessageIndex > mm.LastReadMessageIndex
      AND m.KuskiIndex <> :KuskiIndex
      AND m.Type = 'text'
      AND ${notExpiredSql('m.')}
      ${ignored.length ? 'AND m.KuskiIndex NOT IN (:ignored)' : ''}
    GROUP BY m.ConversationIndex
    `,
    { KuskiIndex, ignored, now: now() },
  );
  return rows.reduce((acc, row) => {
    acc[row.ConversationIndex] = Number(row.Unread);
    return acc;
  }, {});
};

// newest message per conversation for the list preview
const getLastMessages = async (ConversationIndexes, ignored) => {
  if (!ConversationIndexes.length) {
    return {};
  }
  const rows = await dbquery(
    `
    SELECT MAX(MessageIndex) AS MessageIndex
    FROM message
    WHERE ConversationIndex IN (:ConversationIndexes)
      AND ${notExpiredSql('')}
      ${ignored.length ? 'AND KuskiIndex NOT IN (:ignored)' : ''}
    GROUP BY ConversationIndex
    `,
    { ConversationIndexes, ignored, now: now() },
  );
  if (!rows.length) {
    return {};
  }
  const messages = await Message.findAll({
    where: { MessageIndex: rows.map(r => r.MessageIndex) },
    include: [{ model: Kuski, as: 'KuskiData', attributes: ['Kuski'] }],
  });
  return messages.reduce((acc, message) => {
    acc[message.ConversationIndex] = message;
    return acc;
  }, {});
};

const getConversations = async KuskiIndex => {
  const memberships = await MessageMember.findAll({
    where: { KuskiIndex, LeftAt: null },
    attributes: ['ConversationIndex'],
  });
  const ConversationIndexes = memberships.map(m => m.ConversationIndex);
  if (!ConversationIndexes.length) {
    return [];
  }
  const ignored = await getIgnoredIndexes(KuskiIndex);
  const [conversations, unread, lastMessages] = await Promise.all([
    MessageConversation.findAll({
      where: { ConversationIndex: ConversationIndexes },
      include: [
        {
          model: MessageMember,
          as: 'Members',
          where: { LeftAt: null },
          attributes: ['KuskiIndex'],
          include: [
            { model: Kuski, as: 'KuskiData', attributes: kuskiAttributes },
          ],
        },
      ],
      order: [['LastMessageAt', 'DESC']],
    }),
    getUnreadCounts(KuskiIndex, ignored),
    getLastMessages(ConversationIndexes, ignored),
  ]);
  return conversations.map(c => {
    const conversation = c.toJSON();
    return {
      ...conversation,
      Members: conversation.Members.map(m => ({
        ...m,
        KuskiData: withOnlineStatus(m.KuskiData),
      })),
      Unread: unread[c.ConversationIndex] || 0,
      LastMessage: lastMessages[c.ConversationIndex] || null,
    };
  });
};

const getMessages = async (ConversationIndex, KuskiIndex, before, limit) => {
  const ignored = await getIgnoredIndexes(KuskiIndex);
  const where = { ConversationIndex, ...notExpired() };
  if (before) {
    where.MessageIndex = { [Op.lt]: before };
  }
  if (ignored.length) {
    where.KuskiIndex = { [Op.notIn]: ignored };
  }
  const messages = await Message.findAll({
    where,
    order: [['MessageIndex', 'DESC']],
    limit,
    include: [{ model: Kuski, as: 'KuskiData', attributes: ['Kuski'] }],
  });
  return messages;
};

const getUnreadTotal = async KuskiIndex => {
  const ignored = await getIgnoredIndexes(KuskiIndex);
  const unread = await getUnreadCounts(KuskiIndex, ignored);
  return Object.values(unread).reduce((sum, count) => sum + count, 0);
};

// expired messages are already hidden, this removes them from the db
const deleteExpiredMessages = async () => {
  const deleted = await Message.destroy({
    where: { ExpiresAt: { [Op.lte]: now() } },
  });
  return deleted;
};

const updateLastActive = async (KuskiIndex, hidden) => {
  if (hidden) {
    await Kuski.update(
      { LastActive: null },
      { where: { KuskiIndex, LastActive: { [Op.ne]: null } } },
    );
    return;
  }
  await Kuski.update(
    { LastActive: now() },
    {
      where: {
        KuskiIndex,
        [Op.or]: [
          { LastActive: null },
          { LastActive: { [Op.lt]: now() - lastActiveThrottle } },
        ],
      },
    },
  );
};

// checks auth and that the user is a member of the conversation in the url,
// the membership is passed on in res.locals
const requireMember = async (req, res, next) => {
  const auth = authContext(req);
  if (!auth.auth) {
    res.sendStatus(401);
    return;
  }
  const ConversationIndex = toInt(req.params.ConversationIndex);
  if (!ConversationIndex) {
    res.sendStatus(404);
    return;
  }
  const member = await getMembership(ConversationIndex, auth.userid);
  if (!member) {
    res.sendStatus(403);
    return;
  }
  res.locals.userid = auth.userid;
  res.locals.member = member;
  res.locals.conversation = member.Conversation;
  next();
};

router
  .get('/', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await getConversations(auth.userid);
      res.json(data);
    } else {
      res.sendStatus(401);
    }
  })
  .post('/heartbeat', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      await updateLastActive(auth.userid, req.body?.hidden === true);
      const unread = await getUnreadTotal(auth.userid);
      res.json({ unread });
    } else {
      res.sendStatus(401);
    }
  })
  // cron job, deletes expired messages
  .post('/expire', async (req, res) => {
    if (!secretMatches(req.header('Authorization'), config.run.ranking)) {
      res.sendStatus(401);
      return;
    }
    const deleted = await deleteExpiredMessages();
    res.json({ deleted });
  })
  .post('/', messageLimit, async (req, res) => {
    const auth = authContext(req);
    if (!auth.auth) {
      res.sendStatus(401);
      return;
    }
    const Text = cleanText(req.body?.Text, maxTextLength);
    const ExpireAfter = toExpireAfter(req.body?.ExpireAfter);
    const KuskiIndexes = toIntList(req.body?.KuskiIndexes).filter(
      k => k !== auth.userid,
    );
    if (!Text) {
      res.status(400).json({ error: 'Message is empty or too long.' });
      return;
    }
    if (ExpireAfter === null) {
      res.status(400).json({ error: 'Invalid expire time.' });
      return;
    }
    if (!KuskiIndexes.length) {
      res.status(400).json({ error: 'No recipients.' });
      return;
    }
    if (KuskiIndexes.length + 1 > maxGroupSize) {
      res
        .status(400)
        .json({ error: `Groups can have at most ${maxGroupSize} members.` });
      return;
    }
    const found = await Kuski.count({ where: { KuskiIndex: KuskiIndexes } });
    if (found !== KuskiIndexes.length) {
      res.status(400).json({ error: 'Kuski not found.' });
      return;
    }

    if (KuskiIndexes.length === 1) {
      const [other] = KuskiIndexes;
      if (await isIgnoredEitherWay(auth.userid, other)) {
        res.status(403).json({ error: 'You can not message this kuski.' });
        return;
      }
      const existing = await findDirectConversation(auth.userid, other);
      let conversation = existing
        ? await MessageConversation.findByPk(existing)
        : null;
      if (!conversation) {
        conversation = await MessageConversation.create({
          IsGroup: 0,
          CreatedBy: auth.userid,
          CreatedAt: now(),
          LastMessageAt: now(),
        });
        await addMembers(conversation.ConversationIndex, [auth.userid, other]);
      }
      const message = await addMessage(
        conversation,
        auth.userid,
        Text,
        'text',
        ExpireAfter,
      );
      res.json({ ConversationIndex: conversation.ConversationIndex, message });
      return;
    }

    const Name = cleanText(req.body?.Name, maxNameLength);
    const conversation = await MessageConversation.create({
      Name,
      IsGroup: 1,
      CreatedBy: auth.userid,
      CreatedAt: now(),
      LastMessageAt: now(),
    });
    const { ConversationIndex } = conversation;
    await addMembers(ConversationIndex, [auth.userid, ...KuskiIndexes]);
    await addMessage(conversation, auth.userid, 'created the group', 'system');
    const message = await addMessage(
      conversation,
      auth.userid,
      Text,
      'text',
      ExpireAfter,
    );
    res.json({ ConversationIndex, message });
  })
  .get('/:ConversationIndex', requireMember, async (req, res) => {
    const before = toInt(req.query.before);
    const limit = Math.min(toInt(req.query.limit) || pageSize, 100);
    const data = await getMessages(
      res.locals.conversation.ConversationIndex,
      res.locals.userid,
      before,
      limit,
    );
    res.json(data);
  })
  .post(
    '/:ConversationIndex',
    messageLimit,
    requireMember,
    async (req, res) => {
      const { conversation, userid } = res.locals;
      const Text = cleanText(req.body?.Text, maxTextLength);
      const ExpireAfter = toExpireAfter(req.body?.ExpireAfter);
      if (!Text) {
        res.status(400).json({ error: 'Message is empty or too long.' });
        return;
      }
      if (ExpireAfter === null) {
        res.status(400).json({ error: 'Invalid expire time.' });
        return;
      }
      if (!conversation.IsGroup) {
        const members = await getActiveMemberIndexes(
          conversation.ConversationIndex,
        );
        const other = members.find(k => k !== userid);
        if (other && (await isIgnoredEitherWay(userid, other))) {
          res.status(403).json({ error: 'You can not message this kuski.' });
          return;
        }
      }
      const message = await addMessage(
        conversation,
        userid,
        Text,
        'text',
        ExpireAfter,
      );
      res.json(message);
    },
  )
  .post('/:ConversationIndex/read', requireMember, async (req, res) => {
    const { member } = res.locals;
    const MessageIndex = toInt(req.body?.MessageIndex);
    // never move the read position backwards
    if (MessageIndex && MessageIndex > member.LastReadMessageIndex) {
      await MessageMember.update(
        { LastReadMessageIndex: MessageIndex },
        { where: { MemberIndex: member.MemberIndex } },
      );
    }
    res.json({ success: 1 });
  })
  .post('/:ConversationIndex/members', requireMember, async (req, res) => {
    const { conversation, userid } = res.locals;
    if (!conversation.IsGroup) {
      res.status(400).json({ error: 'Not a group.' });
      return;
    }
    const current = await getActiveMemberIndexes(
      conversation.ConversationIndex,
    );
    const KuskiIndexes = toIntList(req.body?.KuskiIndexes).filter(
      k => !current.includes(k),
    );
    if (!KuskiIndexes.length) {
      res.status(400).json({ error: 'No new members.' });
      return;
    }
    if (current.length + KuskiIndexes.length > maxGroupSize) {
      res
        .status(400)
        .json({ error: `Groups can have at most ${maxGroupSize} members.` });
      return;
    }
    const nicks = await getNicks(KuskiIndexes);
    if (nicks.length !== KuskiIndexes.length) {
      res.status(400).json({ error: 'Kuski not found.' });
      return;
    }
    await addMembers(conversation.ConversationIndex, KuskiIndexes);
    await addMessage(
      conversation,
      userid,
      `added ${nicks.join(', ')}`,
      'system',
    );
    res.json({ success: 1 });
  })
  .post('/:ConversationIndex/leave', requireMember, async (req, res) => {
    const { conversation, member, userid } = res.locals;
    if (!conversation.IsGroup) {
      res.status(400).json({ error: 'Not a group.' });
      return;
    }
    await addMessage(conversation, userid, 'left the group', 'system');
    await MessageMember.update(
      { LeftAt: now() },
      { where: { MemberIndex: member.MemberIndex } },
    );
    res.json({ success: 1 });
  })
  .delete(
    '/:ConversationIndex/:MessageIndex',
    requireMember,
    async (req, res) => {
      const { conversation, userid } = res.locals;
      const MessageIndex = toInt(req.params.MessageIndex);
      const deleted = MessageIndex
        ? await Message.destroy({
            where: {
              MessageIndex,
              ConversationIndex: conversation.ConversationIndex,
              KuskiIndex: userid,
              Type: 'text',
            },
          })
        : 0;
      if (!deleted) {
        res.sendStatus(404);
        return;
      }
      res.json({ success: 1 });
    },
  )
  .patch('/:ConversationIndex', requireMember, async (req, res) => {
    const { conversation, userid } = res.locals;
    if (!conversation.IsGroup) {
      res.status(400).json({ error: 'Not a group.' });
      return;
    }
    const Name = cleanText(req.body?.Name, maxNameLength);
    if (!Name) {
      res.status(400).json({ error: 'Name is empty or too long.' });
      return;
    }
    await MessageConversation.update(
      { Name },
      { where: { ConversationIndex: conversation.ConversationIndex } },
    );
    await addMessage(
      conversation,
      userid,
      `renamed the group to ${Name}`,
      'system',
    );
    res.json({ success: 1 });
  });

export default router;
