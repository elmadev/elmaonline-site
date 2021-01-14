import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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

const getExtra = (KuskiIndex, extra, rankingHistory, battle) => {
  let typeFilter = '';
  let value = '';
  if (Object.keys(rankingHistory).length === 0) return 'unavailable';
  if (extra === '') {
    return '';
  }
  if (extra === 'RankingAll') {
    typeFilter = 'All';
    value = 'Ranking';
  }
  if (extra === 'RankingType') {
    typeFilter = getBattleType(battle);
    value = 'Ranking';
  }
  if (extra === 'RankingIncreaseAll') {
    typeFilter = 'All';
    value = 'Increase';
  }
  if (extra === 'RankingIncreaseType') {
    typeFilter = getBattleType(battle);
    value = 'Increase';
  }
  const filtered = rankingHistory.filter(
    r => r.KuskiIndex === KuskiIndex && r.BattleType === typeFilter,
  );
  if (filtered.length > 0) {
    return parseInt(filtered[0][value], 10).toFixed(2);
  }
  return '';
};

const Battle = props => {
  const { BattleIndex } = props;
  const [extra, setExtra] = useState('');
  const { allBattleTimes, battle, rankingHistory } = useStoreState(
    state => state.Battle,
  );
  const {
    getAllBattleTimes,
    getBattle,
    getRankingHistoryByBattle,
  } = useStoreActions(state => state.Battle);

  useEffect(() => {
    getAllBattleTimes(BattleIndex);
    getBattle(BattleIndex);
    getRankingHistoryByBattle(BattleIndex);
  }, [BattleIndex]);

  const isWindow = typeof window !== 'undefined';

  if (!battle) return <Root>Battle is unfinished</Root>;

  return (
    <Root>
      <RecView
        isWindow={isWindow}
        BattleIndex={BattleIndex}
        levelIndex={battle.LevelIndex}
        battleStatus={battleStatus(battle)}
      />
      <RightBarContainer>
        <div className="chatContainer">
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Battle info</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <BattleStyleDescription>
                {battle.Duration} minute{' '}
                <span className="battleType">
                  <BattleType type={battle.BattleType} />
                </span>{' '}
                battle in{' '}
                <a href={`/dl/level/${battle.LevelIndex}`}>
                  {battle.LevelData ? battle.LevelData.LevelName : '?'}
                  .lev
                </a>{' '}
                {battle.KuskiData.Kuski}
                <div className="timeStamp">
                  Started{' '}
                  <LocalTime
                    date={battle.Started}
                    format="DD.MM.YYYY HH:mm:ss"
                    parse="X"
                  />
                </div>
                <div className="timeStamp">
                  <a href={`/dl/battlereplay/${BattleIndex}`}>
                    Download replay
                  </a>
                </div>
                <br />
                <Link to={`/levels/${battle.LevelIndex}`}>
                  Go to level page
                </Link>
              </BattleStyleDescription>
            </AccordionDetails>
          </Accordion>
          {battle.Finished === 1 && battle.BattleType === 'NM' && (
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1">Leader history</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {allBattleTimes !== null && allBattleTimes !== [] ? (
                  <LeaderHistory allFinished={allBattleTimes} />
                ) : null}
              </AccordionDetails>
            </Accordion>
          )}
          {!(battleStatus(battle) === 'Queued') && (
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1">Chat</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ChatView
                  start={Number(battle.Started)}
                  end={
                    Number(battle.Started) + Number((battle.Duration + 2) * 60)
                  }
                  // battleEndEvent: when the battle ends compared to the start prop
                  battleEnd={Number(battle.Duration * 60)}
                  paginated
                />
              </AccordionDetails>
            </Accordion>
          )}
        </div>
      </RightBarContainer>
      <LevelStatsContainer>
        <Paper>
          {battle.Results && (
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
                    onChange={e => setExtra(e.target.value)}
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
              {[...battle.Results]
                .sort(sortResults(battle.BattleType))
                .map((r, i) => {
                  return (
                    <>
                      <ListRow key={r.KuskiIndex}>
                        <ListCell width={30}>{i + 1}.</ListCell>
                        <ListCell width={battle.Multi === 1 ? 300 : 200}>
                          <Kuski kuskiData={r.KuskiData} flag team />
                          {battle.Multi === 1 && (
                            <>
                              {' '}
                              & <Kuski kuskiData={r.KuskiData2} flag team />
                            </>
                          )}
                        </ListCell>
                        <ListCell right width={200}>
                          <Time time={r.Time} apples={r.Apples} />
                        </ListCell>
                        <ListCell>
                          {getExtra(
                            r.KuskiIndex,
                            extra,
                            rankingHistory,
                            battle,
                          )}
                        </ListCell>
                      </ListRow>
                    </>
                  );
                })}
            </ListContainer>
          )}
        </Paper>
      </LevelStatsContainer>
    </Root>
  );
};

Battle.propTypes = {
  BattleIndex: PropTypes.number.isRequired,
};

const Root = styled.div`
  padding: 7px;
`;

const RightBarContainer = styled.div`
  float: right;
  width: 40%;
  padding: 7px;
  box-sizing: border-box;
  .chatContainer {
    clear: both;
  }
`;

const LevelStatsContainer = styled.div`
  width: 60%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
`;

const BattleStyleDescription = styled.div`
  font-size: 14px;
  .timeStamp {
    color: #7d7d7d;
  }
  .battleType {
    text-transform: lowercase;
  }
`;

export default Battle;
