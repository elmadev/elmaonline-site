import { thunk } from 'easy-peasy';
import { Players } from 'api';
import { getSetter } from 'utils/easy-peasy';
import { groupBy, sumBy, orderBy, round, values, mapValues } from 'lodash';

export default {
  playerList: [],
  playersByCountry: [],
  setPlayerList: getSetter('playerList'),
  setPlayersByCountry: getSetter('playersByCountry'),
  // for use in store only
  _buildPlayersByCountry: thunk((actions, players) => {
    // object with country codes as keys, containing arrays of player objects
    const byCountry = groupBy(players, 'Country');

    const avgTop = (players, howMany) => {
      if (howMany > 0) {
        return round(
          sumBy(players.slice(0, howMany), p => p.RankingData.RankingAll) /
            howMany,
          2,
        );
      }

      return 0;
    };

    // convert countries to array and map values
    let byCountryArr = values(
      mapValues(byCountry, (players, index) => {
        // the array of player objects
        let ps = players.map(p => {
          const r = p.RankingData || {};

          // ensure all players always have predictable RankingData
          // (some players do not have a ranking data entry in db)
          p.RankingData = {
            ...r,
            RankingAll: +r.RankingAll || 0,
            PlayedAll: +r.PlayedAll || 0,
            WinsAll: +r.WinsAll || 0,
            DesignedAll: +r.DesignedAll || 0,
            Played5All: +r.Played5All || 0,
          };

          p.RankingData.WinPct =
            p.RankingData.Played5All > 0
              ? round(
                  (100 * p.RankingData.WinsAll) / p.RankingData.Played5All,
                  2,
                )
              : 0;

          return p;
        });

        // have to sort players here to extract the avgTopRanking.
        // later (in component), players sorted according to diff options.
        ps = orderBy(ps, [p => p.RankingData.RankingAll], ['desc']);

        return {
          country: index,
          avgTopRanking: avgTop(ps, 5),
          playerCount: ps.length,
          rankedCount: ps.filter(p => p.RankingData.RankingAll > 0).length,
          battlesDesigned: sumBy(ps, p => p.RankingData.DesignedAll),
          players: ps,
        };
      }),
    );

    actions.setPlayersByCountry(byCountryArr);
  }),
  getPlayers: thunk(async actions => {
    const players = await Players();

    if (players.ok) {
      actions.setPlayerList(players.data);

      // for now, build players by country always when fetching all players.
      // we only fetch players once ever, so this is fine, even though
      // building by country is mildly expensive.
      actions._buildPlayersByCountry(players.data);
    }
  }),
};
