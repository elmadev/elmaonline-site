import QueryTypes from 'sequelize';
import { forEach } from 'lodash';
import { eachSeries } from 'neo-async';
import Model from './data/sequelize';
import { BestMultitime, Multitime } from './data/models';

// fixes bugged times in BestMultiTime, that is flag tag runs that were saved as best times, bug is fixed on now server so it shouldn't be needed again

const result = [];

const getBugged = async () => {
  const data = await Model.query(
    'SELECT bestmultitime.BestMultiTimeIndex, bestmultitime.KuskiIndex1, bestmultitime.KuskiIndex2, bestmultitime.LevelIndex, bestmultitime.MultiTimeIndex, bestmultitime.LevelIndex, bestmultitime.Time, multitime.Apples, multitime.Driven FROM (bestmultitime INNER JOIN multitime ON multitime.MultiTimeIndex = bestmultitime.MultiTimeIndex) WHERE multitime.Finished = "T"',
    { type: QueryTypes.SELECT },
  );
  return data;
};

const findBest = async (info, done) => {
  const data = await Multitime.findAll({
    where: {
      KuskiIndex1: info.KuskiIndex1,
      KuskiIndex2: info.KuskiIndex2,
      LevelIndex: info.LevelIndex,
      Finished: 'F',
    },
  });
  if (data) {
    let best = 99999999999;
    let index = 0;
    forEach(data, d => {
      if (d.Time < best) {
        best = d.Time;
        index = d.MultiTimeIndex;
      }
    });
    if (best !== 99999999999) {
      result.push({ info, best: { Time: best, MultiTimeIndex: index } });
    } else {
      await BestMultitime.destroy({
        where: {
          BestMultiTimeIndex: info.BestMultiTimeIndex,
        },
      });
    }
    done();
  } else {
    await BestMultitime.destroy({
      where: {
        BestMultiTimeIndex: info.BestMultiTimeIndex,
      },
    });
    done();
  }
};

const updateOrCreateBestMulti = async (data, done) => {
  const obj = await BestMultitime.findOne({
    where: { MultiTimeIndex: data.info.MultiTimeIndex },
  });
  if (obj) {
    await obj.update({
      Time: data.best.Time,
      MultiTimeIndex: data.best.MultiTimeIndex,
    });
    done();
  }
};

const findBestLoop = async bugged => {
  return new Promise(resolve => {
    eachSeries(bugged, findBest, () => {
      resolve(result);
    });
  });
};

const updateLoop = async bugged => {
  return new Promise(resolve => {
    eachSeries(bugged, updateOrCreateBestMulti, () => {
      resolve();
    });
  });
};

export const fix = async () => {
  const bugged = await getBugged();
  const tobeUpdated = await findBestLoop(bugged[0]);
  await updateLoop(tobeUpdated);
  return tobeUpdated;
};

export const fix2 = async () => {
  const bugged = await getBugged();
  return bugged;
};
