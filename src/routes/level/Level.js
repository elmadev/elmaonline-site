import React from 'react';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import withStyles from 'isomorphic-style-loader/withStyles';
import query from './level.graphql';
import allTimesQuery from './allTimes.graphql';
import s from './Level.css';
import { Kuski, BattleType } from '../../components/Names';
import history from '../../history';
import Recplayer from '../../components/Recplayer';
import RecList from '../../components/RecList';
import Loading from '../../components/Loading';
import Time from '../../components/Time';
import Link from '../../components/Link';
import LocalTime from '../../components/LocalTime';
import historyRefresh from '../../historyRefresh';

const TimeTable = withStyles(s)(({ data }) => (
  <div>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell
            style={{
              width: 1,
            }}
          >
            #
          </TableCell>
          <TableCell
            style={{
              width: 200,
            }}
          >
            Kuski
          </TableCell>
          <TableCell>Time</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data &&
          data.map((t, i) => (
            <TableRow key={t.TimeIndex}>
              <TableCell>{i + 1}.</TableCell>
              <TableCell>
                {t.KuskiData.Kuski}{' '}
                {t.KuskiData.TeamData && `[${t.KuskiData.TeamData.Team}]`}
              </TableCell>
              <TableCell>
                <Time time={t.Time} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
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
    } = this.props;
    const isWindow = typeof window !== 'undefined';
    return (
      <div className={s.root}>
        <div className={s.playerContainer}>
          <div className={s.player}>
            {isWindow && (
              <Recplayer
                lev={`/dl/level/${this.props.LevelIndex}`}
                controls={false}
              />
            )}
          </div>
        </div>
        <div className={s.rightBarContainer}>
          <div className={s.chatContainer}>
            {loading && <Loading />}
            {!loading && (
              <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body1">Level info</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div className={s.levelDescription}>
                    {getLevel.LevelName}.lev
                    <div className={s.levelFullName}>{getLevel.LongName}</div>
                    <br />
                    {'Level ID: '}
                    {`${this.props.LevelIndex}`}
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )}
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1">Battles in level</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div>
                  <Table style={{ overflowX: 'auto' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Started</TableCell>
                        <TableCell>Started by</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Battle ID</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading
                        ? 'Loading...'
                        : getBattlesForLevel.map(i => (
                            <TableRow
                              style={
                                i.InQueue === 0 &&
                                i.Aborted === 0 &&
                                i.Finished === 0
                                  ? {
                                      cursor: 'pointer',
                                      backgroundColor: '#2566a7',
                                    }
                                  : { cursor: 'pointer' }
                              }
                              hover
                              key={i.BattleIndex}
                              onClick={() => {
                                this.gotoBattle(i.BattleIndex);
                              }}
                            >
                              <TableCell>
                                {i.InQueue === 1 ? (
                                  'Queued'
                                ) : (
                                  <Link to={`/battles/${i.BattleIndex}`}>
                                    <LocalTime
                                      date={i.Started}
                                      format="DD MMM YYYY HH:mm:ss"
                                      parse="X"
                                    />
                                  </Link>
                                )}
                              </TableCell>
                              <TableCell>
                                <Kuski index={i.KuskiIndex} />
                              </TableCell>
                              <TableCell>
                                <BattleType type={i.BattleType} />
                              </TableCell>
                              <TableCell>{i.Duration}</TableCell>
                              <TableCell>{i.BattleIndex}</TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1">Replays in level</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
                <RecList
                  LevelIndex={this.props.LevelIndex}
                  openReplay={uuid => historyRefresh.push(`/r/${uuid}`)}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </div>
        <div className={s.resultsContainer}>
          <Paper>
            {loading && <Loading />}
            {!loading && (
              <React.Fragment>
                <Tabs value={this.state.tab} onChange={this.onTabClick}>
                  <Tab label="Best times" />
                  <Tab label="All times" />
                  <Tab label="Best multi times" />
                  <Tab label="All multi times" />
                </Tabs>
                {this.state.tab === 0 && <TimeTable data={getBestTimes} />}
                {this.state.tab === 1 && <TimeTable data={getBestTimes} />}
                {this.state.tab === 2 && <TimeTable data={getBestTimes} />}
                {this.state.tab === 3 && (
                  <AllTimes LevelIndex={this.props.LevelIndex} />
                )}
              </React.Fragment>
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
