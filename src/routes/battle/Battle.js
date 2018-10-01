import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Moment from 'react-moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import s from './Battle.css';
import battleQuery from './battle.graphql';
import Recplayer from '../../components/Recplayer';
import { Level, BattleType, Kuski } from '../../components/Names';
import Time from '../../components/Time';
import Chat from '../../components/Chat';

class Battle extends React.Component {
  static propTypes = {
    BattleIndex: PropTypes.number.isRequired,
    data: PropTypes.shape({
      Loading: PropTypes.bool,
      getBattle: PropTypes.shape({
        LevelIndex: PropTypes.number,
      }),
    }).isRequired,
  };

  render() {
    const { BattleIndex } = this.props;
    const { data: { getBattle } } = this.props;

    return (
      <div className={s.root}>
        <div className={s.playerContainer}>
          <div className={s.player}>
            {!getBattle && <CircularProgress />}
            {getBattle && (
              <Recplayer
                rec={`/dl/battlereplay/${BattleIndex}`}
                lev={`/dl/level/${getBattle.LevelIndex}`}
                controls
              />
            )}
          </div>
        </div>
        <div className={s.rightBarContainer}>
          {getBattle && (
            <div className={s.title}>
              <div className={s.battleDescription}>
                <Typography variant="subheading">
                  {getBattle.Duration} minute{' '}
                  <span className={s.battleType}>
                    <BattleType type={getBattle.BattleType} />
                  </span>{' '}
                  battle in <Level index={getBattle.LevelIndex} />.lev by{' '}
                  {getBattle.KuskiData.Kuski}
                </Typography>
              </div>
              <div className={s.battleTimestamp}>
                <Moment parse="X" format="DD MMM YYYY HH:mm:ss">
                  {getBattle.Started}
                </Moment>
              </div>
            </div>
          )}
          <br />
          <div className={s.chatContainer}>
            <ExpansionPanel defaultExpanded={1}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Chat</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {getBattle && (
                  <Chat
                    start={getBattle.Started}
                    end={
                      Number(getBattle.Started) +
                      Number(getBattle.Duration * 60)
                    }
                  />
                )}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </div>
        <div className={s.levelStatsContainer}>
          <Typography variant="headline" gutterBottom>
            Battle results
          </Typography>
          {getBattle &&
            getBattle.Results && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        width: '.5rem',
                      }}
                    >
                      #
                    </TableCell>
                    <TableCell
                      style={{
                        width: '6rem',
                      }}
                    >
                      Kuski
                    </TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getBattle.Results.map((r, i) => (
                    <TableRow key={r.KuskiIndex}>
                      <TableCell>{i + 1}.</TableCell>
                      <TableCell>
                        <Kuski index={r.KuskiIndex} />
                      </TableCell>
                      <TableCell>
                        <Time time={r.Time} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(battleQuery, {
    options: ownProps => ({
      variables: {
        BattleIndex: ownProps.BattleIndex,
      },
    }),
  }),
)(Battle);
