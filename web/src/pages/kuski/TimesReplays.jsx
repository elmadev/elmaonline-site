import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import {
  Button as MuiButton,
  Backdrop,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Chip,
  RadioGroup,
  Radio,
} from '@material-ui/core';
import { Row } from 'components/Containers';
import Time from 'components/Time';
import LocalTime from 'components/LocalTime';
import { Level } from 'components/Names';
import {
  PlayArrow,
  Share,
  HighlightOffOutlined as CloseIcon,
} from '@material-ui/icons';
import styled from '@emotion/styled';
import config from 'config';
import { FixedSizeList as List } from 'react-window';
import {
  ListContainer,
  ListCell,
  ListRow,
  ListHeader,
  ListInput,
} from 'components/List';
import useElementSize from 'utils/useWindowSize';
import Link from 'components/Link';
import { nick, nickId } from 'utils/nick';
import Button from 'components/Buttons';
import { xor } from 'lodash';
import Preview from './Preview';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { downloadRec } from 'utils/misc';
import Feedback from 'components/Feedback';

const TimesReplays = ({ KuskiIndex, collapse }) => {
  const [type, setType] = useState('timesAndReplays');
  const [feedback, setFeedback] = useState('');
  const [hover, setHover] = useState(0);
  const [replay, openReplay] = useState(null);
  const [replayIndex, setReplayIndex] = useState(0);
  const [share, setShare] = useState(null);
  const { search, kuski } = useStoreState(state => state.Kuski);
  const state = useStoreState(state => state.Kuski);
  const { getTagOptions } = useStoreActions(actions => actions.Upload);
  const { tagOptions } = useStoreState(state => state.Upload);
  const { shareTimeFile, setSearch } = useStoreActions(
    actions => actions.Kuski,
  );
  const actions = useStoreActions(actions => actions.Kuski);
  const windowSize = useElementSize();
  const listHeight = windowSize.height - 379 + (collapse ? 100 : 0);
  useEffect(() => {
    getTagOptions();
  }, []);

  useEffect(() => {
    fetch();
  }, [type]);

  const isMobile = useMediaQuery('(max-width: 1024px)');

  const fetch = newSearch => {
    if (actions[type]?.fetch) {
      actions[type].fetch({
        limit: 100,
        search: { ...search, ...newSearch },
        KuskiIndex,
      });
    }
  };

  const close = () => {
    openReplay(null);
    setReplayIndex(0);
  };

  const data = state[type]?.data || null;
  const loading = state[type]?.loading || false;
  const error = state[type]?.error || null;

  const nextReplay = () => {
    const next = replayIndex + 1;
    if (next >= data.length) {
      close();
      return;
    }
    if (!data[next].TimeFileData) {
      close();
      return;
    }
    openReplay(data[next]);
    setReplayIndex(next);
  };

  const previousReplay = () => {
    const prev = replayIndex - 1;
    if (prev < 0) {
      close();
      return;
    }
    if (!data[prev].TimeFileData) {
      close();
      return;
    }
    openReplay(data[prev]);
    setReplayIndex(prev);
  };

  const selectToShare = rec => {
    let unlisted = false;
    if (
      ['cpc'].indexOf(rec.LevelData?.LevelName?.substring(0, 3).toLowerCase()) >
      -1
    ) {
      unlisted = true;
    }
    setShare({
      time: rec,
      comment: '',
      hide: false,
      unlisted,
      tags: [],
    });
  };

  const shareReplay = async () => {
    const res = await shareTimeFile({
      ...share.time,
      Unlisted: share.unlisted,
      Hide: share.hide,
      Comment: share.comment,
      Tags: share.tags,
      search,
      KuskiIndex,
    });
    setShare(null);
    if (res.status === 401) {
      setFeedback(`You're not logged in or this is not your replay.`);
      return;
    }
    if (res.data?.error === 'duplicate') {
      setFeedback('Replay is already uploaded manually.');
      return;
    }
  };

  const replayUrl = time => {
    if (!time.TimeFileData) {
      return '';
    }
    const timeAsString = `${time.Time}`;
    const levName =
      time.LevelData.LevelName.substring(0, 6) === 'QWQUU0'
        ? time.LevelData.LevelName.substring(6, 8)
        : time.LevelData.LevelName.replace('#', '');
    const RecFileName = `${levName}${nick().substring(
      0,
      Math.min(15 - (levName.length + timeAsString.length), 4),
    )}${timeAsString}`;
    return `/r/${time.TimeFileData.UUID}/${RecFileName}`;
  };

  return (
    <>
      <ListContainer loading={loading} error={error}>
        <ListHeader>
          <ListCell width={120}>Level</ListCell>
          <ListCell width={120}>Time</ListCell>
          <ListCell width={155}>Driven</ListCell>
          <ListCell width={155}></ListCell>
          {type !== 'PRsAndReplays' ? (
            <ListCell width={100}>FPS Limit</ListCell>
          ) : null}
          <ListCell width={300}>Replay</ListCell>
          <ListCell>
            <RadioGroup
              aria-label="type"
              value={type}
              onChange={n => setType(n.target.value)}
              name="weeks"
              row
            >
              <FormControlLabel
                value="timesAndReplays"
                checked={type === 'timesAndReplays'}
                label="Finished times"
                control={<RadioThin size="small" />}
              />
              <FormControlLabel
                value="PRsAndReplays"
                checked={type === 'PRsAndReplays'}
                label="Only PR's"
                control={<RadioThin size="small" />}
              />
              {KuskiIndex === nickId() ? (
                <FormControlLabel
                  value="runsAndReplays"
                  checked={type === 'runsAndReplays'}
                  label="All runs"
                  control={<RadioThin size="small" />}
                />
              ) : null}
            </RadioGroup>
          </ListCell>
        </ListHeader>
        <ListRow>
          <ListInput
            label="Search level"
            title="Exact file name"
            value={search.level}
            onChange={value => setSearch({ field: 'level', value })}
            maxLength={11}
            onEnter={level => fetch({ ...search, level })}
          />
          <ListCell />
          <ListInput
            label="Driven on or after"
            date
            value={search.from}
            onChange={value => {
              setSearch({ field: 'from', value });
              fetch({ ...search, from: value });
            }}
          />
          <ListInput
            label="Driven on or before"
            date
            value={search.to}
            onChange={value => {
              setSearch({ field: 'to', value });
              fetch({ ...search, to: value });
            }}
          />
          <ListCell />
          <ListCell />
          {type !== 'PRsAndReplays' ? <ListCell /> : null}
        </ListRow>
      </ListContainer>
      {data?.length > 0 && (
        <ListContainer flex>
          <List
            height={!isNaN(listHeight) ? listHeight : 0}
            itemCount={data.length}
            itemSize={40}
          >
            {({ index, style }) => {
              const time = data[index];

              return (
                <div style={style} key={time.TimeIndex}>
                  <ListRow
                    onHover={hovering => {
                      if (hovering) {
                        setHover(time.TimeIndex);
                      } else {
                        setHover(0);
                      }
                    }}
                  >
                    <ListCell width={120} title={time.LevelData?.LongName}>
                      <Level
                        LevelIndex={time.LevelIndex}
                        LevelData={time.LevelData}
                      />
                    </ListCell>
                    <ListCell width={120}>
                      <Time time={time.Time} />
                    </ListCell>
                    <ListCell width={300}>
                      <LocalTime
                        date={time.Driven}
                        format="eee d MMM yyyy HH:mm:ss"
                        parse="X"
                      />
                    </ListCell>
                    <ListCell width={10} />
                    {type !== 'PRsAndReplays' ? (
                      <ListCell width={100}>{time.FPSLimit || '-'}</ListCell>
                    ) : null}
                    <ListCell>
                      {(isMobile || hover === time.TimeIndex) &&
                        time.TimeFileData && (
                          <>
                            <DownloadText
                              onClick={() =>
                                downloadRec(
                                  `${config.s3Url}time/${time.TimeFileData.UUID}-${time.TimeFileData.MD5}/${time.TimeIndex}.rec`,
                                  time?.LevelData?.LevelName,
                                  kuski?.Kuski,
                                  time?.Time,
                                )
                              }
                            >
                              Download
                            </DownloadText>
                            <MuiButton
                              title="View"
                              onClick={() => {
                                openReplay(time);
                                setReplayIndex(index);
                              }}
                            >
                              <PlayArrow />
                            </MuiButton>
                            {time.TimeFileData.Shared === 0 && (
                              <MuiButton
                                title="Share"
                                onClick={() => {
                                  selectToShare(time);
                                }}
                              >
                                <Share />
                              </MuiButton>
                            )}
                            {time.TimeFileData.Shared === 1 && (
                              <Link to={replayUrl(time)}>
                                <div>Go to replay page</div>
                              </Link>
                            )}
                          </>
                        )}
                    </ListCell>
                    <ListCell />
                  </ListRow>
                </div>
              );
            }}
          </List>
        </ListContainer>
      )}
      {replay && (
        <Preview
          previewRec={replay}
          setPreviewRec={() => close()}
          nextReplay={() => nextReplay()}
          previousReplay={() => previousReplay()}
        />
      )}
      {share && (
        <Backdrop open={true} style={{ zIndex: 100 }}>
          <Container>
            <Row jc="space-between">
              <div>
                Share <Time time={share.time.Time} /> in{' '}
                <Level
                  LevelIndex={share.time.LevelIndex}
                  LevelData={share.time.LevelData}
                />{' '}
                driven at{' '}
                <LocalTime
                  date={share.time.Driven}
                  format="eee d MMM yyyy HH:mm:ss"
                  parse="X"
                />
              </div>
              <Close onClick={() => setShare(null)} />
            </Row>
            <div>
              <TextField
                id="Comment"
                multiline
                label="Comment"
                value={share ? share.comment : ''}
                onChange={e => setShare({ ...share, comment: e.target.value })}
                margin="normal"
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={share ? share.unlisted : false}
                    onChange={() =>
                      setShare({ ...share, unlisted: !share.unlisted })
                    }
                    value="unlisted"
                    color="primary"
                    disabled={share ? share.hide : false}
                  />
                }
                label="Unlisted"
                title="Only you and people you share the link with can see it"
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={share ? share.hide : false}
                    onChange={() => setShare({ ...share, hide: !share.hide })}
                    value="hide"
                    color="primary"
                    disabled={share ? share.unlisted : false}
                  />
                }
                label="Silent upload"
                title="Not shown in latest replays, but still shown in search and level pages"
              />
            </div>
            <Typography color="textSecondary">Tags</Typography>
            <div>
              {tagOptions.map(option => {
                if (share.tags.includes(option)) {
                  return (
                    <Chip
                      label={option.Name}
                      onDelete={() =>
                        setShare({
                          ...share,
                          tags: xor(share.tags, [option]),
                        })
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
                        setShare({
                          ...share,
                          tags: xor(share.tags, [option]),
                        })
                      }
                      style={{ margin: 4 }}
                    />
                  );
                }
              })}
            </div>
            <Button margin="6px" onClick={() => shareReplay()}>
              Share
            </Button>
          </Container>
        </Backdrop>
      )}
      <Feedback
        open={feedback !== ''}
        text={feedback}
        type="error"
        close={() => setFeedback('')}
      />
    </>
  );
};

const Close = styled(CloseIcon)`
  cursor: pointer;
  color: ${p => p.theme.lightTextColor};

  :hover {
    color: red;
  }
`;

const DownloadText = styled.span`
  color: ${p => p.theme.linkColor};
  cursor: pointer;
  & :hover {
    color: ${p => p.theme.linkHover};
  }
`;

const Container = styled.div`
  background: ${p => p.theme.paperBackground};
  width: 50%;
  @media (max-width: 730px) {
    width: 100%;
  }
  padding: ${p => p.theme.padMedium};
`;

const RadioThin = styled(Radio)`
  && {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

export default TimesReplays;
