import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Tabs,
  Tab,
} from '@material-ui/core';
import styled from 'styled-components';
import { ExpandMore } from '@material-ui/icons';
import { ListContainer, ListHeader, ListCell, ListRow } from 'styles/List';
import { Paper } from 'styles/Paper';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Kuski from 'components/Kuski';
import Recplayer from 'components/Recplayer';
import RecList from 'components/RecList';
import Loading from 'components/Loading';
import Time from 'components/Time';
import Link from 'components/Link';
import LocalTime from 'components/LocalTime';
import history from 'utils/history';
import { sortResults, battleStatus, battleStatusBgColor } from 'utils/battle';

const TimeTable = ({ data, latestBattle }) => (
  <div>
    <ListContainer>
      <ListHeader>
        <ListCell right width={30}>
          #
        </ListCell>
        <ListCell width={200}>Kuski</ListCell>
        <ListCell right width={200}>
          Time
        </ListCell>
        <ListCell />
      </ListHeader>
      {data &&
        (!latestBattle ||
          latestBattle.Finished === 1 ||
          latestBattle.Aborted === 1) &&
        data.map((t, i) => (
          <ListRow key={t.TimeIndex}>
            <ListCell right width={30}>
              {i + 1}.
            </ListCell>
            <ListCell width={200}>
              {t.KuskiData.Kuski}{' '}
              {t.KuskiData.TeamData && `[${t.KuskiData.TeamData.Team}]`}
            </ListCell>
            <ListCell width={200} right>
              <Time time={t.Time} />
            </ListCell>
            <ListCell />
          </ListRow>
        ))}
    </ListContainer>
  </div>
);

TimeTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const Level = ({ LevelIndex }) => {
  const [tab, setTab] = useState(0);
  const {
    besttimes,
    level,
    battlesForLevel,
    loading,
    allfinished,
  } = useStoreState(state => state.Level);
  const { getBesttimes, getLevel, getAllfinished } = useStoreActions(
    actions => actions.Level,
  );

  useEffect(() => {
    getBesttimes({ levelId: LevelIndex, limit: 10000 });
    getLevel(LevelIndex);
  }, []);

  const onTabClick = (e, value) => {
    setTab(value);
    if (value === 1 && allfinished.length === 0) {
      getAllfinished(LevelIndex);
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
            {isWindow &&
              (battlesForLevel.length < 1 ||
                battleStatus(battlesForLevel[0]) !== 'Queued') && (
                <Recplayer lev={`/dl/level/${LevelIndex}`} controls />
              )}
          </Player>
        )}
      </PlayerContainer>
      <RightBarContainer>
        <ChatContainer>
          {loading && <Loading />}
          {!loading && (
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography variant="body2">Level info</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <LevelDescription>
                  <a href={`/dl/level/${LevelIndex}`}>{level.LevelName}.lev</a>
                  <LevelFullName>{level.LongName}</LevelFullName>
                  <br />
                  {'Level ID: '}
                  {`${LevelIndex}`}
                </LevelDescription>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}
          <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Battles in level</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetailsBattles>
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
            </ExpansionPanelDetailsBattles>
          </ExpansionPanel>
          <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Replays in level</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetailsReplays>
              <RecList
                LevelIndex={LevelIndex}
                columns={['Replay', 'Time', 'By']}
                horizontalMargin={-24}
              />
            </ExpansionPanelDetailsReplays>
          </ExpansionPanel>
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
              </Tabs>
              {tab === 0 && (
                <TimeTable data={besttimes} latestBattle={battlesForLevel[0]} />
              )}
              {tab === 1 && (
                <TimeTable
                  data={allfinished}
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

const ExpansionPanelDetailsReplays = styled(ExpansionPanelDetails)`
  & {
    flex-direction: column;
  }
`;

const ExpansionPanelDetailsBattles = styled(ExpansionPanelDetails)`
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
