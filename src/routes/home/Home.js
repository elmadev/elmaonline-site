import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import homeQuery from './home.graphql'; // import the graphql query here
import s from './Home.css';

class Home extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
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

  render() {
    const { data: { loading, getBattles, getReplays } } = this.props; // deconstruct this.props here to get some nicer sounding variable names
    return (
      <div className={s.root}>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
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
                    : getBattles.map(i => (
                        <TableRow key={i.BattleIndex}>
                          <TableCell>
                            <Moment format="HH:mm:ss">{i.Started}</Moment>
                          </TableCell>
                          <TableCell>{i.LevelIndex}</TableCell>
                          <TableCell>{i.KuskiIndex}</TableCell>
                          <TableCell>{i.BattleType}</TableCell>
                          <TableCell>{i.Duration}</TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="display2" gutterBottom>
              Latest Replays
            </Typography>
            {loading
              ? 'Loading...'
              : getReplays.map(i => (
                  <div key={i.ReplayIndex}>
                    <h2>
                      {i.ReplayTime} in {i.LevelIndex} by {i.KuskiIndex}
                    </h2>
                    <div>Uploaded: {i.Uploaded}</div>
                  </div>
                ))}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(withStyles(s), graphql(homeQuery))(Home); // place the query object in the graphql decorator here so it's available in the this.props object
