import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, Query } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from 'isomorphic-style-loader/withStyles';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Paper } from 'styles/Paper';
import { ListContainer, ListHeader, ListCell, ListRow } from 'styles/List';
import Recplayer from 'components/Recplayer';
import { BattleType } from 'components/Names';
import Time from 'components/Time';
import Link from 'components/Link';
import Chat from 'components/Chat';
import Kuski from 'components/Kuski';
import LocalTime from 'components/LocalTime';
import LeaderHistory from 'components/LeaderHistory';
import { sortResults, battleStatus, getBattleType } from 'utils/battle';

import s from './Battle.css';
import battleQuery from './battle.graphql';

const GET_BATTLE_TIMES = gql`
  query($id: Int!) {
    getBattleTimes(BattleIndex: $id) {
      Time
      KuskiIndex
      KuskiIndex2
      Apples
      KuskiData {
        Kuski
        Country
        TeamData {
          Team
        }
      }
      KuskiData2 {
        Kuski
        Country
        TeamData {
          Team
        }
      }
    }
  }
`;

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

  constructor(props) {
    super(props);
    this.state = {
      extra: '',
    };
  }

  getExtra(KuskiIndex) {
    const {
      data: { getRankingHistoryByBattle, getBattle },
    } = this.props;
    const { extra } = this.state;
    let typeFilter = '';
    let value = '';
    if (extra === 'RankingAll') {
      typeFilter = 'All';
      value = 'Ranking';
    }
    if (extra === 'RankingType') {
      typeFilter = getBattleType(getBattle);
      value = 'Ranking';
    }
    if (extra === 'RankingIncreaseAll') {
      typeFilter = 'All';
      value = 'Increase';
    }
    if (extra === 'RankingIncreaseType') {
      typeFilter = getBattleType(getBattle);
      value = 'Increase';
    }
    const filtered = getRankingHistoryByBattle.filter(
      r => r.KuskiIndex === KuskiIndex && r.BattleType === typeFilter,
    );
    if (filtered.length > 0) {
      return filtered[0][value];
    }
    return '';
  }

  render() {
    const { BattleIndex } = this.props;
    const {
      data: { getBattle, getAllBattleTimes },
    } = this.props;
    const { extra } = this.state;
    const isWindow = typeof window !== 'undefined';

    if (!getBattle) return <div className={s.root}>Battle is unfinished</div>;

    return (
      <div className={s.root}>
        <div className={s.playerContainer}>
          <div className={s.player}>
            {isWindow && !(battleStatus(getBattle) === 'Queued') && (
              <Recplayer
                rec={`/dl/battlereplay/${BattleIndex}`}
                lev={`/dl/level/${getBattle.LevelIndex}`}
                controls
              />
            )}
          </div>
        </div>
        <div className={s.rightBarContainer}>
          <div className={s.chatContainer}>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1">Battle info</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div className={s.battleDescription}>
                  {getBattle.Duration} minute{' '}
                  <span className={s.battleType}>
                    <BattleType type={getBattle.BattleType} />
                  </span>{' '}
                  battle in{' '}
                  <a href={`/dl/level/${getBattle.LevelIndex}`}>
                    {getBattle.LevelData ? getBattle.LevelData.LevelName : '?'}
                    .lev
                  </a>{' '}
                  {getBattle.KuskiData.Kuski}
                  <div className={s.battleTimestamp}>
                    Started{' '}
                    <LocalTime
                      date={getBattle.Started}
                      format="DD.MM.YYYY HH:mm:ss"
                      parse="X"
                    />
                  </div>
                  <div className={s.battleTimestamp}>
                    <a href={`/dl/battlereplay/${BattleIndex}`}>
                      Download replay
                    </a>
                  </div>
                  <br />
                  <Link to={`/levels/${getBattle.LevelIndex}`}>
                    Go to level page
                  </Link>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            {getBattle.Finished === 1 && getBattle.BattleType === 'NM' && (
              <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body2">Leader history</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <LeaderHistory allFinished={getAllBattleTimes} />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )}
            {!(battleStatus(getBattle) === 'Queued') && (
              <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body2">Chat</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Chat
                    start={getBattle.Started}
                    end={
                      Number(getBattle.Started) +
                      Number(getBattle.Duration * 60)
                    }
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )}
          </div>
        </div>
        <div className={s.levelStatsContainer}>
          <Paper>
            {getBattle.Results && (
              <ListContainer>
                <ListHeader>
                  <ListCell right width={30}>
                    #
                  </ListCell>
                  <ListCell width={200}>Kuski</ListCell>
                  <ListCell right width={200}>
                    Time
                  </ListCell>
                  <ListCell>
                    <Select
                      value={extra}
                      onChange={e => this.setState({ extra: e.target.value })}
                      name="extra"
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Extra
                      </MenuItem>
                      <MenuItem value="RankingAll">Ranking (all)</MenuItem>
                      <MenuItem value="RankingType">Ranking (type)</MenuItem>
                      <MenuItem value="RankingIncreaseAll">
                        Ranking Increase (all)
                      </MenuItem>
                      <MenuItem value="RankingIncreaseType">
                        Ranking Increase (type)
                      </MenuItem>
                    </Select>
                  </ListCell>
                </ListHeader>
                <Query query={GET_BATTLE_TIMES} variables={{ id: BattleIndex }}>
                  {({ data: { getBattleTimes }, loading }) => {
                    if (loading) return null;
                    return [...getBattleTimes]
                      .sort(sortResults(getBattle.BattleType))
                      .map((r, i) => (
                        <ListRow key={r.KuskiIndex}>
                          <ListCell width={30}>{i + 1}.</ListCell>
                          <ListCell width={200}>
                            <Kuski kuskiData={r.KuskiData} flag team />
                            {getBattle.Multi === 1 && (
                              <>
                                {' '}
                                & <Kuski kuskiData={r.KuskiData2} flag team />
                              </>
                            )}
                          </ListCell>
                          <ListCell right width={200}>
                            <Time time={r.Time} apples={r.Apples} />
                          </ListCell>
                          <ListCell>{this.getExtra(r.KuskiIndex)}</ListCell>
                        </ListRow>
                      ));
                  }}
                </Query>
              </ListContainer>
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
