/* eslint-disable react/no-danger */
import React, { useEffect, Fragment, useState } from 'react';
import styled from 'styled-components';
import { nickId } from 'utils/nick';
import { forEach } from 'lodash';
import { format } from 'date-fns';
import { Grid, Checkbox } from '@material-ui/core';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Recplayer from 'components/Recplayer';
import { getPrivateCupRecUri } from 'utils/cups';
import PreviewRecButton from 'components/PreviewRecButton';

const eventSort = (a, b) => a.CupIndex - b.CupIndex;

const currentEventIndex = events => {
  let index = 0;
  forEach(events, e => {
    if (
      e.StartTime < format(new Date(), 't') &&
      e.EndTime > format(new Date(), 't')
    ) {
      index = e.LevelIndex;
      return false;
    }
    return true;
  });
  return index;
};

const Personal = () => {
  const { myReplays, cup, events, myTimes } = useStoreState(state => state.Cup);
  const { getMyReplays, updateReplay, getMyTimes } = useStoreActions(
    actions => actions.Cup,
  );

  const [previewRecIndex, setPreviewRecIndex] = useState(null);

  useEffect(() => {
    getMyReplays(cup.CupGroupIndex);
    getMyTimes({
      LevelIndex: currentEventIndex(events),
      KuskiIndex: nickId(),
      limit: 10000,
    });
  }, []);

  const isPlayingPreview = CupTimeIndex => {
    return CupTimeIndex === previewRecIndex;
  };

  const handlePreviewRecButtonClick = CupTimeIndex => {
    const newIndex = isPlayingPreview(CupTimeIndex) ? null : CupTimeIndex;
    setPreviewRecIndex(newIndex);
  };

  return (
    <Container>
      {nickId() > 0 && (
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
            <Header h2>My uploaded replays</Header>
            <div>
              List of all replays you&apos;ve uploaded in all events. Check mark
              means online verified (note that verification only happens after
              an event is done). Check box is for sharing replay with team.
            </div>
            {myReplays.sort(eventSort).map((e, i) => (
              <Fragment key={e.CupIndex}>
                <Header h3 top>
                  Event {i + 1}
                </Header>
                {e.CupTimes.filter(t => t.Replay).map(replay => (
                  <Fragment key={replay.CupTimeIndex}>
                    <ReplayCon>
                      <Checkbox
                        checked={replay.ShareReplay}
                        onChange={() =>
                          updateReplay({
                            field: 'ShareReplay',
                            value: replay.ShareReplay ? 'false' : 'true',
                            CupGroupIndex: cup.CupGroupIndex,
                            CupTimeIndex: replay.CupTimeIndex,
                          })
                        }
                      />
                      <Rec
                        href={getPrivateCupRecUri(
                          replay.CupTimeIndex,
                          cup.ShortName,
                          replay.KuskiData.Kuski,
                          replay.Code,
                          i + 1,
                        )}
                      >
                        {replay.TimeExists === 1 && <>✓ </>}
                        <Time time={replay.Time} apples={-1} />
                      </Rec>
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
                          i + 1,
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
          <Grid item xs={12} sm={6}>
            <Header h2>Current event times</Header>
            <div>
              This shows your online times for current event. Can be used to
              verify that your times was registered on the server, as you
              can&apos;t see these anywhere else. Apples results are not shown
              here.
            </div>
            {myTimes && (
              <>
                <Header h3 top>
                  Time (Driven)
                </Header>
                {myTimes.map(t => (
                  <ReplayCon key={t.TimeIndex}>
                    <div>
                      <Time time={t.Time} />
                    </div>
                    <Desc>
                      (
                      <LocalTime
                        date={t.Driven}
                        format="dddd HH:mm:ss"
                        parse="X"
                      />
                      )
                    </Desc>
                  </ReplayCon>
                ))}
              </>
            )}
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

const Rec = styled.a``;

const Desc = styled.div`
  font-size: 13px;
  margin-left: 8px;
`;

const Container = styled.div`
  padding: 8px;
`;

export default Personal;
