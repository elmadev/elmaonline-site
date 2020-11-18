import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
} from '@material-ui/core';
import styled from 'styled-components';
import { ExpandMore } from '@material-ui/icons';
import { Paper } from 'styles/Paper';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Kuski from 'components/Kuski';
import Recplayer from 'components/Recplayer';
import RecList from 'components/RecList';
import Loading from 'components/Loading';
import Link from 'components/Link';
import Play from 'styles/Play';
import LocalTime from 'components/LocalTime';
import history from 'utils/history';
import { sortResults, battleStatus, battleStatusBgColor } from 'utils/battle';
import TimeTable from './TimeTable';
import StatsTable from './StatsTable';

const Level = ({ LevelIndex }) => {
  const [tab, setTab] = useState(0);
  const [play, setPlay] = useState(
    navigator.userAgent.toLowerCase().indexOf('firefox') === -1,
  );
  const {
    besttimes,
    besttimesLoading,
    level,
    battlesForLevel,
    loading,
    allfinished,
    allLoading,
    eoltimes,
    eolLoading,
    timeStats,
    statsLoading,
  } = useStoreState(state => state.Level);
  const {
    getBesttimes,
    getLevel,
    getAllfinished,
    getEoltimes,
    getTimeStats,
  } = useStoreActions(actions => actions.Level);

  useEffect(() => {
    getBesttimes({ levelId: LevelIndex, limit: 10000, eolOnly: 0 });
    getLevel(LevelIndex);
  }, []);

  const onTabClick = (e, value) => {
    setTab(value);
    if (
      value === 1 &&
      (allfinished.length === 0 || allLoading !== LevelIndex)
    ) {
      getAllfinished(LevelIndex);
    }
    if (
      value === 2 &&
      (timeStats.length === 0 || statsLoading !== LevelIndex)
    ) {
      getTimeStats(LevelIndex);
    }
    if (value === 3 && (eoltimes.length === 0 || eolLoading !== LevelIndex)) {
      getEoltimes({ levelId: LevelIndex, limit: 10000, eolOnly: 1 });
    }
  };

  const goToBattle = battleIndex => {
    if (!Number.isNaN(battleIndex)) {
      history.push(`/battles/${battleIndex}`);
    }
  };

  const isWindow = typeof window !== 'undefined';

  return (
    <Container>
      <PlayerContainer>
        {loading && <Loading />}
        {!loading && (
          <Player>
            {play ? (
              <>
                {isWindow &&
                  (battlesForLevel.length < 1 ||
                    battleStatus(battlesForLevel[0]) !== 'Queued') && (
                    <Recplayer lev={`/dl/level/${LevelIndex}`} controls />
                  )}
              </>
            ) : (
              <Play type="map" onClick={() => setPlay(true)} />
            )}
          </Player>
        )}
      </PlayerContainer>
      <RightBarContainer>
        <ChatContainer>
          {loading && <Loading />}
          {!loading && (
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body2">Level info</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <LevelDescription>
                  <a href={`/dl/level/${LevelIndex}`}>{level.LevelName}.lev</a>
                  <LevelFullName>{level.LongName}</LevelFullName>
                  <br />
                  {'Level ID: '}
                  {`${LevelIndex}`}
                  {level.Legacy !== 0 && (
                    <div>
                      This level has legacy times imported from a third party
                      site.
                    </div>
                  )}
                </LevelDescription>
              </AccordionDetails>
            </Accordion>
          )}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Battles in level</Typography>
            </AccordionSummary>
            <AccordionBattles>
              <BattlesContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Started</TableCell>
                      <TableCell>Designer</TableCell>
                      <TableCell>Winner</TableCell>
                      <TableCell>Battle ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loading &&
                      battlesForLevel.map(i => {
                        const sorted = [...i.Results].sort(
                          sortResults(i.BattleType),
                        );
                        return (
                          <BattleRow
                            bg={battleStatusBgColor(i)}
                            hover
                            key={i.BattleIndex}
                            onClick={() => {
                              goToBattle(i.BattleIndex);
                            }}
                          >
                            <TableCell>
                              <Link to={`/battles/${i.BattleIndex}`}>
                                <LocalTime
                                  date={i.Started}
                                  format="DD MMM YYYY HH:mm:ss"
                                  parse="X"
                                />
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Kuski kuskiData={i.KuskiData} team flag />
                            </TableCell>
                            <TableCell>
                              {i.Finished === 1 && sorted.length > 0 ? (
                                <Kuski
                                  kuskiData={sorted[0].KuskiData}
                                  team
                                  flag
                                />
                              ) : (
                                battleStatus(i)
                              )}
                            </TableCell>
                            <TableCell>{i.BattleIndex}</TableCell>
                          </BattleRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </BattlesContainer>
            </AccordionBattles>
          </Accordion>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Replays in level</Typography>
            </AccordionSummary>
            <AccordionReplays>
              <RecList
                LevelIndex={LevelIndex}
                columns={['Replay', 'Time', 'By']}
                horizontalMargin={-24}
              />
            </AccordionReplays>
          </Accordion>
        </ChatContainer>
      </RightBarContainer>
      <ResultsContainer>
        <Paper>
          {loading && <Loading />}
          {!loading && (
            <>
              <Tabs
                variant="scrollable"
                scrollButtons="auto"
                value={tab}
                onChange={(e, value) => onTabClick(e, value)}
              >
                <Tab label="Best times" />
                <Tab label="All times" />
                <Tab label="Personal stats" />
                {level.Legacy && <Tab label="EOL times" />}
              </Tabs>
              {tab === 0 && (
                <TimeTable
                  loading={besttimesLoading}
                  data={besttimes}
                  latestBattle={battlesForLevel[0]}
                />
              )}
              {tab === 1 && (
                <TimeTable
                  loading={allLoading !== LevelIndex}
                  data={allfinished}
                  latestBattle={battlesForLevel[0]}
                />
              )}
              {tab === 2 && (
                <StatsTable
                  data={timeStats}
                  loading={statsLoading !== LevelIndex}
                />
              )}
              {tab === 3 && (
                <TimeTable
                  loading={eolLoading !== LevelIndex}
                  data={eoltimes}
                  latestBattle={battlesForLevel[0]}
                />
              )}
            </>
          )}
        </Paper>
      </ResultsContainer>
    </Container>
  );
};

const AccordionReplays = styled(AccordionDetails)`
  & {
    flex-direction: column;
  }
`;

const AccordionBattles = styled(AccordionDetails)`
  && {
    padding-left: 0;
    padding-right: 0;
  }
`;

const BattleRow = styled(TableRow)`
  && {
    cursor: pointer;
    background-color: ${p => p.bg};
  }
`;

const ResultsContainer = styled.div`
  width: 60%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
`;

const BattlesContainer = styled.div`
  width: 100%;
`;

const LevelFullName = styled.div`
  color: #7d7d7d;
`;

const LevelDescription = styled.div`
  font-size: 14px;
`;

const ChatContainer = styled.div`
  clear: both;
`;

const RightBarContainer = styled.div`
  float: right;
  width: 40%;
  padding: 7px;
  box-sizing: border-box;
`;

const Container = styled.div`
  padding: 7px;
`;

const PlayerContainer = styled.div`
  width: 60%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
`;

const Player = styled.div`
  background: #f1f1f1;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

Level.propTypes = {
  LevelIndex: PropTypes.number.isRequired,
};

export default Level;
