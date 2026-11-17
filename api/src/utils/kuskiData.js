import { Op } from 'sequelize';
import { Kuski, Team } from '#data/models';

// get kuskiData from a list of KuskiIndexes, including TeamData if Kuski has a TeamIndex
export const getKuskiData = async kuskiIndexes => {
  const unique = [...new Set(kuskiIndexes)];
  if (!unique.length) {
    return new Map();
  }
  const kuskis = await Kuski.unscoped().findAll({
    where: { KuskiIndex: { [Op.in]: unique } },
    attributes: ['Kuski', 'KuskiIndex', 'Country', 'BmpCRC', 'TeamIndex'],
    raw: true,
  });
  const teamIndexes = [
    ...new Set(kuskis.map(k => k.TeamIndex).filter(Boolean)),
  ];
  const teams = teamIndexes.length
    ? await Team.findAll({
        where: { TeamIndex: { [Op.in]: teamIndexes } },
        attributes: { exclude: ['Locked'] },
        raw: true,
      })
    : [];
  const teamByIndex = new Map(teams.map(t => [t.TeamIndex, t]));
  return new Map(
    kuskis.map(({ TeamIndex, ...kuski }) => [
      kuski.KuskiIndex,
      { ...kuski, TeamData: teamByIndex.get(TeamIndex) ?? null },
    ]),
  );
};
