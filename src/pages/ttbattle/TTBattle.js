import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { graphql, compose } from 'react-apollo';
import Button from '@material-ui/core/Button';
import TTBattleResults from 'components/TTBattleResults';
import ttbattleQuery from './ttbattle.graphql';

const pad = number => {
  if (number < 10) {
    return `0${number}`;
  }
  return number;
};

class TTBattle extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      Loading: PropTypes.bool,
      getTTBattle: PropTypes.shape({
        TTBattleIndex: PropTypes.number,
        KuskiIndex: PropTypes.number,
        TTBattleName: PropTypes.string,
        Levels: PropTypes.string,
        StartTime: PropTypes.number,
        Duration: PropTypes.number,
      }),
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      countdown: 0,
      status: '',
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown() {
    const {
      data: { getTTBattle },
    } = this.props;
    let start = 0;
    let end = 0;
    if (getTTBattle) {
      start = getTTBattle.StartTime - moment().format('X');
      end =
        getTTBattle.Duration * 60 +
        getTTBattle.StartTime -
        moment().format('X');
    }
    if (start > 0) {
      this.setState({
        countdown: start,
        status: 'waiting',
      });
    } else if (end > 0) {
      this.setState({
        countdown: end,
        status: 'ongoing',
      });
    } else {
      this.setState({ status: 'ended' });
    }
  }

  render() {
    const {
      data: { getTTBattle, refetch },
    } = this.props;
    if (!getTTBattle) return <div>TT Battle does not exist</div>;
    const { countdown, status } = this.state;
    const duration = moment.duration(countdown * 1000);
    return (
      <div>
        <Button variant="contained" onClick={() => refetch()}>
          Refetch
        </Button>
        {(status === 'waiting' || status === 'ongoing') && (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: 36 }}>
              {`TT Battle "${getTTBattle.TTBattleName}" `}
              {status === 'waiting' && 'Starting in'}
              {status === 'ongoing' && 'Ending in'}
            </div>
            <div style={{ fontSize: 96 }}>
              {duration.days() > 0 && `${duration.days()} days`}
              {`${pad(duration.hours())}:${pad(duration.minutes())}:${pad(
                duration.seconds(),
              )}`}
            </div>
          </div>
        )}
        {status === 'ended' && <TTBattleResults levels={getTTBattle.Levels} />}
      </div>
    );
  }
}

export default compose(
  graphql(ttbattleQuery, {
    options: ownProps => ({
      variables: {
        TTBattleIndex: ownProps.TTBattleIndex,
      },
    }),
  }),
)(TTBattle);
