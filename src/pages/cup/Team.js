/* eslint-disable react/no-danger */
import React, { useEffect, Fragment, useState } from 'react';
import styled from 'styled-components';
import { nickId } from 'utils/nick';
import { Grid } from '@material-ui/core';
import Header from 'components/Header';
import Time from 'components/Time';
import { useStoreState, useStoreActions, useStoreRehydrated } from 'easy-peasy';
import Recplayer from 'components/Recplayer';
import { getPrivateCupRecUri } from 'utils/cups';
import PreviewRecButton from 'components/PreviewRecButton';
import FieldBoolean from 'components/FieldBoolean';

const eventSort = (a, b) => a.CupIndex - b.CupIndex;

const timeSort = (a, b) => a.Time - b.Time;

const kuskiSort = (a, b) =>
  a.KuskiData.Kuski.toLowerCase().localeCompare(
    b.KuskiData.Kuski.toLowerCase(),
  );

const Team = () => {
  const isRehydrated = useStoreRehydrated();
  const { teamReplays, cup, teamOptions } = useStoreState(state => state.Cup);
  const { getTeamReplays, setTeamOptions } = useStoreActions(
    actions => actions.Cup,
  );
  const { showOngoing, sortByTime } = teamOptions;

  const [previewRecIndex, setPreviewRecIndex] = useState(null);

  useEffect(() => {
    getTeamReplays(cup.CupGroupIndex);
  }, []);

  const isPlayingPreview = CupTimeIndex => {
    return CupTimeIndex === previewRecIndex;
  };

  const handlePreviewRecButtonClick = CupTimeIndex => {
    const newIndex = isPlayingPreview(CupTimeIndex) ? null : CupTimeIndex;
    setPreviewRecIndex(newIndex);
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

  if (!isRehydrated) {
    return 'Loading...';
  }

  return (
    <Container>
      {nickId() > 0 && (
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
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
                  {e.CupTimes.sort(sortByTime ? timeSort : kuskiSort)
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
                          {replay.Comment !== '0' && replay.Comment !== '' && (
                            <Desc>{replay.Comment}</Desc>
                          )}
                        </ReplayCon>
                        {isPlayingPreview(replay.CupTimeIndex) && (
                          <Recplayer
                            rec={getPrivateCupRecUri(
                              replay.CupTimeIndex,
                              cup.ShortName,
                              replay.KuskiData.Kuski,
                              replay.Code,
                              getEventNumber(e.CupIndex),
                            )}
                            lev={`/dl/level/${e.LevelIndex}`}
                            height={400}
                            controls
                          />
                        )}
                      </Fragment>
                    ))}
                </Fragment>
              ))}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

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
