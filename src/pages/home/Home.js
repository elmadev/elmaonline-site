import React from 'react';
import PropTypes from 'prop-types';
import m from 'moment';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { Level, BattleType } from 'components/Names';
import Kuski from 'components/Kuski';
import Upload from 'components/Upload';
import Header from 'components/Header';
import RecListItem from 'components/RecListItem';
import Login from 'components/Login';
import Welcome from 'components/Welcome';
import BattleCard from 'components/BattleCard';
import Link from 'components/Link';
import LocalTime from 'components/LocalTime';
import history from 'utils/history';
import { sortResults, battleStatus, battleStatusBgColor } from 'utils/battle';
import { toLocalTime } from 'utils/time';
import { nickId } from 'utils/nick';

import homeQuery from './home.graphql'; // import the graphql query here
import s from './Home.css';

class Home extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
      battles: PropTypes.arrayOf(
        PropTypes.shape({
          BattleIndex: PropTypes.number.isRequired,
          LevelIndex: PropTypes.number.isRequired,
          KuskiIndex: PropTypes.number.isRequired,
          BattleType: PropTypes.string.isRequired,
          Started: PropTypes.string.isRequired,
          Duration: PropTypes.number.isRequired,
        }),
      ),
    }).isRequired,
  };

  gotoBattle = battleIndex => {
    if (!Number.isNaN(battleIndex)) {
      history.push(`/battles/${battleIndex}`);
    }
  };

  remaining = (started, duration) => {
    const now = m().format('X');
    const remain = Math.round(
      (now - toLocalTime(started, 'X').format('X')) / 60,
      0,
    );
    return `${Math.min(remain, duration)}/${duration}`;
  };

  render() {
    const {
      data: { loading, getBattles, getReplays, refetch },
    } = this.props; // deconstruct this.props here to get some nicer sounding variable names
    const battleList = loading ? null : getBattles.slice(0, 25); // : getBattles.filter(b => b.Aborted === 0).slice(0, 25);
    const currentBattle = loading
      ? null
      : getBattles.filter(
          i => i.InQueue === 0 && i.Finished === 0 && i.Aborted === 0,
        )[0];
    return (
      <div className={s.root}>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={7}>
            {nickId() === 0 && (
              <>
                <Header h2>Welcome</Header>
                <Welcome />
              </>
            )}
            {currentBattle && <BattleCard battle={currentBattle} />}
            <Header h2>Latest Battles</Header>
            <Paper style={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Started</TableCell>
                    <TableCell>Designer</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Winner</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* iterate the data object here, loading is an object created automatically which will be true while loading the data */}
                  {loading ? (
                    <TableRow>
                      <TableCell style={{ padding: '4px 10px 4px 10px' }}>
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : (
                    battleList.map(i => {
                      const sortedResults = [...i.Results].sort(
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
                          <TableCell style={{ padding: '4px 10px 4px 10px' }}>
                            <Link to={`/battles/${i.BattleIndex}`}>
                              <LocalTime
                                date={i.Started}
                                format="HH:mm:ss"
                                parse="X"
                              />
                            </Link>
                          </TableCell>
                          <TableCell style={{ padding: '4px 10px 4px 10px' }}>
                            <Kuski kuskiData={i.KuskiData} team flag />
                          </TableCell>
                          <TableCell style={{ padding: '4px 10px 4px 10px' }}>
                            <Link to={`/dl/level/${i.LevelIndex}`}>
                              <Level LevelData={i.LevelData} />
                            </Link>
                          </TableCell>
                          <TableCell style={{ padding: '4px 10px 4px 10px' }}>
                            {i.Finished === 1 && sortedResults.length > 0 ? (
                              <Kuski
                                kuskiData={sortedResults[0].KuskiData}
                                team
                                flag
                              />
                            ) : (
                              battleStatus(i)
                            )}
                          </TableCell>
                          <TableCell style={{ padding: '4px 10px 4px 10px' }}>
                            <BattleType type={i.BattleType} />
                          </TableCell>
                          <TableCell style={{ padding: '4px 10px 4px 10px' }}>
                            {battleStatus(i) === 'Ongoing'
                              ? this.remaining(i.Started, i.Duration)
                              : i.Duration}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Login />
            <Header h2>Upload Replays</Header>
            <Upload onUpload={() => refetch()} filetype=".rec" />
            <Header h2>Latest Replays</Header>
            <Paper style={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Replay</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell style={{ padding: '4px 10px 4px 10px' }}>
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : (
                    getReplays.map(i => (
                      <RecListItem key={i.ReplayIndex} replay={i} />
                    ))
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(homeQuery),
)(Home); // place the query object in the graphql decorator here so it's available in the this.props object
