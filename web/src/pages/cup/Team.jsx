import React, { useEffect, Fragment, useState } from 'react';
import styled from '@emotion/styled';
import { nickId } from 'utils/nick';
import { Paper } from 'components/Paper';
import { Button, Grid } from '@material-ui/core';
import Header from 'components/Header';
import Time from 'components/Time';
import { useStoreState, useStoreActions, useStoreRehydrated } from 'easy-peasy';
import Recplayer from 'components/Recplayer';
import { getPrivateCupRecUri } from 'utils/cups';
import PreviewRecButton from 'components/PreviewRecButton';
import FieldBoolean from 'components/FieldBoolean';
import { CupUpload } from './Dashboard';
import config from 'config';
import Link from '../../components/Link';
import { Share, AddBox, IndeterminateCheckBox } from '@material-ui/icons';

const eventSort = (a, b) => a.CupIndex - b.CupIndex;

const timeSort = (a, b) => a.Time - b.Time;

const uploadedSort = (a, b) => b.CupTimeIndex - a.CupTimeIndex;

const Team = () => {
  const isRehydrated = useStoreRehydrated();
  const { teamReplays, cup, teamOptions } = useStoreState(state => state.Cup);
  const { getTeamReplays, setTeamOptions } = useStoreActions(
    actions => actions.Cup,
  );
  const { showOngoing, sortByTime } = teamOptions;

  const [previewRecIndex, setPreviewRecIndex] = useState(null);
  const [mergeRecIndex, setMergeRecIndex] = useState(null);

  useEffect(() => {
    if (cup.CupGroupIndex) {
      getTeamReplays(cup.CupGroupIndex);
    }
  }, [cup.CupGroupIndex]);

  const isPlayingPreview = CupTimeIndex => {
    return CupTimeIndex === previewRecIndex;
  };

  const handlePreviewRecButtonClick = CupTimeIndex => {
    const newIndex = isPlayingPreview(CupTimeIndex) ? null : CupTimeIndex;
    setPreviewRecIndex(newIndex);
    setMergeRecIndex(null);
  };

  const isOngoingFilter = teamReplay => {
    if (!showOngoing) {
      return teamReplay;
    }

    const now = Date.now();
    const startTime = teamReplay.StartTime * 1000;
    const endTime = teamReplay.EndTime * 1000;
    return startTime < now && now < endTime;
  };

  const getEventNumber = CupIndex => {
    const eventIndex = teamReplays
      .sort(eventSort)
      .findIndex(teamReplay => teamReplay.CupIndex === CupIndex);

    return eventIndex + 1;
  };

  const canMerge = (cupIndex, cupTimeIndex) => {
    if (mergeRecIndex !== null || previewRecIndex === null) {
      return false;
    }

    if (previewRecIndex === cupTimeIndex) {
      return false;
    }

    return (
      teamReplays
        .find(e => e.CupIndex === cupIndex)
        ?.CupTimes.findIndex(r => r.CupTimeIndex === previewRecIndex) > -1
    );
  };

  const getMergeRecUri = cupIndex => {
    const replay = teamReplays
      .find(e => e.CupIndex === cupIndex)
      ?.CupTimes.find(r => r.CupTimeIndex === mergeRecIndex);

    if (!replay) {
      return '';
    }

    return `;${getPrivateCupRecUri(
      replay.CupTimeIndex,
      cup.ShortName,
      replay.KuskiData.Kuski,
      replay.Code,
      getEventNumber(cupIndex),
      replay.Time,
    )}`;
  };

  if (!isRehydrated) {
    return 'Loading...';
  }

  return (
    <Container>
      {nickId() > 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper padding>
              <Header h2>Team replays</Header>
              <div>List of all team replays that has been set to shared.</div>
              <FieldBoolean
                label="Sort by time"
                value={sortByTime}
                onChange={() =>
                  setTeamOptions({ sortByTime: !sortByTime, showOngoing })
                }
              />
              <FieldBoolean
                label="Show ongoing"
                value={showOngoing}
                onChange={() =>
                  setTeamOptions({ sortByTime, showOngoing: !showOngoing })
                }
              />
              {teamReplays
                .sort(eventSort)
                .filter(isOngoingFilter)
                .map(e => (
                  <Fragment key={e.CupIndex}>
                    <Header h3 top>
                      Event {getEventNumber(e.CupIndex)}
                    </Header>
                    {e.CupTimes.sort(sortByTime ? timeSort : uploadedSort)
                      .filter(t => t.Replay)
                      .map(replay => (
                        <Fragment key={replay.CupTimeIndex}>
                          <ReplayCon>
                            <Rec
                              href={getPrivateCupRecUri(
                                replay.CupTimeIndex,
                                cup.ShortName,
                                replay.KuskiData.Kuski,
                                replay.Code,
                                getEventNumber(e.CupIndex),
                                replay.Time,
                              )}
                            >
                              {replay.TimeExists === 1 && <>✓ </>}
                              <Time time={replay.Time} apples={-1} />
                            </Rec>
                            by {replay.KuskiData.Kuski}
                            <PreviewRecButton
                              isPlaying={isPlayingPreview(replay.CupTimeIndex)}
                              setPreviewRecIndex={handlePreviewRecButtonClick}
                              CupTimeIndex={replay.CupTimeIndex}
                            />
                            <ShareLink
                              to={`/r?levUrl=${encodeURIComponent(`${config.dlUrl}level/${e.LevelIndex}`)}&recUrl=${encodeURIComponent(
                                getPrivateCupRecUri(
                                  replay.CupTimeIndex,
                                  cup.ShortName,
                                  replay.KuskiData.Kuski,
                                  replay.Code,
                                  getEventNumber(e.CupIndex),
                                  replay.Time,
                                ),
                              )}`}
                            >
                              <Share />
                            </ShareLink>
                            {mergeRecIndex === replay.CupTimeIndex ? (
                              <Button
                                onClick={() => setMergeRecIndex(null)}
                                title="Unmerge replay"
                              >
                                <IndeterminateCheckBox />
                              </Button>
                            ) : (
                              canMerge(e.CupIndex, replay.CupTimeIndex) && (
                                <Button
                                  onClick={() =>
                                    setMergeRecIndex(replay.CupTimeIndex)
                                  }
                                  title="Merge replay"
                                >
                                  <AddBox />
                                </Button>
                              )
                            )}
                            {replay.Comment !== '0' &&
                              replay.Comment !== '' && (
                                <Desc>{replay.Comment}</Desc>
                              )}
                          </ReplayCon>
                          {isPlayingPreview(replay.CupTimeIndex) && (
                            <Recplayer
                              rec={`${getPrivateCupRecUri(
                                replay.CupTimeIndex,
                                cup.ShortName,
                                replay.KuskiData.Kuski,
                                replay.Code,
                                getEventNumber(e.CupIndex),
                                replay.Time,
                              )}${getMergeRecUri(e.CupIndex)}`}
                              lev={`${config.dlUrl}level/${e.LevelIndex}`}
                              shirt={[
                                `${config.dlUrl}shirt/${replay.KuskiIndex}`,
                              ]}
                              height={400}
                              controls
                            />
                          )}
                        </Fragment>
                      ))}
                  </Fragment>
                ))}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CupUpload onUpload={() => getTeamReplays(cup.CupGroupIndex)} />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

const ShareLink = styled(Link)`
  color: ${p => (p.theme.type === 'dark' ? 'white' : 'black')};
  padding: 12px;
`;

const ReplayCon = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const Rec = styled.a`
  margin-right: 8px;
`;

const Desc = styled.div`
  font-size: 13px;
  margin-left: 8px;
`;

const Container = styled.div`
  padding: 8px;
`;

export default Team;
