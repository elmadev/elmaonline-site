import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/withStyles';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
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

import s from './Replay.css';

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
    link = `https://eol.ams3.digitaloceanspaces.com/${window.App.s3SubFolder}replays/${replay.UUID}/${replay.RecFileName}`;
  }
  return (
    <div className={s.root}>
      <div className={s.playerContainer}>
        <div className={s.player}>
          {isWindow && (
            <Recplayer
              rec={link}
              lev={`/dl/level/${replay.LevelIndex}`}
              controls
            />
          )}
        </div>
      </div>
      <div className={s.rightBarContainer}>
        <div className={s.chatContainer}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">
                <>{replay.RecFileName}</>
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: 'column' }}>
              <div className={s.replayDescription}>
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
              </div>
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
        </div>
      </div>
      <div className={s.levelStatsContainer}>
        <Paper className={s.ReplayDescription}>
          <div>
            <div>{replay.Comment}</div>
            <div className={s.battleTimestamp}>
              Uploaded by{' '}
              {replay.UploadedByData ? replay.UploadedByData.Kuski : 'Unknown'}{' '}
              <LocalTime
                date={replay.Uploaded}
                format="YYYY-MM-DD HH:mm:ss"
                parse="X"
              />
            </div>
          </div>
          <ReplayRating ReplayIndex={replay.ReplayIndex} />
        </Paper>
      </div>
      <div className={s.levelStatsContainer}>
        <Paper className={s.battleDescription}>
          <AddComment add={() => {}} type="replay" index={replay.ReplayIndex} />
          <ReplayComments ReplayIndex={replay.ReplayIndex} />
        </Paper>
      </div>
    </div>
  );
};

Replay.propTypes = {
  ReplayUuid: PropTypes.string.isRequired,
};

export default compose(withStyles(s))(Replay);
