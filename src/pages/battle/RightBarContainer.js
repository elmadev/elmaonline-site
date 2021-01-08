import React from 'react';
import styled from 'styled-components';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { BattleType } from 'components/Names';
import Link from 'components/Link';
import ChatView from 'components/ChatView';
import LocalTime from 'components/LocalTime';
import LeaderHistory from 'components/LeaderHistory';
import { battleStatus } from 'utils/battle';

const RightBarContainer = props => {
  const { allBattleTimes, battle } = props;

  if (!battle) return <Root>loading...</Root>;

  return (
    <Root>
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
                <a href={`/dl/battlereplay/${battle.BattleIndex}`}>
                  Download replay
                </a>
              </div>
              <br />
              <Link to={`/levels/${battle.LevelIndex}`}>Go to level page</Link>
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
    </Root>
  );
};

const Root = styled.div`
  float: right;
  width: 40%;
  padding: 7px;
  box-sizing: border-box;
  .chatContainer {
    clear: both;
  }
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

export default RightBarContainer;
