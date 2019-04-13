import React from 'react';
import PropTypes from 'prop-types';
import m from 'moment';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { toLocalTime } from 'utils';
import homeQuery from './home.graphql'; // import the graphql query here
import s from './Home.css';
import { Kuski, Level, BattleType } from '../../components/Names';
import history from '../../history';
import Upload from '../../components/Upload';
import RecListItem from '../../components/RecListItem';
import BattleCard from '../../components/BattleCard';
import Link from '../../components/Link';
import LocalTime from '../../components/LocalTime';

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
    const { data: { loading, getBattles, getReplays, refetch } } = this.props; // deconstruct this.props here to get some nicer sounding variable names
    const battleList = loading
      ? null
      : getBattles.filter(b => b.Aborted === 0).slice(0, 25);
    const currentBattle = loading
      ? null
      : getBattles.filter(
          i => i.InQueue === 0 && i.Finished === 0 && i.Aborted === 0,
        )[0];
    return (
      <div className={s.root}>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={7}>
            {currentBattle && <BattleCard battle={currentBattle} />}
            <Typography variant="display2" gutterBottom>
              Latest Battles
            </Typography>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Designer</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* iterate the data object here, loading is an object created automatically which will be true while loading the data */}
                  {loading
                    ? 'Loading...'
                    : battleList.map(i => (
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
                                  format="HH:mm:ss"
                                  parse="X"
                                />
                              </Link>
                            )}
                          </TableCell>
                          <TableCell>
                            <Level index={i.LevelIndex} />
                          </TableCell>
                          <TableCell>
                            <Kuski index={i.KuskiIndex} />
                          </TableCell>
                          <TableCell>
                            <BattleType type={i.BattleType} />
                          </TableCell>
                          <TableCell>
                            {i.InQueue === 0 &&
                            i.Aborted === 0 &&
                            i.Finished === 0
                              ? this.remaining(i.Started, i.Duration)
                              : i.Duration}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Typography variant="display2" gutterBottom>
              Upload Replays
            </Typography>
            <Upload onUpload={() => refetch()} filetype=".rec" />
            <Typography variant="display2" gutterBottom>
              Latest Replays
            </Typography>
            <Paper>
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
                  {loading
                    ? 'Loading...'
                    : getReplays.map(i => (
                        <RecListItem key={i.ReplayIndex} replay={i} />
                      ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(withStyles(s), graphql(homeQuery))(Home); // place the query object in the graphql decorator here so it's available in the this.props object
