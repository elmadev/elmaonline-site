import { UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';
import express from 'express';
import { Tag } from '#data/models';
import requireMod from '#middlewares/requireMod';

const router = express.Router();

const getTags = async Type => {
  const data = await Tag.findAll();
  return data
    .filter(tag => (Type ? Type === tag.Type : true))
    .sort((a, b) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()));
};

const createTag = async data => {
  const created = await Tag.create(data);
  return created;
};

const updateTag = async (id, data) => {
  const updated = await Tag.update(data, { where: { TagIndex: id } });
  return updated;
};

const deleteTag = async id => {
  const deleted = await Tag.destroy({ where: { TagIndex: id } });
  return deleted;
};

router
  .get('/', async (req, res) => {
    const data = await getTags(req.query.type);
    res.json(data);
  })
  .post('/', requireMod, async (req, res) => {
    try {
      const data = await createTag(req.body);
      res.json(data);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        res.status(400).json({ error: 'Tag with given name already exists.' });
      } else {
        res.sendStatus(400);
      }
    }
  })
  .put('/:id', requireMod, async (req, res) => {
    try {
      const data = await updateTag(req.params.id, req.body);
      res.json(data);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        res.status(400).json({ error: 'Tag with given name already exists.' });
      } else {
        res.sendStatus(400);
      }
    }
  })
  .delete('/:id', requireMod, async (req, res) => {
    try {
      const data = await deleteTag(req.params.id);
      res.json(data);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(400).json({
          error: "Can't delete tag because some replays are using it.",
        });
      }
      res.sendStatus(400);
    }
  });

export default router;
