import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { Grid } from '@material-ui/core';
import Kuski from 'components/Kuski';
import Loading from 'components/Loading';
import { ListContainer, ListRow, ListHeader, ListCell } from 'components/List';
import { Paper } from 'components/Paper';
import Flag from 'components/Flag';
import Link from 'components/Link';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import { find, orderBy } from 'lodash';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Header from 'components/Header';

const sortCountries = (
  _countries,
  countrySort,
  playerSort,
  showCount,
  rankedOnly,
) => {
  // deep clone countries, otherwise we end up modifying the store directly,
  // which is bad.
  let countries = JSON.parse(JSON.stringify(_countries));

  // both player and country sort will use this
  let getFromPlayer;

  if (playerSort === 'ranking') {
    getFromPlayer = p => p.RankingData.RankingAll;
  } else if (playerSort === 'played') {
    getFromPlayer = p => p.RankingData.PlayedAll;
  } else if (playerSort === 'designed') {
    getFromPlayer = p => p.RankingData.DesignedAll;
  } else if (playerSort === 'pct') {
    getFromPlayer = p => p.RankingData.WinPct;
  } else {
    return [];
  }

  // sort players before countries. (necessary)
  countries = countries.map(c => {
    // sort players by selection then by name
    c.players = orderBy(
      c.players,
      [getFromPlayer, p => p.Kuski],
      ['desc', 'asc'],
    );

    return c;
  });

  if (countrySort === 'ranked') {
    countries = orderBy(countries, [c => c.rankedCount], ['desc']);
  } else if (countrySort === 'all') {
    countries = orderBy(countries, [c => c.playerCount], ['desc']);
  } else if (countrySort === 'playerSort') {
    countries = orderBy(
      countries,
      [
        c => {
          return c.players.length && getFromPlayer(c.players[0]);
        },
      ],
      ['desc'],
    );
  } else if (countrySort === 'designed') {
    countries = orderBy(countries, [c => c.battlesDesigned], ['desc']);
  } else {
    // ie. "avgTop"
    countries = orderBy(countries, [c => c.avgTopRanking], ['desc']);
  }

  // possibly remove some players
  countries = countries.map(c => {
    let players = c.players;

    if (rankedOnly) {
      players = players.filter(p => p.RankingData.PlayedAll > 0);
    }

    if (showCount !== 'all') {
      players = players.slice(0, showCount);
    }

    c.players = players;

    return c;
  });

  return countries;
};

const ByCountry = ({ playersByCountry }) => {
  const [countrySort, setCountrySort] = useState('avgTop');
  const [playerSort, setPlayerSort] = useState('ranking');
  const [showCount, setShowCount] = useState(10);
  const [rankedOnly, setRankedOnly] = useState(true);

  // for getting country name from index
  const { countries } = useStoreState(store => store.Register);
  const { getCountries } = useStoreActions(store => store.Register);

  let playersByCountrySorted = useMemo(
    () =>
      sortCountries(
        playersByCountry,
        countrySort,
        playerSort,
        showCount,
        rankedOnly,
      ),
    [playersByCountry, countrySort, playerSort, showCount, rankedOnly],
  );

  const getCountryName = index => {
    const obj = find(countries || [], c => c.Iso === index);

    return obj?.Name || index;
  };

  useEffect(() => {
    if (countries.length === 0) {
      getCountries();
    }
  }, []);

  if (!playersByCountry.length) {
    return <Loading />;
  }

  return (
    <Root>
      <Grid container justifyContent="flex-end" className="controls">
        <FormControl style={{ minWidth: 175 }}>
          <InputLabel id="country-sort">Sort Countries</InputLabel>
          <Select
            id="country-sort"
            value={countrySort}
            onChange={e => {
              setCountrySort(e.target.value);
            }}
          >
            <MenuItem value="avgTop">Top 5 Avg. Ranking</MenuItem>
            <MenuItem value="ranked">Ranked Players</MenuItem>
            <MenuItem value="all">Total Players</MenuItem>
            <MenuItem value="designed">Battles Designed</MenuItem>
            <MenuItem value="playerSort">
              Top Player (According to Player Sort)
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ minWidth: 175 }}>
          <InputLabel id="player-sort">Sort Players</InputLabel>
          <Select
            id="player-sort"
            value={playerSort}
            onChange={e => {
              setPlayerSort(e.target.value);
            }}
          >
            <MenuItem value="ranking">Battle Ranking</MenuItem>
            <MenuItem value="pct">Battle Win %</MenuItem>
            <MenuItem value="played">Battles Played</MenuItem>
            <MenuItem value="designed">Battles Designed</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ minWidth: 175 }}>
          <InputLabel id="player-count"># Players/Country</InputLabel>
          <Select
            id="player-count"
            value={showCount}
            onChange={e => setShowCount(e.target.value)}
          >
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
            <MenuItem value={30}>Top 30</MenuItem>
            <MenuItem value={50}>Top 50</MenuItem>
            <MenuItem value="all">All (Slow!)</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={rankedOnly}
              onChange={e => setRankedOnly(e.target.checked)}
            />
          }
          label="Ranked Players Only"
        />
      </Grid>
      {playersByCountrySorted.map((country, countryIndex) => {
        return (
          <Item key={countryIndex}>
            <ItemHeading>
              <Header h1>
                <span>
                  {countryIndex + 1}.{` `}
                </span>
                <Flag nationality={country.country} />
                <span>{` `}</span>
                <span>{getCountryName(country.country)}</span>
              </Header>
            </ItemHeading>
            <Paper>
              <ItemStats>
                <span>{country.rankedCount} Ranked Players</span>
                <span>{country.playerCount} Total Players</span>
                <span>{country.battlesDesigned} Battles Designed</span>
                <span>
                  {country.avgTopRanking.toFixed(1)} Top 5 Avg. Ranking
                </span>
              </ItemStats>
              <ItemBody>
                <ListContainer>
                  <ListHeader>
                    <ListCell>Player</ListCell>
                    <ListCell>Battles Designed</ListCell>
                    <ListCell>Battles Played</ListCell>
                    <ListCell>Battle Win %</ListCell>
                    <ListCell>Battle Ranking</ListCell>
                  </ListHeader>

                  {country.players.map((player, index) => {
                    return (
                      <ListRow className="player-row" key={player.KuskiIndex}>
                        <ListCell>
                          {index + 1}.{` `}
                          <Kuski flag={false} team={true} kuskiData={player} />
                        </ListCell>
                        <ListCell>
                          <Link to={`/kuskis/${player.Kuski}/designed-battles`}>
                            {player.RankingData.DesignedAll}
                          </Link>
                        </ListCell>
                        <ListCell>{player.RankingData.PlayedAll}</ListCell>
                        <ListCell>{player.RankingData.WinPct}</ListCell>
                        <ListCell>
                          {player.RankingData.RankingAll.toFixed(1)}
                        </ListCell>
                      </ListRow>
                    );
                  })}
                </ListContainer>
              </ItemBody>
            </Paper>
          </Item>
        );
      })}
    </Root>
  );
};

const Root = styled.div`
  padding: 0 20px 30px 20px;
  .player-row:last-child {
    > span {
      border-bottom: none;
    }
  }
  .controls {
    @media screen and (max-width: 1440px) {
      padding: 30px 0 10px 0;
      > * {
        margin-bottom: 15px;
      }
    }
    > * {
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

const Item = styled.div`
  margin-bottom: 30px;
`;

const ItemHeading = styled.div``;

const ItemStats = styled.div`
  padding: 15px 10px;
  > span {
    font-size: 14px;
    font-weight: 700;
    margin-left: 20px;
    &:first-child {
      margin-left: 0;
    }
  }
`;

const ItemBody = styled.div`
  overflow-y: auto;
`;

export default ByCountry;
