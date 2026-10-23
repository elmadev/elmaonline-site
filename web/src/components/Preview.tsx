import Recplayer from 'components/Recplayer';
import { Level } from 'components/Names';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Header from 'components/Header';
import Link from 'components/Link';
import Tags from 'components/Tags';
import LocalTime from 'components/LocalTime';
import CloseIcon from '@mui/icons-material/HighlightOffOutlined';
import { Grid, Typography, Backdrop } from '@mui/material';
import config from 'config';
import { shirtBmpUrl } from 'utils/misc';
import styled from '@emotion/styled';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Column, Row } from 'components/Containers';
import type { ReplayData } from 'contract/replay.ts';

type PreviewProps = {
  previewRec: ReplayData;
  setPreviewRec: (replay: ReplayData | null) => void;
  nextReplay: () => void;
  previousReplay: () => void;
};

export default function Preview({
  previewRec,
  setPreviewRec,
  nextReplay,
  previousReplay,
}: PreviewProps) {
  const getRecUri = () => {
    const uuid = previewRec.UUID ?? '';
    if (uuid.substring(0, 5) === 'local') {
      return `${config.url}temp/${uuid}-${previewRec.RecFileName}`;
    } else if (uuid.substring(0, 2) === 'b-') {
      return `${config.dlUrl}battlereplay/${uuid.split('-')[1]}`;
    }
    return `${config.s3Url}replays/${uuid}/${previewRec.RecFileName}`;
  };

  return (
    <Backdrop open={true} style={{ zIndex: 100 }}>
      <Container container>
        <Grid item sm={8} xs={12}>
          <Player>
            <Recplayer
              rec={getRecUri()}
              lev={`${config.dlUrl}level/${previewRec.LevelIndex}?UUID=${previewRec.UUID}`}
              shirt={[shirtBmpUrl(previewRec.DrivenByData?.KuskiIndex)]}
              controls
              autoPlay="yes"
            />
          </Player>
        </Grid>
        <Grid item sm={4}>
          <Column height="100%">
            <div style={{ padding: '16px' }}>
              <Row>
                <Header h2>
                  <Previous onClick={previousReplay} />
                  <Link to={`/r/${previewRec.UUID}`}>
                    {previewRec.RecFileName}
                  </Link>
                  <Next onClick={nextReplay} />
                </Header>
                <Close
                  onClick={() => setPreviewRec(null)}
                  style={{ marginLeft: 'auto' }}
                />
              </Row>
              <p>
                <Time thousands time={previewRec.ReplayTime} /> by{' '}
                {previewRec.DrivenByData ? (
                  <Kuski kuskiData={previewRec.DrivenByData} />
                ) : (
                  previewRec.DrivenByText || 'Unknown'
                )}{' '}
                in{' '}
                <Level
                  LevelData={previewRec.LevelData}
                  LevelIndex={previewRec.LevelIndex}
                />
              </p>
              <Tags tags={(previewRec.Tags ?? []).map(tag => tag.Name)} />
              {previewRec.Comment && <Comment>{previewRec.Comment}</Comment>}
            </div>

            <div style={{ padding: '16px' }}>
              <Typography variant="caption" display="block">
                Uploaded by{' '}
                {previewRec.UploadedByData
                  ? previewRec.UploadedByData.Kuski
                  : 'Unknown'}{' '}
                <LocalTime
                  date={previewRec.Uploaded}
                  format="yyyy-MM-dd HH:mm:ss"
                  parse="X"
                />
              </Typography>
            </div>
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

const Container = styled(Grid)`
  background: ${p => p.theme.paperBackground};
  width: 80% !important;
  @media (max-width: 730px) {
    width: 100% !important;
  }
`;

const Comment = styled.blockquote`
  border-left: 4px solid ${p => p.theme.pageBackgroundDark};
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
  // make larger (good for mobile especially)
  font-size: 34px !important;
  margin-top: -3px;

  :hover {
    color: blue;
  }
`;

const Previous = styled(NavigateBeforeIcon)`
  cursor: pointer;
  color: ${p => p.theme.lightTextColor};
  // make larger (good for mobile especially)
  font-size: 34px !important;
  margin-top: -3px;

  :hover {
    color: blue;
  }
`;
