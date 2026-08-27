import React, { useEffect, useState, useMemo } from 'react';
import styled from '@emotion/styled';
import Layout from 'components/Layout';
import { Grid, Tabs, Tab } from '@material-ui/core';
import Header from 'components/Header';
import Time from 'components/Time';
import LocalTime from 'components/LocalTime';
import { ListContainer, ListHeader, ListRow, ListCell } from 'components/List';
import { useStoreState, useStoreActions } from 'easy-peasy';
import EventItem, { SeasonItem } from 'components/EventItem';
import Kuski from 'components/Kuski';
import { useParams } from '@tanstack/react-router';
import Loading from 'components/Loading';
import { Paper } from 'components/Paper';
import { points, mopoPoints, top20points } from 'utils/cups';
import { BATTLETYPES_LONG } from 'constants/ranking';
import { Link } from '@tanstack/react-router';
import { nickId } from 'utils/nick';
import Admin from './Admin';
import ResultEditor from './ResultEditor';
import BattleStatus from './BattleStatus';
import Detailed from './Detailed';
import {
  getFilteredBattleLeagueBattles,
  getSortedResultsWithPoints,
} from './utils';

const BattleLeague = () => {
  const { ShortName } = useParams({ strict: false });
  const [selected, setSelected] = useState(-1);
  const [selectedId, setSelectedId] = useState(-1);
  const [selectedSeason, setSelectedSeason] = useState('Overall');
  const [tab, setTab] = useState('events');
  const {
    league: { data, loading },
  } = useStoreState(state => state.BattleLeague);
  const {
    league: { fetch },
  } = useStoreActions(actions => actions.BattleLeague);

  let pointsEnum = points;
  if (data?.PointSystem === 0) {
    pointsEnum = mopoPoints;
  }
  if (data?.PointSystem === 2) {
    pointsEnum = top20points;
  }

  const whitelist = Array.isArray(data?.Settings?.whitelist)
    ? data.Settings.whitelist
    : [];
  const overrides = data?.Settings?.override || {};
  const isWhitelistActive = whitelist.length > 0;
  const filteredBattles = useMemo(() => {
    if (!isWhitelistActive && !Object.keys(overrides).length) {
      return data?.Battles || [];
    }
    if (!data?.Battles) {
      return [];
    }

    return getFilteredBattleLeagueBattles({
      battles: data.Battles,
      whitelist,
      overrides,
      pointSystem: data?.PointSystem,
    });
  }, [
    data?.Battles,
    data?.Settings?.whitelist,
    data?.Settings?.override,
    data?.PointSystem,
    isWhitelistActive,
    whitelist,
    overrides,
  ]);

  let standings = [];
  let overallStandings = [];
  const seasons = [];
  const seasonStandings = {};
  let referenceResultCount = 0;
  if (data) {
    const firstBattleWithResults = filteredBattles.find(
      battle => battle.BattleData?.Results?.length > 0,
    );
    referenceResultCount = firstBattleWithResults?.BattleData?.Results?.length;
    filteredBattles.forEach(battle => {
      if (battle.Season && seasons.indexOf(battle.Season) === -1) {
        seasons.push(battle.Season);
        seasonStandings[battle.Season] = [];
      }
      if (!battle.BattleData) {
        return;
      }
      const results = getSortedResultsWithPoints({
        results: battle.BattleData.Results,
        battleType: battle.BattleType,
        pointSystem: data?.PointSystem,
        pointsEnum,
        referenceResultCount,
      });
      results.forEach(r => {
        const pointsForPlacement = r.Points;
        const id = standings.findIndex(s => s.KuskiIndex === r.KuskiIndex);
        if (id === -1) {
          standings.push({
            KuskiIndex: r.KuskiIndex,
            Points: pointsForPlacement,
            KuskiData: r.KuskiData,
          });
        } else {
          standings[id].Points = standings[id].Points + pointsForPlacement;
        }
        if (battle.Season) {
          const seasonId = seasonStandings[battle.Season].findIndex(
            s => s.KuskiIndex === r.KuskiIndex,
          );
          if (seasonId === -1) {
            seasonStandings[battle.Season].push({
              KuskiIndex: r.KuskiIndex,
              Points: pointsForPlacement,
              KuskiData: r.KuskiData,
            });
          } else {
            seasonStandings[battle.Season][seasonId].Points =
              seasonStandings[battle.Season][seasonId].Points +
              pointsForPlacement;
          }
        }
      });
    });
    overallStandings = standings;
  }

  let selectedBattle = null;
  let battleData = [];
  if (selected > 0) {
    selectedBattle = filteredBattles.find(b => b.BattleIndex === selected);
    battleData = selectedBattle?.BattleData;
  }
  if (selectedSeason !== 'overall' && seasonStandings[selectedSeason]) {
    standings = seasonStandings[selectedSeason];
  }

  useEffect(() => {
    fetch(ShortName);
  }, []);

  if (loading || !data) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout edge t={`Battle League - ${data ? data.LeagueName : ShortName}`}>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(_e, value) => {
          setTab(value);
          if (value === 'standings') {
            setSelected(-1);
            setSelectedId(-1);
          }
        }}
      >
        <Tab label="Events" value="events" />
        <Tab label="Standings" value="standings" />
        <Tab label="Detailed" value="detailed" />
        {nickId() === data.KuskiIndex && <Tab label="Admin" value="admin" />}
      </Tabs>
      <LeagueName>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={4}>
            <Header h1>{data.LeagueName}</Header>
          </Grid>
          <Grid item xs={12} sm={8}>
            {data.LeagueDescription}
          </Grid>
        </Grid>
      </LeagueName>
      {tab === 'events' && (
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
            {filteredBattles.map((b, i) => (
              <EventItem
                key={`${b.BattleIndex}${i}`}
                i={i}
                selected={selectedId}
                onClick={() => {
                  if (i === selectedId) {
                    setSelected(-1);
                    setSelectedId(-1);
                  } else {
                    setSelected(b.BattleIndex);
                    setSelectedId(i);
                  }
                }}
                level={
                  b.BattleIndex && b.BattleData ? (
                    <Link to={`/battles/${b.BattleIndex}`}>
                      {b.BattleData.LevelData.LevelName}{' '}
                      {BATTLETYPES_LONG[b.BattleData.BattleType]}
                    </Link>
                  ) : (
                    <span>{b.LevelName}</span>
                  )
                }
                by={
                  <Kuski
                    kuskiData={
                      b.BattleData ? b.BattleData.KuskiData : b.DesignerData
                    }
                  />
                }
                eventTime={
                  <LocalTime
                    date={
                      b.BattleData
                        ? parseInt(b.BattleData.Started)
                        : parseInt(b.Started)
                    }
                    format="eee d MMM yyyy HH:mm"
                    parse="X"
                  />
                }
                start={
                  b.BattleData ? parseInt(b.BattleData.Started) : b.Started
                }
                end={
                  b.BattleData
                    ? parseInt(b.BattleData.Started) +
                      b.BattleData.Duration * 60
                    : 0
                }
                winner={
                  b.BattleData?.Results?.length > 0 ? (
                    <>
                      <Time
                        time={b.BattleData.Results[0].Time}
                        apples={b.BattleData.Results[0].Apples}
                      />{' '}
                      <Kuski kuskiData={b.BattleData.Results[0].KuskiData} />
                    </>
                  ) : (
                    ''
                  )
                }
              />
            ))}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BattleStatus
              battles={filteredBattles}
              breakMinutes={data?.Settings?.break}
              onBattleEnd={() => fetch(ShortName)}
            />
            {selected !== -1 ? (
              <Paper width="auto">
                <ListContainer>
                  <ListHeader>
                    <ListCell right width={30}>
                      #
                    </ListCell>
                    <ListCell width={200}>Kuski</ListCell>
                    <ListCell width={150}>Result</ListCell>
                    <ListCell>Points</ListCell>
                  </ListHeader>
                  {battleData?.Results?.length > 0 &&
                    getSortedResultsWithPoints({
                      results: battleData.Results,
                      battleType: battleData.BattleType,
                      pointSystem: data?.PointSystem,
                      pointsEnum,
                      referenceResultCount,
                    }).map(r => (
                      <ListRow key={r.BattleTimeIndex}>
                        <ListCell right width={30}>
                          {r.Position}.
                        </ListCell>
                        <ListCell width={200}>
                          <Kuski kuskiData={r.KuskiData} flag team />
                        </ListCell>
                        <ListCell width={150}>
                          {data?.PointSystem === 3 ? (
                            <ResultEditor
                              result={r}
                              canEdit={nickId() === data.KuskiIndex}
                              battleLeagueBattleIndex={
                                selectedBattle?.BattleLeagueBattleIndex
                              }
                              battleLeagueIndex={data.BattleLeagueIndex}
                              onSaved={() => fetch(ShortName)}
                            />
                          ) : (
                            <Time time={r.Time} apples={r.Apples} />
                          )}
                        </ListCell>
                        {data?.PointSystem === 3 ? (
                          <ListCell>{r.Points} pts.</ListCell>
                        ) : r.Points ? (
                          <ListCell>{r.Points} pts.</ListCell>
                        ) : (
                          <ListCell />
                        )}
                      </ListRow>
                    ))}
                  {data?.PointSystem === 3 && (
                    <ListRow key="new-result-row">
                      <ListCell right width={30}>
                        +
                      </ListCell>
                      <ListCell width={200}>
                        <ResultEditor
                          canEdit={nickId() === data.KuskiIndex}
                          battleLeagueBattleIndex={
                            selectedBattle?.BattleLeagueBattleIndex
                          }
                          battleLeagueIndex={data.BattleLeagueIndex}
                          onSaved={() => fetch(ShortName)}
                          isNewEntry
                        />
                      </ListCell>
                      <ListCell width={150} />
                      <ListCell />
                    </ListRow>
                  )}
                </ListContainer>
              </Paper>
            ) : null}
          </Grid>
        </Grid>
      )}
      {tab === 'standings' && (
        <Grid container spacing={0}>
          {seasons.length > 0 && (
            <Grid item xs={12} sm={6}>
              <SeasonItem
                name="Overall"
                selected={selectedSeason}
                onClick={n => setSelectedSeason(n)}
              />
              {seasons.map(s => (
                <SeasonItem
                  name={s}
                  selected={selectedSeason}
                  onClick={n => setSelectedSeason(n)}
                />
              ))}
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            {standings?.length > 0 && (
              <Paper width="auto">
                <ListContainer>
                  <ListHeader>
                    <ListCell right width={30}>
                      #
                    </ListCell>
                    <ListCell width={200}>Kuski</ListCell>
                    <ListCell>Points</ListCell>
                  </ListHeader>
                  {standings
                    .sort((a, b) => b.Points - a.Points)
                    .map((r, i) => (
                      <ListRow key={r.KuskiIndex}>
                        <ListCell right width={30}>
                          {i + 1}.
                        </ListCell>
                        <ListCell width={200}>
                          <Kuski kuskiData={r.KuskiData} flag team />
                        </ListCell>
                        <ListCell>{r.Points} pts.</ListCell>
                      </ListRow>
                    ))}
                </ListContainer>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}
      {tab === 'detailed' && (
        <Grid container spacing={0}>
          <BattleStatus
            battles={filteredBattles}
            breakMinutes={data?.Settings?.break}
            onBattleEnd={() => fetch(ShortName)}
          />
          <Detailed
            battles={filteredBattles}
            standings={overallStandings}
            pointSystem={data?.PointSystem}
            pointsEnum={pointsEnum}
            referenceResultCount={referenceResultCount}
          />
        </Grid>
      )}
      {tab === 'admin' && <Admin BattleLeagueIndex={data.BattleLeagueIndex} />}
    </Layout>
  );
};

const LeagueName = styled.div`
  padding: 8px;
`;

export default BattleLeague;
