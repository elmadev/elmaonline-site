import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import 'components/variables.css';
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Select,
  MenuItem,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Paper } from 'styles/Paper';
import { ListContainer, ListHeader, ListCell, ListRow } from 'styles/List';
import { BattleType } from 'components/Names';
import Time from 'components/Time';
import Link from 'components/Link';
import ChatView from 'components/ChatView';
import Kuski from 'components/Kuski';
import LocalTime from 'components/LocalTime';
import LeaderHistory from 'components/LeaderHistory';
import { sortResults, battleStatus, getBattleType } from 'utils/battle';
import RecView from './RecView';

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

    if (!getBattle) return <Root>Battle is unfinished</Root>;

    return (
      <Root>
        <RecView
          isWindow={isWindow}
          BattleIndex={BattleIndex}
          levelIndex={getBattle.LevelIndex}
          battleStatus={battleStatus(getBattle)}
        />
        <RightBarContainer>
          <ChatContainer>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography variant="body2">Battle info</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <BattleStyleDescription>
                  {getBattle.Duration} minute{' '}
                  <BattleTypeStyled>
                    <BattleType type={getBattle.BattleType} />
                  </BattleTypeStyled>{' '}
                  battle in{' '}
                  <a href={`/dl/level/${getBattle.LevelIndex}`}>
                    {getBattle.LevelData ? getBattle.LevelData.LevelName : '?'}
                    .lev
                  </a>{' '}
                  {getBattle.KuskiData.Kuski}
                  <BattleTimeStampStyled>
                    Started{' '}
                    <LocalTime
                      date={getBattle.Started}
                      format="DD.MM.YYYY HH:mm:ss"
                      parse="X"
                    />
                  </BattleTimeStampStyled>
                  <BattleTimeStampStyled>
                    <a href={`/dl/battlereplay/${BattleIndex}`}>
                      Download replay
                    </a>
                  </BattleTimeStampStyled>
                  <br />
                  <Link to={`/levels/${getBattle.LevelIndex}`}>
                    Go to level page
                  </Link>
                </BattleStyleDescription>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            {getBattle.Finished === 1 && getBattle.BattleType === 'NM' && (
              <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                  <Typography variant="body1">Leader history</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <LeaderHistory allFinished={getAllBattleTimes} />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )}
            {!(battleStatus(getBattle) === 'Queued') && (
              <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                  <Typography variant="body1">Chat</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <ChatView
                    start={Number(getBattle.Started)}
                    end={
                      Number(getBattle.Started) +
                      Number((getBattle.Duration + 2) * 60)
                    }
                    // battleEndEvent: when the battle ends compared to the start prop
                    battleEnd={Number(getBattle.Duration * 60)}
                    paginated
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )}
          </ChatContainer>
        </RightBarContainer>
        <LevelStatsContainer>
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
        </LevelStatsContainer>
      </Root>
    );
  }
}

const Root = styled.div`
  padding: 7px;
`;

const ChatContainer = styled.div`
  clear: both;
`;

const RightBarContainer = styled.div`
  float: right;
  width: 40%;
  padding: 7px;
  box-sizing: border-box;
`;

const LevelStatsContainer = styled.div`
  width: 60%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
`;

const BattleTypeStyled = styled.span`
  text-transform: lowercase;
`;

const BattleStyleDescription = styled.div`
  font-size: 14px;
`;

const BattleTimeStampStyled = styled.div`
  color: #7d7d7d;
`;

export default compose(
  graphql(battleQuery, {
    options: ownProps => ({
      variables: {
        BattleIndex: ownProps.BattleIndex,
      },
    }),
  }),
)(Battle);
