import React, { useEffect, useState, useRef } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Typography,
} from '@material-ui/core';
import {
  ExpandMore,
  IndeterminateCheckBox,
  AddBox,
  Visibility,
} from '@material-ui/icons';
import { xor } from 'lodash';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import styled from '@emotion/styled';
import Avatar from 'components/Avatar';
import Layout from 'components/Layout';
import Recplayer from 'components/Recplayer';
import { Level } from 'components/Names';
import LocalTime from 'components/LocalTime';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Link from 'components/Link';
import Header from 'components/Header';
import RecList from 'features/RecList';
import { useLocation, useParams, useNavigate } from '@tanstack/react-router';
import ReplayComments from 'features/ReplayComments';
import ReplayRating from 'features/ReplayRating';
import AddComment from 'components/AddComment';
import Tags from 'components/Tags';
import Loading from 'components/Loading';
import { useStoreState, useStoreActions } from 'easy-peasy';
import config from 'config';
import ReplaySettings from 'features/ReplaySettings';
import { TextField } from 'components/Inputs';
import FieldBoolean from 'components/FieldBoolean';
import Button from 'components/Buttons';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';
import { MergeContainer } from 'components/RecListItem';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Row, Column } from 'components/Containers';
import { pts } from 'utils/cups';
import { mod } from 'utils/nick';
import { getReplayLink } from 'utils/link';

const RecTime = ({ type, replay }) => {
  if (type === 'cup') {
    return <Time time={replay.ReplayTime / 10} apples={-1} />;
  }
  if (type === 'winner') {
    return <Time time={replay.ReplayTime / 10} apples={replay.Apples} />;
  }
  return <Time thousands time={replay.ReplayTime} />;
};

const Replay = () => {
  const { ReplayUuid, RecFileName } = useParams({ strict: false });
  const navigate = useNavigate();
  const [isHover, setHover] = useState(-1);
  const fingerprint = useRef('');
  const isWindow = typeof window !== 'undefined';
  let link = '';
  let type = 'replay';
  let linkArray = [];
  let uuidarray = [];
  const location = useLocation();
  const { merge } = location.search;

  const { getReplayByUUID, getCupEvent, setCupEvent } = useStoreActions(
    state => state.ReplayByUUID,
  );
  const { replay, loading, replays, cupEvent } = useStoreState(
    state => state.ReplayByUUID,
  );
  const {
    settings: { theater },
  } = useStoreState(state => state.ReplaySettings);
  const { getTagOptions } = useStoreActions(actions => actions.Upload);

  const getReplay = async () => {
    if (!fingerprint.current) {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      fingerprint.current = visitorId;
    }
    getReplayByUUID({
      ReplayUuid,
      merge,
      RecFileName,
      Fingerprint: fingerprint.current,
    });
  };

  useEffect(() => {
    if (ReplayUuid) {
      getReplay({ ReplayUuid, merge, RecFileName });
      getTagOptions();
    }
    setCupEvent(null);
    if (ReplayUuid && ReplayUuid.includes('c-')) {
      getCupEvent(ReplayUuid.split('-')[1]);
    }
  }, [ReplayUuid, merge]);

  if (!RecFileName && replay && replay.UUID === ReplayUuid) {
    navigate({
      to: `/r/${ReplayUuid}/${replay.RecFileName.replace('.rec', '')}`,
      replace: true,
    });
  }

  const isMobile = useMediaQuery('(max-width: 1024px)');

  if (
    !replay ||
    (replay?.RecFileName.replace('.rec', '') !== RecFileName && RecFileName)
  )
    return (
      <Layout t={`rec - ${ReplayUuid}`}>
        {loading ? <Loading /> : <div>not found</div>}
      </Layout>
    );

  if (isWindow) {
    uuidarray.push(replay.UUID);
    const linkType = getReplayLink(replay);
    link = linkType.link;
    type = linkType.type;
    if (replays.length > 0) {
      uuidarray = [];
      replays.forEach(r => {
        linkArray.push(getReplayLink(r).link);
        uuidarray.push(r.UUID);
      });
      link = linkArray.join(';');
    }
  }

  const getTags = () => {
    return replay.Tags.map(tag => tag.Name);
  };

  let eventRecs = null;
  if (cupEvent?.length > 0 && type === 'cup') {
    if (cupEvent[0].CupTimes?.length > 0) {
      eventRecs = cupEvent[0].CupTimes.filter(t => t.Replay || t.UUID);
    }
  }
  let recName = '';
  if (replay.DrivenByData && type === 'cup' && RecFileName) {
    recName = RecFileName.replace(
      replay.DrivenByData.Kuski.substring(0, 6),
      '',
    );
  }

  const updateUrl = (unmerge = false, recUuid) => {
    if (unmerge) {
      return merge?.includes(';')
        ? merge.startsWith(`${recUuid};`)
          ? `${location.pathname}?merge=${merge.replace(`${recUuid};`, '')}`
          : `${location.pathname}?merge=${merge.replace(`;${recUuid}`, '')}`
        : location.pathname;
    }
    return merge
      ? `${location.pathname}?merge=${merge};${recUuid}`
      : `${location.pathname}?merge=${recUuid}`;
  };

  let dlLink = link;
  if (linkArray?.length > 0) {
    dlLink = linkArray[linkArray.length - 1];
  }

  const shirtUrls =
    replays.length > 0
      ? replays.map(r => `${config.dlUrl}shirt/${r.DrivenByData?.KuskiIndex}`)
      : [`${config.dlUrl}shirt/${replay.DrivenByData?.KuskiIndex}`];

  return (
    <Layout t={`rec - ${replay.RecFileName}`}>
      <PlayerContainer theater={theater}>
        <Player>
          {isWindow && (
            <Recplayer
              rec={link}
              lev={`${config.dlUrl}level/${replay.LevelIndex}`}
              shirt={shirtUrls}
              controls
            />
          )}
        </Player>
        <ReplaySettings />
      </PlayerContainer>
      <RightBarContainer>
        <ChatContainer>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Header h3>
                <>{replay.RecFileName}</>
              </Header>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: 'column' }}>
              <ReplayDescription>
                <Row jc="space-between">
                  <Row>
                    {replay.DrivenByData?.BmpCRC ? (
                      <Avatar kuski={replay.DrivenByData} collapse margin={0} />
                    ) : null}
                    <Column jc="space-around" l="Small">
                      <div>
                        {replay.DrivenByData ? (
                          <Kuski kuskiData={replay.DrivenByData} flag team />
                        ) : (
                          replay.DrivenByText || 'Unknown'
                        )}
                      </div>
                      <div>
                        {isWindow ? (
                          <a href={dlLink}>
                            <RecTime type={type} replay={replay} />
                          </a>
                        ) : (
                          <RecTime type={type} replay={replay} />
                        )}{' '}
                        in{' '}
                        <Level
                          LevelData={replay.LevelData}
                          LevelIndex={replay.LevelIndex}
                        />
                      </div>
                    </Column>
                  </Row>
                  <Row t="Small">
                    <Views>{replay.Views}</Views> <Visibility />
                  </Row>
                </Row>
                <br />
                <div>{replay.Comment}</div>
                <BattleTimestamp>
                  Uploaded by{' '}
                  {replay.UploadedByData
                    ? replay.UploadedByData.Kuski
                    : 'Unknown'}{' '}
                  <LocalTime
                    date={replay.Uploaded}
                    format="yyyy-MM-dd HH:mm:ss"
                    parse="X"
                  />
                  {replay.Unlisted ? ' (Unlisted)' : null}
                </BattleTimestamp>
                <br />
                <ReplayRating
                  ReplayIndex={
                    replay.ReplayIndex ? replay.ReplayIndex : ReplayUuid
                  }
                />
              </ReplayDescription>
              <Tags tags={getTags()} />
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Header h3>Comments</Header>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: 'column' }}>
              <AddComment
                type="replay"
                index={replay.ReplayIndex ? replay.ReplayIndex : ReplayUuid}
              />
              <ReplayComments
                ReplayIndex={
                  replay.ReplayIndex ? replay.ReplayIndex : ReplayUuid
                }
              />
            </AccordionDetails>
          </Accordion>
          <EditReplay replay={replay} type={type} />
        </ChatContainer>
      </RightBarContainer>
      {eventRecs ? (
        <LevelStatsContainer>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Header h3>Cup event replays</Header>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: 'column', padding: 0 }}>
              <ListContainer>
                <ListHeader>
                  <ListCell width={30} right>
                    #
                  </ListCell>
                  <ListCell>Filename</ListCell>
                  <ListCell>Player</ListCell>
                  <ListCell>Time</ListCell>
                  <ListCell>Points</ListCell>
                </ListHeader>
                {eventRecs.length > 0 && (
                  <>
                    {eventRecs.map((t, index) => (
                      <ListRow
                        key={t.CupTimeIndex}
                        selected={uuidarray.indexOf(`c-${t.CupTimeIndex}`) > -1}
                        onHover={hover =>
                          hover ? setHover(index) : setHover(-1)
                        }
                      >
                        <ListCell width={30} right>
                          {index + 1}.
                        </ListCell>
                        <ListCell
                          to={`/r/c-${
                            t.CupTimeIndex
                          }/${`${recName}${t.KuskiData.Kuski.substring(
                            0,
                            6,
                          )}`}`}
                        >
                          {recName}
                          {t.KuskiData.Kuski.substring(0, 6)}
                        </ListCell>
                        <ListCell>
                          <Kuski kuskiData={t.KuskiData} team flag />
                        </ListCell>
                        <ListCell
                          to={`/r/c-${
                            t.CupTimeIndex
                          }/${`${recName}${t.KuskiData.Kuski.substring(
                            0,
                            6,
                          )}`}`}
                        >
                          <Time apples={-1} time={t.Time} />
                        </ListCell>
                        <ListCell>{pts(t.Points)}</ListCell>
                        {(isMobile || isHover === index) && (
                          <MergeContainer
                            title={
                              uuidarray.indexOf(`c-${t.CupTimeIndex}`) > -1
                                ? 'Unmerge replay'
                                : 'Merge replay'
                            }
                          >
                            {uuidarray.indexOf(`c-${t.CupTimeIndex}`) > -1 ? (
                              <>
                                {merge?.includes(`c-${t.CupTimeIndex}`) && (
                                  <Link
                                    to={updateUrl(
                                      true,
                                      `c-${
                                        t.CupTimeIndex
                                      }-${recName}${t.KuskiData.Kuski.substring(
                                        0,
                                        6,
                                      )}`,
                                    )}
                                  >
                                    <IndeterminateCheckBox />
                                  </Link>
                                )}
                              </>
                            ) : (
                              <Link
                                to={updateUrl(
                                  false,
                                  `c-${
                                    t.CupTimeIndex
                                  }-${recName}${t.KuskiData.Kuski.substring(
                                    0,
                                    6,
                                  )}`,
                                )}
                              >
                                <AddBox />
                              </Link>
                            )}
                          </MergeContainer>
                        )}
                      </ListRow>
                    ))}
                  </>
                )}
              </ListContainer>
            </AccordionDetails>
          </Accordion>
        </LevelStatsContainer>
      ) : null}
      <LevelStatsContainer>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Header h3>Other replays in level</Header>
          </AccordionSummary>
          <AccordionDetails style={{ flexDirection: 'column' }}>
            <RecList
              LevelIndex={replay.LevelIndex}
              currentUUID={uuidarray}
              columns={['Uploaded', 'Replay', 'Time', 'By', 'Tags']}
              horizontalMargin={-16}
              mergable
            />
          </AccordionDetails>
        </Accordion>
      </LevelStatsContainer>
    </Layout>
  );
};

const EditReplay = ({ replay, type }) => {
  const { userid } = useStoreState(state => state.Login);
  const [edit, setEdit] = useState();
  const { submitEdit } = useStoreActions(state => state.ReplayByUUID);
  const { tagOptions } = useStoreState(state => state.Upload);
  const { ReplayUuid, RecFileName } = useParams({ strict: false });
  const location = useLocation();
  const { merge } = location.search;

  const onOpen = expanded => {
    if (expanded) {
      setEdit({
        Comment: replay.Comment,
        DrivenBy: replay.DrivenByData
          ? replay.DrivenByData.Kuski
          : replay.DrivenByText,
        Unlisted: replay.Unlisted,
        Tags: replay.Tags.map(tag => tag.TagIndex),
      });
    }
  };

  if ((userid !== replay.UploadedBy && mod() !== 1) || type !== 'replay') {
    return null;
  }
  return (
    <Accordion onChange={(e, expanded) => onOpen(expanded)}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Header h3>Edit replay</Header>
      </AccordionSummary>
      {edit ? (
        <>
          <AccordionDetails style={{ flexDirection: 'column' }}>
            {userid === replay.UploadedBy && (
              <TextField
                name="Comment"
                value={edit.Comment}
                onChange={value =>
                  setEdit(prev => ({ ...prev, Comment: value }))
                }
              />
            )}
            <TextField
              name="Driven by"
              value={edit.DrivenBy}
              onChange={value =>
                setEdit(prev => ({ ...prev, DrivenBy: value }))
              }
            />
            {userid === replay.UploadedBy && (
              <FieldBoolean
                label="Unlisted"
                value={edit.Unlisted}
                onChange={() =>
                  setEdit(prev => ({ ...prev, Unlisted: 1 - prev.Unlisted }))
                }
              />
            )}
            <div style={{ padding: '16px' }}>
              <Typography color="textSecondary">Tags</Typography>
              {tagOptions.map(option => {
                if (edit.Tags.includes(option.TagIndex)) {
                  return (
                    <Chip
                      label={option.Name}
                      onDelete={() =>
                        setEdit(prev => ({
                          ...prev,
                          Tags: xor(prev.Tags, [option.TagIndex]),
                        }))
                      }
                      color="primary"
                      style={{ margin: 4 }}
                    />
                  );
                } else {
                  return (
                    <Chip
                      label={option.Name}
                      onClick={() =>
                        setEdit(prev => ({
                          ...prev,
                          Tags: xor(edit.Tags, [option.TagIndex]),
                        }))
                      }
                      style={{ margin: 4 }}
                    />
                  );
                }
              })}
            </div>
            <Button
              onClick={() =>
                submitEdit({
                  edit: {
                    ...edit,
                    Tags: tagOptions.filter(option =>
                      edit.Tags.includes(option.TagIndex),
                    ),
                  },
                  ReplayUuid,
                  merge,
                  RecFileName,
                })
              }
            >
              Edit
            </Button>
          </AccordionDetails>
        </>
      ) : null}
    </Accordion>
  );
};

const Views = styled.span`
  margin-right: ${p => p.theme.padXSmall};
`;

const PlayerContainer = styled.div`
  width: ${p => (p.theater ? '100%' : '70%')};
  float: left;
  padding: 7px;
  box-sizing: border-box;
  @media (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

const Player = styled.div`
  background: ${p => p.theme.pageBackground};
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 1100px) {
    height: 56vw;
    min-height: 450px;
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

const LevelStatsContainer = styled.div`
  width: 70%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
  @media (max-width: 1100px) {
    float: none;
    width: 100%;
  }
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

export default Replay;
