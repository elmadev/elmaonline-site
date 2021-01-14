import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import styled from 'styled-components';
import { Paper } from 'styles/Paper';

import Recplayer from 'components/Recplayer';
import { Level } from 'components/Names';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import Link from 'components/Link';
import RecList from 'components/RecList';
import ReplayComments from 'components/ReplayComments';
import ReplayRating from 'components/ReplayRating';
import AddComment from 'components/AddComment';
import historyRefresh from 'utils/historyRefresh';
import { useStoreState, useStoreActions } from 'easy-peasy';

const Replay = props => {
  const { ReplayUuid } = props;
  const isWindow = typeof window !== 'undefined';
  let link = '';

  const { getReplayByUUID } = useStoreActions(state => state.ReplayByUUID);
  const { replay } = useStoreState(state => state.ReplayByUUID);

  useEffect(() => {
    if (ReplayUuid) {
      getReplayByUUID(ReplayUuid);
    }
  }, [ReplayUuid]);

  if (!replay) return null;

  if (isWindow) {
    link = `https://eol.ams3.digitaloceanspaces.com/${
      window.App.s3SubFolder
    }replays/${replay.UUID}/${replay.RecFileName}`;
  }
  return (
    <Container>
      <PlayerContainer>
        <Player>
          {isWindow && (
            <Recplayer
              rec={link}
              lev={`/dl/level/${replay.LevelIndex}`}
              controls
            />
          )}
        </Player>
      </PlayerContainer>
      <RightBarContainer>
        <ChatContainer>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">
                <>{replay.RecFileName}</>
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: 'column' }}>
              <ReplayDescription>
                <div>
                  {isWindow ? (
                    <>
                      <a href={link}>
                        <Time thousands time={replay.ReplayTime} />
                      </a>{' '}
                    </>
                  ) : (
                    <Time thousands time={replay.ReplayTime} />
                  )}
                  by{' '}
                  {replay.DrivenByData ? replay.DrivenByData.Kuski : 'Unknown'}{' '}
                  in <Level LevelData={replay.LevelData} />
                </div>
                <br />
                <Link to={`/levels/${replay.LevelIndex}`}>
                  Go to level page
                </Link>
              </ReplayDescription>
              <div>
                {replay.TAS === 1 && (
                  <span style={{ color: 'red' }}>(TAS)</span>
                )}
                {replay.Unlisted === 1 && (
                  <span style={{ color: 'gray' }}>(Unlisted)</span>
                )}
                {replay.Finished === 0 && (
                  <span style={{ color: 'gray' }}>(DNF)</span>
                )}
                {replay.Bug === 1 && (
                  <span style={{ color: 'brown' }}>(Bug)</span>
                )}
                {replay.Nitro === 1 && (
                  <span style={{ color: 'blue' }}>(Mod)</span>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
          {/* <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
              <Typography variant="body1">
                <React.Fragment>
                  <Level LevelData={replay.LevelData} />.lev
                </React.Fragment>
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
              <div>1. Zweq 01:22,49</div>
              <div>2. Zero 01:30,33</div>
              <div>3. talli 01:32,95</div>
              <div>etc.</div>
            </ExpansionPanelDetails>
          </ExpansionPanel> */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Other replays in level</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: 'column' }}>
              <RecList
                LevelIndex={replay.LevelIndex}
                currentUUID={replay.UUID}
                openReplay={uuid => historyRefresh.push(`/r/${uuid}`)}
                columns={['Replay', 'Time', 'By']}
                horizontalMargin={-24}
              />
            </AccordionDetails>
          </Accordion>
        </ChatContainer>
      </RightBarContainer>
      <LevelStatsContainer>
        <ReplayDescriptionPaper>
          <div>
            <div>{replay.Comment}</div>
            <BattleTimestamp>
              Uploaded by{' '}
              {replay.UploadedByData ? replay.UploadedByData.Kuski : 'Unknown'}{' '}
              <LocalTime
                date={replay.Uploaded}
                format="YYYY-MM-DD HH:mm:ss"
                parse="X"
              />
            </BattleTimestamp>
          </div>
          <ReplayRating ReplayIndex={replay.ReplayIndex} />
        </ReplayDescriptionPaper>
      </LevelStatsContainer>
      <LevelStatsContainer>
        <BattleDescriptionPaper>
          <AddComment add={() => {}} type="replay" index={replay.ReplayIndex} />
          <ReplayComments ReplayIndex={replay.ReplayIndex} />
        </BattleDescriptionPaper>
      </LevelStatsContainer>
    </Container>
  );
};

const Container = styled.div`
  padding: 7px;
  @media (max-width: 768px) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const PlayerContainer = styled.div`
  width: 70%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
  @media (max-width: 1400px) {
    widtdh: 100%;
  }
`;

const Player = styled.div`
  background: #f1f1f1;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RightBarContainer = styled.div`
  float: right;
  width: 30%;
  padding: 7px;
  box-sizing: border-box;
  @media (max-width: 1400px) {
    widtdh: 40%;
  }
  @media (max-width: 768px) {
    widtdh: 100%;
  }
`;

const LevelStatsContainer = styled.div`
  width: 70%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
  @media (max-width: 1400px) {
    widtdh: 60%;
  }
  @media (max-width: 768px) {
    widtdh: 100%;
  }
`;

const BattleDescriptionPaper = styled(Paper)`
  font-size: 14px;
  padding: 7px;
`;

const ReplayDescriptionPaper = styled(Paper)`
  font-size: 14px;
  padding: 7px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ReplayDescription = styled.div`
  font-size: 14px;
`;

const BattleTimestamp = styled.div`
  color: #7d7d7d;
`;

const ChatContainer = styled.div`
  clear: both;
`;

Replay.propTypes = {
  ReplayUuid: PropTypes.string.isRequired,
};

export default Replay;
