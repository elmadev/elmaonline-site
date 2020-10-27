import React from 'react';
import { graphql, compose } from 'react-apollo';
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
import { ExpandMore } from '@material-ui/icons';
import { ListContainer, ListHeader, ListCell, ListRow } from 'styles/List';
import { Paper } from 'styles/Paper';
import withStyles from 'isomorphic-style-loader/withStyles';

import Kuski from 'components/Kuski';
import Recplayer from 'components/Recplayer';
import RecList from 'components/RecList';
import Loading from 'components/Loading';
import Time from 'components/Time';
import Link from 'components/Link';
import LocalTime from 'components/LocalTime';
import history from 'utils/history';
import { sortResults, battleStatus, battleStatusBgColor } from 'utils/battle';

import query from './level.graphql';
import allTimesQuery from './allTimes.graphql';
import s from './Level.css';

const TimeTable = withStyles(s)(({ data, latestBattle }) => (
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
));

TimeTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()),
};

const AllTimes = compose(
  withStyles(s),
  graphql(allTimesQuery, {
    options: ownProps => ({
      variables: {
        LevelIndex: ownProps.LevelIndex,
      },
    }),
  }),
)(props => {
  const {
    data: { getTimes, loading },
  } = props;
  return loading ? <Loading /> : <TimeTable data={getTimes} />;
});

class Level extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
  }

  onTabClick = (e, value) => {
    this.setState({
      tab: value,
    });
  };

  gotoBattle = battleIndex => {
    if (!Number.isNaN(battleIndex)) {
      history.push(`/battles/${battleIndex}`);
    }
  };

  render() {
    const {
      data: { getBestTimes, getLevel, getBattlesForLevel, loading },
      LevelIndex,
    } = this.props;
    const { tab } = this.state;
    const isWindow = typeof window !== 'undefined';
    return (
      <div className={s.root}>
        <div className={s.playerContainer}>
          {loading && <Loading />}
          {!loading && (
            <div className={s.player}>
              {isWindow &&
                (getBattlesForLevel.length < 1 ||
                  battleStatus(getBattlesForLevel[0]) !== 'Queued') && (
                  <Recplayer lev={`/dl/level/${LevelIndex}`} controls />
                )}
            </div>
          )}
        </div>
        <div className={s.rightBarContainer}>
          <div className={s.chatContainer}>
            {loading && <Loading />}
            {!loading && (
              <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                  <Typography variant="body2">Level info</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div className={s.levelDescription}>
                    <a href={`/dl/level/${LevelIndex}`}>
                      {getLevel.LevelName}.lev
                    </a>
                    <div className={s.levelFullName}>{getLevel.LongName}</div>
                    <br />
                    {'Level ID: '}
                    {`${LevelIndex}`}
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )}
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography variant="body2">Battles in level</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails
                style={{ paddingLeft: 0, paddingRight: 0 }}
              >
                <div style={{ width: '100%' }}>
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
                        getBattlesForLevel.map(i => {
                          const sorted = [...i.Results].sort(
                            sortResults(i.BattleType),
                          );
                          return (
                            <TableRow
                              style={{
                                cursor: 'pointer',
                                backgroundColor: battleStatusBgColor(i),
                              }}
                              hover
                              key={i.BattleIndex}
                              onClick={() => {
                                this.gotoBattle(i.BattleIndex);
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
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography variant="body2">Replays in level</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
                <RecList
                  LevelIndex={LevelIndex}
                  columns={['Replay', 'Time', 'By']}
                  horizontalMargin={-24}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </div>
        <div className={s.resultsContainer}>
          <Paper>
            {loading && <Loading />}
            {!loading && (
              <>
                <Tabs
                  variant="scrollable"
                  scrollButtons="auto"
                  value={tab}
                  onChange={this.onTabClick}
                >
                  <Tab label="Best times" />
                  <Tab label="All times" />
                  {/* <Tab label="Best multi times" />
                  <Tab label="All multi times" /> */}
                </Tabs>
                {tab === 0 && (
                  <TimeTable
                    data={getBestTimes}
                    latestBattle={getBattlesForLevel[0]}
                  />
                )}
                {tab === 1 && <AllTimes LevelIndex={LevelIndex} />}
                {tab === 2 && <TimeTable data={getBestTimes} />}
                {tab === 3 && <AllTimes LevelIndex={LevelIndex} />}
              </>
            )}
          </Paper>
        </div>
      </div>
    );
  }
}

Level.propTypes = {
  LevelIndex: PropTypes.number.isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    getTimes: PropTypes.array,
  }).isRequired,
};

export default compose(
  withStyles(s),
  graphql(query, {
    options: ownProps => ({
      variables: {
        LevelIndex: ownProps.LevelIndex,
      },
    }),
  }),
)(Level);
