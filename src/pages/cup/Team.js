/* eslint-disable react/no-danger */
import React, { useEffect, Fragment, useState } from 'react';
import styled from 'styled-components';
import { nickId } from 'utils/nick';
import Grid from '@material-ui/core/Grid';
import Header from 'components/Header';
import Time from 'components/Time';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Recplayer from 'components/Recplayer';
import { getPrivateCupRecUri } from 'utils/cups';
import PreviewRecButton from 'components/PreviewRecButton';

const eventSort = (a, b) => a.CupIndex - b.CupIndex;

const Team = () => {
  const { teamReplays, cup } = useStoreState(state => state.Cup);
  const { getTeamReplays } = useStoreActions(actions => actions.Cup);

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

  return (
    <Container>
      {nickId() > 0 && (
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
            <Header h2>Team replays</Header>
            <div>List of all team replays that has been set to shared.</div>
            {teamReplays.sort(eventSort).map((e, i) => (
              <Fragment key={e.CupIndex}>
                <Header h3 top>
                  Event {i + 1}
                </Header>
                {e.CupTimes.filter(t => t.Replay).map(replay => (
                  <Fragment key={replay.CupTimeIndex}>
                    <ReplayCon>
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
