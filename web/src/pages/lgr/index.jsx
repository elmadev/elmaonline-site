import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ExpandMore } from '@material-ui/icons';
import Layout from 'components/Layout';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';
import styled from '@emotion/styled';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';
import Kuski from 'components/Kuski';
import Tags from 'components/Tags';
import Recplayer from 'components/Recplayer';
import { Text } from 'components/Containers';
import AddComment from 'components/AddComment';
import ReplaySettings from 'features/ReplaySettings';
import LGRComments from 'features/LGRComments';
import LGRUpload from 'features/LGRUpload';
import { mod, nickId } from 'utils/nick';
import { getReplayLink, getLgrPreviewLink, getLgrLink } from 'utils/link';
import { DeleteLGR, ReplayByUUID } from 'api';
import config from 'config';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Row } from 'components/Containers';
import Portal from 'components/Portal';

const LGR = () => {
  const { lgr } = useStoreState(state => state.LGR);
  const { getLGR } = useStoreActions(actions => actions.LGR);
  const [fullscreen, setFullscreen] = useState(false);
  const [modDelete, setModDelete] = useState('');
  const navigate = useNavigate();

  const {
    settings: { theater },
  } = useStoreState(state => state.ReplaySettings);

  const { LGRName } = useParams({ strict: false });
  useEffect(() => {
    getLGR(LGRName);
  }, []);

  const [replayData, setReplayData] = useState(null);
  useEffect(() => {
    (async () => {
      if (lgr?.ReplayUUID) {
        const res = await ReplayByUUID(lgr.ReplayUUID);
        if (res.ok) {
          setReplayData(res.data);
        }
      }
    })();
  }, [lgr]);

  // mod feature
  const deleteLGR = async () => {
    const res = await DeleteLGR(lgr.LGRName);
    if (res.ok) {
      navigate({ to: '/lgrs' });
    } else {
      setModDelete('Unexpected error, see console');
      // eslint-disable-next-line no-console
      console.log(res);
    }
  };

  return (
    <Layout edge t="LGRs">
      {!LGRName && <Typography>Please add an LGR name to the url.</Typography>}
      {lgr && (
        <>
          <PreviewContainer theater={theater}>
            {replayData && (
              <>
                <Recplayer
                  rec={getReplayLink(replayData).link}
                  lev={`${config.dlUrl}level/${replayData.LevelIndex}`}
                  lgr={getLgrLink(lgr)}
                  controls
                />
                <ReplaySettings lgrPage={true} />
              </>
            )}
          </PreviewContainer>
          <RightBarContainer>
            <Accordion defaultExpanded>
              <AccordionDetails style={{ flexDirection: 'column' }}>
                <Name>
                  <Header h2>{`${lgr.LGRName}.lgr`}</Header>
                  <a href={`${config.api}lgr/get/${lgr.LGRName}?dl`}>
                    <GetAppIcon fontSize="large" />
                  </a>
                </Name>
                {fullscreen ? (
                  <Portal>
                    <ImageFullscreen onClick={() => setFullscreen(false)}>
                      <img
                        src={getLgrPreviewLink(lgr)}
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      />
                    </ImageFullscreen>
                  </Portal>
                ) : null}
                <Image onClick={() => setFullscreen(true)}>
                  <img
                    src={getLgrPreviewLink(lgr)}
                    style={{ maxWidth: '100%' }}
                  />
                </Image>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>Description</Header>
              </AccordionSummary>
              <AccordionDetails style={{ flexDirection: 'column' }}>
                <LGRInfo>
                  <Text style={{ whiteSpace: 'pre-line' }}>{lgr.LGRDesc}</Text>
                  <Text>
                    <UploadedBy>
                      Uploaded by <Kuski kuskiData={lgr.KuskiData} />{' '}
                      <LocalTime
                        date={lgr.Added}
                        format="yyyy-MM-dd HH:mm:ss"
                        parse="X"
                      />
                    </UploadedBy>
                  </Text>
                  <Row>
                    <a href={`${config.api}lgr/get/${lgr.LGRName}?dl`}>
                      <GetAppIcon />
                    </a>
                    <Text>
                      {lgr.Downloads} download{lgr.Downloads !== 1 ? 's' : ''}
                    </Text>
                  </Row>
                  <Tags tags={lgr.Tags.map(tag => tag.Name)} />
                </LGRInfo>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>Comments</Header>
              </AccordionSummary>
              <AccordionDetails style={{ flexDirection: 'column' }}>
                <AddComment type="lgr" index={lgr.LGRIndex} />
                <LGRComments LGRIndex={lgr.LGRIndex} />
              </AccordionDetails>
            </Accordion>
            {mod() === 1 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Header h3>Delete LGR (mod-exclusive)</Header>
                </AccordionSummary>
                <AccordionDetails style={{ flexDirection: 'column' }}>
                  <Text>
                    Danger! Type "delete" in this box to enable the delete
                    button
                  </Text>
                  {modDelete !== 'delete' ? (
                    <TextField
                      fullWidth
                      id="Delete"
                      multiline
                      label=""
                      value={modDelete}
                      onChange={event => setModDelete(event.target.value)}
                      margin="dense"
                    />
                  ) : (
                    <Button
                      onClick={deleteLGR}
                      variant="contained"
                      color="primary"
                    >
                      DELETE
                    </Button>
                  )}
                </AccordionDetails>
              </Accordion>
            )}
          </RightBarContainer>
          {(nickId() === lgr.KuskiIndex || mod() === 1) && (
            <EditLgr>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Header h3>Edit LGR</Header>
                </AccordionSummary>
                <AccordionDetails style={{ flexDirection: 'column' }}>
                  <LGRUpload lgrToEdit={lgr} />
                </AccordionDetails>
              </Accordion>
            </EditLgr>
          )}
        </>
      )}
    </Layout>
  );
};

const ImageFullscreen = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  cursor: pointer;
`;

const Image = styled.div`
  cursor: pointer;
`;

const EditLgr = styled.div`
  width: 70%;
  float: left;
  padding-left: 7px;
  box-sizing: border-box;
`;

const Name = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${p => p.theme.padSmall};
`;

const PreviewContainer = styled.div`
  width: ${p => (p.theater ? '100%' : '70%')};
  float: left;
  padding: 7px;
  box-sizing: border-box;
  text-align: center;
  @media (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

const RightBarContainer = styled.div`
  float: right;
  width: 30%;
  padding: 7px;
  box-sizing: border-box;
  @media (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

const LGRInfo = styled.div`
  font-size: 14px;
`;

const UploadedBy = styled.div`
  color: #7d7d7d;
`;
export default LGR;
