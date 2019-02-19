import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
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
import s from './Battle.css';
import battleQuery from './battle.graphql';
import Recplayer from '../../components/Recplayer';
import { Level, BattleType } from '../../components/Names';
import Time from '../../components/Time';
import Chat from '../../components/Chat';
import LocalTime from '../../components/LocalTime';

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

    if (!getBattle) return null;

    return (
      <div className={s.root}>
        <div className={s.playerContainer}>
          <div className={s.player}>
            <Recplayer
              rec={`/dl/battlereplay/${BattleIndex}`}
              lev={`/dl/level/${getBattle.LevelIndex}`}
              controls
            />
          </div>
        </div>
        <div className={s.rightBarContainer}>
          <div className={s.chatContainer}>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">
                  <React.Fragment>
                    <Level index={getBattle.LevelIndex} />.lev by{' '}
                    {getBattle.KuskiData.Kuski}
                  </React.Fragment>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div className={s.battleDescription}>
                  {getBattle.Duration} minute{' '}
                  <span className={s.battleType}>
                    <BattleType type={getBattle.BattleType} />
                  </span>{' '}
                  battle
                  <div className={s.battleTimestamp}>
                    <LocalTime
                      date={getBattle.Started}
                      format="DD.MM.YYYY HH:mm:ss"
                      parse="X"
                    />
                  </div>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">Chat</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Chat
                  start={getBattle.Started}
                  end={
                    Number(getBattle.Started) + Number(getBattle.Duration * 60)
                  }
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </div>
        <div className={s.levelStatsContainer}>
          <Paper>
            {getBattle.Results && (
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
                        width: '10rem',
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
                        {r.KuskiData.Kuski}{' '}
                        {r.KuskiData.TeamData &&
                          `[${r.KuskiData.TeamData.Team}]`}
                      </TableCell>
                      <TableCell>
                        <Time time={r.Time} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
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
