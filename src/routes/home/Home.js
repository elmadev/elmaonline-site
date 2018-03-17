import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
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
        <div className={s.container}>
          <h1>Latest Battles</h1>
          {/* iterate the data object here, loading is an object created automatically which will be true while loading the data */}
          {loading
            ? 'Loading...'
            : getBattles.map(i => (
                <div key={i.BattleIndex}>
                  <h2>
                    {i.BattleIndex} - {i.LevelIndex} by {i.KuskiIndex}
                  </h2>
                  <div>Type: {i.BattleType}</div>
                  <div>Started: {i.Started}</div>
                  <div>Duration: {i.Duration}</div>
                </div>
              ))}
          <h1>Latest Replays</h1>
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
        </div>
      </div>
    );
  }
}

export default compose(withStyles(s), graphql(homeQuery))(Home); // place the query object in the graphql decorator here so it's available in the this.props object
