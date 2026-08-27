import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {
  TextField,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Chip,
} from '@material-ui/core';
import Header from 'components/Header';
import Dropzone from 'components/Dropzone';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Alert from 'components/Alert';
import Link from 'components/Link';
import { Text, Column } from 'components/Containers';
import config from 'config';
import { authToken, nick } from 'utils/nick';
import { xor } from 'lodash';
import { renameFile } from 'utils/misc';
import Feedback from 'components/Feedback';

const Upload = ({ onUpload = null, filetype }) => {
  const {
    insertReplay,
    updateReplay,
    setError,
    getKuskiByName,
    getTagOptions,
    cleanup,
  } = useStoreActions(actions => actions.Upload);
  const { inserted, updated, error, kuskiInfo, tagOptions } = useStoreState(
    state => state.Upload,
  );
  const { loggedIn, username, userid } = useStoreState(state => state.Login);
  const [files, setFiles] = useState([]);
  const [fileInfo, setFileInfo] = useState({});
  const [duplicate, setDuplicate] = useState(false);
  const [duplicateText, setDuplicateText] = useState('');
  const [duplicateLink, setDuplicateLink] = useState('');
  const [duplicateOptions, setDuplicateOptions] = useState(['okay']);
  const [duplicateReplayIndex, setDuplicateReplayIndex] = useState(0);
  const [uploaded, setUploaded] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [warning, setWarning] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [update, setUpdate] = useState(0);

  const onDrop = newFiles => {
    const newFileInfo = {};
    const fixedFiles = newFiles.map(f => {
      return renameFile(f, f.name.replace('.REC', '.rec'));
    });
    let unlisted = false;
    if (
      ['cpc'].indexOf(fixedFiles[0].name.substring(0, 3).toLowerCase()) > -1
    ) {
      unlisted = true;
      setWarning(
        `It looks like you're uploading a cup replay, it will be unlisted by default. Please avoid sharing it publicly. To share with your team, you can also use the team tab on the cup page.`,
      );
    }
    fixedFiles.forEach((file, index) => {
      newFileInfo[file.name] = {
        name: file.name,
        unlisted,
        hide: false,
        tas: false,
        bug: false,
        nitro: false,
        drivenBy: '',
        error: 'Kuski not found',
        index,
        kuskiIndex: 0,
        comment: '',
        tags: [],
      };
      if (loggedIn) {
        newFileInfo[file.name].drivenBy = username;
        newFileInfo[file.name].error = '';
        newFileInfo[file.name].kuskiIndex = userid;
      }
    });
    setFileInfo(newFileInfo);
    setFiles(fixedFiles);
    setDuplicate(false);
    setDuplicateReplayIndex(0);
    setUploaded([]);
  };

  useEffect(() => {
    getTagOptions();
    return () => {
      setUploaded([]);
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (inserted) {
      if (inserted.RecFileName) {
        if (fileInfo[inserted.RecFileName]) {
          if (fileInfo[inserted.RecFileName].index > -1) {
            const newFiles = files.slice();
            newFiles.splice(fileInfo[inserted.RecFileName].index, 1);
            setFiles(newFiles);
          }
          const newUploaded = uploaded.slice();
          const fullUrl = `${location.protocol}//${location.hostname}${
            location.port ? `:${location.port}` : ''
          }${url(inserted)}`;
          newUploaded.push({
            RecFileName: inserted.RecFileName,
            UUID: inserted.UUID,
            url: fullUrl,
          });
          setUploaded(newUploaded);
          if (onUpload) {
            onUpload();
          }
        }
      }
    }
  }, [inserted]);

  const url = rec => {
    return `/r/${rec.UUID}/${rec.RecFileName.substring(
      0,
      rec.RecFileName.length - 4,
    )}`;
  };

  const handleUnlisted = (name, event) => {
    const newFileInfo = fileInfo;
    newFileInfo[name].unlisted = event.target.checked;
    setFileInfo(newFileInfo);
    setUpdate(Math.random());
  };

  const handleHide = (name, event) => {
    const newFileInfo = fileInfo;
    newFileInfo[name].hide = event.target.checked;
    setFileInfo(newFileInfo);
    setUpdate(Math.random());
  };

  const handleComment = (name, event) => {
    const newFileInfo = fileInfo;
    newFileInfo[name].comment = event.target.value;
    setFileInfo(newFileInfo);
    setUpdate(Math.random());
  };

  const handleTags = (name, value) => {
    const newFileInfo = fileInfo;
    newFileInfo[name].tags = xor(newFileInfo[name].tags, [value]);
    setFileInfo(newFileInfo);
    setUpdate(Math.random());
  };

  useEffect(() => {
    const newFileInfo = fileInfo;
    if (kuskiInfo) {
      if (kuskiInfo.KuskiIndex && kuskiInfo.RecFileName) {
        newFileInfo[kuskiInfo.RecFileName].kuskiIndex = kuskiInfo.KuskiIndex;
        newFileInfo[kuskiInfo.RecFileName].error = '';
      } else if (kuskiInfo.RecFileName) {
        newFileInfo[kuskiInfo.RecFileName].kuskiIndex = 0;
        newFileInfo[kuskiInfo.RecFileName].error = 'Kuski not found';
      }
    }
    setFileInfo(newFileInfo);
    setUpdate(Math.random());
  }, [kuskiInfo]);

  const handleDrivenBy = (name, event) => {
    const newFileInfo = fileInfo;
    newFileInfo[name].drivenBy = event.target.value;
    setFileInfo(newFileInfo);
    getKuskiByName({ Kuski: event.target.value, RecFileName: name });
    setUpdate(Math.random());
  };

  useEffect(() => {
    if (updated) {
      if (updated.ReplayIndex) {
        if (onUpload) {
          onUpload();
        }
      }
    }
  }, [updated]);

  const handleAlert = i => {
    setFiles([]);
    setError('');
    setDuplicate(false);
    setDuplicateLink('');
    setDuplicateReplayIndex(0);
    if (i === 1) {
      updateReplay(duplicateReplayIndex);
    }
  };

  const upload = () => {
    setIsUploading(true);
    files.forEach(file => {
      const data = new FormData();
      data.append('file', file);
      data.append('filename', file.name);
      fetch(`${config.url}upload/replay`, {
        method: 'POST',
        body: data,
        headers: {
          Authorization: authToken(),
        },
      })
        .then(response => {
          response.json().then(body => {
            if (body.error) {
              if (body.error === 'Duplicate') {
                setError(body.error);
                setDuplicate(true);
                const oldUnlisted = body.replayInfo[0].Unlisted;
                const newUnlisted = +fileInfo[body.file].unlisted;
                if (oldUnlisted === newUnlisted) {
                  setDuplicateText(
                    'Replay already in the database. Upload failed.',
                  );
                  setDuplicateLink(url(body.replayInfo[0]));
                  setDuplicateOptions(['okay']);
                } else if (oldUnlisted === 0 && newUnlisted === 1) {
                  setDuplicateText(
                    'Replay already public in database. Upload failed.',
                  );
                  setDuplicateLink(url(body.replayInfo[0]));
                  setDuplicateOptions(['okay']);
                } else if (oldUnlisted === 1 && newUnlisted === 0) {
                  setDuplicateText(
                    'Replay already in database, but currently Unlisted. Would you like to make it public?',
                  );
                  setDuplicateOptions(['Cancel upload', 'Yes']);
                  setDuplicateReplayIndex(body.replayInfo[0].ReplayIndex);
                }
              } else if (body.error && body.error.code) {
                if (body.error.code === 'ENOENT' && body.error.errno === -2) {
                  setError('Filename too long.');
                }
              } else {
                setError(body.error.toString());
              }
            } else {
              insertReplay({
                UploadedBy: 0,
                UUID: body.uuid,
                RecFileName: body.file,
                Uploaded: Math.floor(Date.now() / 1000),
                ReplayTime: body.time,
                Finished: body.finished,
                LevelIndex: body.LevelIndex,
                Unlisted:
                  body.uuid.substring(0, 5) === 'local'
                    ? 1
                    : +fileInfo[body.file].unlisted,
                Hide: +fileInfo[body.file].hide,
                DrivenBy: fileInfo[body.file].kuskiIndex,
                TAS: +fileInfo[body.file].tas,
                Bug: +fileInfo[body.file].bug,
                Nitro: +fileInfo[body.file].nitro,
                Comment: fileInfo[body.file].comment,
                MD5: body.MD5,
                DrivenByText: fileInfo[body.file].drivenBy,
                Tags: fileInfo[body.file].tags,
              });
            }
          });
        })
        .finally(() => {
          setIsUploading(false);
        });
    });
  };

  return (
    <>
      <Column p="Large">
        <Header h1>Replay upload</Header>
        <Text>
          Upload a replay to view it in browser and get a unique url to share it
          privately or publicly.
        </Text>
        <Text>
          Note that any finished run since september 5th 2021 can be viewed and
          shared from your{' '}
          {nick() ? (
            <Link to={`/kuskis/${nick()}/times`}>profile</Link>
          ) : (
            'profile'
          )}
          .
        </Text>
        <div className="dropzone">
          <Dropzone filetype={filetype} error={error} onDrop={e => onDrop(e)} />
        </div>
        {uploaded &&
          uploaded.map(u => (
            <UploadCard key={u.RecFileName}>
              <CardContent>
                {u.RecFileName}
                <Link to={url(u)}>
                  <div>{u.url}</div>
                </Link>
              </CardContent>
            </UploadCard>
          ))}
        {!files
          ? '<div>None..</div>'
          : files.map(rec => (
              <React.Fragment key={rec.name}>
                {fileInfo[rec.name] && (
                  <UploadCard key={rec.name}>
                    <CardContent>
                      {rec.name}
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <div>
                            <TextField
                              id="DrivenBy"
                              label="Driven by"
                              value={fileInfo[rec.name].drivenBy}
                              onChange={e => handleDrivenBy(rec.name, e)}
                              margin="normal"
                              helperText={fileInfo[rec.name].error}
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <div>
                            <TextField
                              id="Comment"
                              multiline
                              label="Comment"
                              value={fileInfo[rec.name].comment}
                              onChange={e => handleComment(rec.name, e)}
                              margin="normal"
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography color="textSecondary">Tags</Typography>
                          {tagOptions.map(option => {
                            if (fileInfo[rec.name].tags.includes(option)) {
                              return (
                                <Chip
                                  label={option.Name}
                                  onDelete={() => handleTags(rec.name, option)}
                                  color="primary"
                                  style={{ margin: 4 }}
                                />
                              );
                            } else {
                              return (
                                <Chip
                                  label={option.Name}
                                  onClick={() => handleTags(rec.name, option)}
                                  style={{ margin: 4 }}
                                />
                              );
                            }
                          })}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <div>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={fileInfo[rec.name].unlisted}
                                  onChange={e => handleUnlisted(rec.name, e)}
                                  value="unlisted"
                                  color="primary"
                                  disabled={fileInfo[rec.name].hide}
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
                                  checked={fileInfo[rec.name].hide}
                                  onChange={e => handleHide(rec.name, e)}
                                  value="hide"
                                  color="primary"
                                  disabled={fileInfo[rec.name].unlisted}
                                />
                              }
                              label="Silent upload"
                              title="Not shown in latest replays, but still shown in search and level pages"
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </UploadCard>
                )}
              </React.Fragment>
            ))}
        <UploadButtonContainer container>
          <Grid item xs={12}>
            {files.length > 0 && (
              <>
                <Button
                  onClick={() => {
                    upload();
                  }}
                  disabled={isUploading}
                  style={{ float: 'right' }}
                  variant="contained"
                  color="primary"
                >
                  Upload
                </Button>
                <Button
                  onClick={() => {
                    setFiles([]);
                    setError('');
                    setDuplicate(false);
                    setDuplicateReplayIndex(0);
                  }}
                  style={{ float: 'right', marginRight: '8px' }}
                  variant="contained"
                >
                  Cancel
                </Button>
              </>
            )}
          </Grid>
        </UploadButtonContainer>
      </Column>
      <Alert
        title="Duplicate replay file"
        open={duplicate}
        text={duplicateText}
        link={duplicateLink}
        options={duplicateOptions}
        onClose={i => handleAlert(i)}
      />
      <Feedback
        open={warning !== ''}
        text={warning}
        type="warning"
        close={() => setWarning('')}
        autoHide={false}
      />
    </>
  );
};

const UploadCard = styled(Card)`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const UploadButtonContainer = styled(Grid)`
  margin-top: 8px;
`;

Upload.propTypes = {
  onUpload: PropTypes.func,
  filetype: PropTypes.string.isRequired,
};

export default Upload;
