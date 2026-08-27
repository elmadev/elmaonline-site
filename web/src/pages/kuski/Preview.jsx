import React from 'react';
import Recplayer from 'components/Recplayer';
import { Level } from 'components/Names';
import Time from 'components/Time';
import { has } from 'lodash';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';
import CloseIcon from '@material-ui/icons/HighlightOffOutlined';
import { Grid, Typography, Backdrop } from '@material-ui/core';
import config from 'config';
import styled from '@emotion/styled';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { Column, Row } from 'components/Containers';

const finishedTypes = {
  B: 'Finished (Apple Bug)',
  D: 'Dead',
  E: 'Escaped',
  F: 'Finished',
  S: 'Spied',
  X: 'Cheated',
};

export default function Preview({
  previewRec,
  setPreviewRec,
  nextReplay,
  previousReplay,
}) {
  if (!previewRec?.TimeFileData?.UUID || !previewRec?.TimeFileData?.MD5) {
    return (
      <Backdrop open={true} style={{ zIndex: 100 }}>
        <Container container>
          <Grid item sm={8} xs={12}>
            <Player>Replay not available.</Player>
          </Grid>
          <Close
            onClick={() => setPreviewRec(null)}
            style={{ marginLeft: 'auto' }}
          />
        </Container>
      </Backdrop>
    );
  }

  return (
    <Backdrop open={true} style={{ zIndex: 100 }}>
      <Container container>
        <Grid item sm={8} xs={12}>
          <Player>
            <Recplayer
              rec={`${config.s3Url}time/${previewRec.TimeFileData.UUID}-${previewRec.TimeFileData.MD5}/${previewRec.TimeIndex}.rec`}
              lev={`${config.dlUrl}level/${previewRec.LevelIndex}?UUID=${previewRec.TimeFileData.UUID}`}
              shirt={[`${config.dlUrl}shirt/${previewRec.KuskiIndex}`]}
              controls
              autoPlay="yes"
            />
          </Player>
        </Grid>
        <Grid item sm={4}>
          <Column height="100%">
            <Pad>
              <Row>
                <Header h2>
                  {previousReplay && <Previous onClick={previousReplay} />}
                  <a
                    href={`${config.s3Url}time/${previewRec.TimeFileData.UUID}-${previewRec.TimeFileData.MD5}/${previewRec.TimeIndex}.rec`}
                  >
                    Download
                  </a>
                  {nextReplay && <Next onClick={nextReplay} />}
                </Header>
                <Close
                  onClick={() => setPreviewRec(null)}
                  style={{ marginLeft: 'auto' }}
                />
              </Row>
              <p>
                <Time time={previewRec.Time} /> in{' '}
                <Level
                  LevelData={previewRec.LevelData}
                  LevelIndex={previewRec.LevelIndex}
                />
              </p>
              {has(previewRec, 'Apples') && (
                <Comment>
                  {finishedTypes[previewRec.Finished]}
                  <br />
                  {previewRec.Apples} Apples
                  <br />
                  {previewRec.MaxSpeed / 100} Max speed
                  <br />
                  <Time time={previewRec.ThrottleTime} /> Throttle time
                  <br />
                  <Time time={previewRec.BrakeTime} /> Brake time
                  <br />
                  {previewRec.LeftVolt} Left volts
                  <br />
                  {previewRec.RightVolt} Right volts
                  <br />
                  {previewRec.SuperVolt} Super volts
                  <br />
                  {previewRec.Turn} Turns
                  <br />
                  {previewRec.OneWheel === 1 && (
                    <>
                      One Wheel
                      <br />
                    </>
                  )}
                  {previewRec.FPSLimit ? (
                    <>
                      FPS Limit: {previewRec.FPSLimit}
                      <br />
                    </>
                  ) : null}
                  {previewRec.Drunk === 1 && <>Drunk</>}
                </Comment>
              )}
            </Pad>

            <Pad>
              <Typography variant="caption" display="block">
                Driven{' '}
                <LocalTime
                  date={previewRec.Driven}
                  format="yyyy-MM-dd HH:mm:ss"
                  parse="X"
                />
              </Typography>
            </Pad>
          </Column>
        </Grid>
      </Container>
    </Backdrop>
  );
}

const Player = styled.div`
  background: ${p => p.theme.pageBackground};
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Pad = styled.div`
  padding: 16px;
`;

const Container = styled(Grid)`
  background: ${p => p.theme.paperBackground};
  width: 80% !important;
  @media (max-width: 730px) {
    width: 100% !important;
  }
`;

const Comment = styled.blockquote`
  background: ${p => p.theme.pageBackground};
  margin: 1em 5px;
  padding: 0.5em 5px;
`;

const Close = styled(CloseIcon)`
  cursor: pointer;
  color: ${p => p.theme.lightTextColor};

  :hover {
    color: red;
  }
`;

const Next = styled(NavigateNextIcon)`
  cursor: pointer;
  color: ${p => p.theme.lightTextColor};

  :hover {
    color: blue;
  }
`;

const Previous = styled(NavigateBeforeIcon)`
  cursor: pointer;
  color: ${p => p.theme.lightTextColor};

  :hover {
    color: blue;
  }
`;
