import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useStoreState, useStoreActions } from 'easy-peasy';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Alert from 'components/Alert';
import { Text, Column } from 'components/Containers';
import Dropzone from 'components/Dropzone';
import Header from 'components/Header';
import Link from 'components/Link';
import styled from '@emotion/styled';
import {
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Chip,
} from '@material-ui/core';
import { NewLGR, EditLGR } from 'api';
import { xor } from 'lodash';
import { mod, nick } from 'utils/nick';

const tagDescriptions = [
  { label: 'Bike', description: 'Modified bike' },
  {
    label: 'Default',
    description: 'default.lgr replacement',
  },
  {
    label: "Don't Use",
    description: 'Deprecated file',
  },
  {
    label: 'Ghost',
    description: 'Ghost or wireframe second bike',
  },
  { label: 'Grass', description: 'Modified grass' },
  { label: 'Masks+', description: 'More masks than default.lgr' },
  { label: 'Minimal', description: 'Simplified LGR for focused hoyling' },
  { label: 'Pictures+', description: 'More pictures than default.lgr' },
  {
    label: 'Round Obj',
    description: 'Apples, killers and flowers are perfect circles',
  },
  { label: 'Round Head', description: "Kuski's head is a perfect circle" },
  { label: 'Textures+', description: 'More textures than default.lgr' },
  { label: 'Tool', description: 'Moviemaking LGR or other tools' },
  { label: 'Theme', description: 'Complete graphics overhaul' },
];

const defaultReplay = 'hzynbftauw'; // Zweq Warm Up 14.00 replay

// Used for new uploads if lgrToEdit is undefined, as well as editing an existing lgr if it is not
const LGRUpload = ({ lgrToEdit }) => {
  const { tagOptions } = useStoreState(state => state.LGRUpload);
  const { getTagOptions } = useStoreActions(actions => actions.LGRUpload);
  const { getLGR } = useStoreActions(actions => actions.LGR);
  const navigate = useNavigate();

  const defaultLgrData = lgrToEdit
    ? {
        file: null,
        filename: lgrToEdit.LGRName,
        kuskiName: lgrToEdit.KuskiData.Kuski,
        preview: null,
        description: lgrToEdit.LGRDesc,
        replayUuid: lgrToEdit.ReplayUUID || defaultReplay,
        tags: lgrToEdit.Tags.map(tag => tag.TagIndex),
      }
    : {
        file: null,
        filename: null,
        preview: null,
        description: '',
        replayUuid: '',
        tags: [],
      };

  const [lgrData, setLgrData] = useState(defaultLgrData);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    title: '',
    text: '',
    link: '',
    options: ['Close'],
  });

  const { getReplayByUUID } = useStoreActions(state => state.ReplayByUUID);
  const { replay, loading } = useStoreState(state => state.ReplayByUUID);
  const fingerprint = useRef('');
  useEffect(() => {
    const getReplay = async ReplayUuid => {
      if (ReplayUuid === '') {
        return;
      }
      if (!fingerprint.current) {
        const fp = await FingerprintJS.load();
        const { visitorId } = await fp.get();
        fingerprint.current = visitorId;
      }
      getReplayByUUID({
        ReplayUuid: ReplayUuid,
        Fingerprint: fingerprint.current,
      });
    };
    getReplay(lgrData.replayUuid);
  }, [lgrData.replayUuid]);
  const replayValid = lgrData.replayUuid && !loading && replay;
  const replayLink =
    replayValid && `${location.origin}/r/${replay.UUID}/${replay.RecFileName}`;
  const replayInvalid = lgrData.replayUuid && !loading && !replay;

  useEffect(() => {
    getTagOptions(mod());
    reset();
  }, [lgrToEdit]);

  // Only for mods, and only on editing existing lgrs
  const modPrivileges = lgrToEdit && mod() === 1;

  // Hide hidden tags, unless a mod is editing an existing lgr
  const tagFilter = modPrivileges ? () => true : tag => !tag.Hidden;

  const reset = () => {
    setLgrData(defaultLgrData);
  };

  const closeAlert = () => {
    setAlert({
      ...alert,
      open: false,
    });
  };

  const onDropLGR = newFiles => {
    // Dropzone already limits the file size to 10 MB
    if (lgrToEdit) {
      return;
    }
    if (newFiles.length !== 1) {
      reset();
      return;
    }
    const newFile = newFiles[0];
    const filename = newFile.name.toLowerCase();
    if (!filename.endsWith('.lgr')) {
      setAlert({
        ...alert,
        open: true,
        title: 'Error',
        text: `LGR filename does not end in .lgr!`,
        link: '',
      });
      reset();
      return;
    }
    const lgrName = filename.slice(0, -4);
    if (lgrName.length > 8) {
      setAlert({
        ...alert,
        open: true,
        title: 'Error',
        text: `LGR filename is too long!`,
        link: '',
      });
      reset();
      return;
    }
    setLgrData({
      file: newFile,
      filename: filename.slice(0, -4),
      preview: null,
      description: '',
      replayUuid: defaultReplay,
      tags: [],
    });
  };

  const onDropPreview = newFiles => {
    // Dropzone already limits the file size to 10 MB
    if (newFiles.length !== 1) {
      setLgrData({
        ...lgrData,
        preview: null,
      });
      return;
    }
    setLgrData({
      ...lgrData,
      preview: newFiles[0],
    });
  };

  useEffect(() => {
    if (!lgrData.preview) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(lgrData.preview);
    setPreview(url);

    // prevent memory leak
    return () => URL.revokeObjectURL(url);
  }, [lgrData.preview]);

  const handleString = property => event => {
    setLgrData({
      ...lgrData,
      [property]: event.target.value,
    });
  };

  const handleTag = tag => {
    setLgrData({
      ...lgrData,
      tags: xor(lgrData.tags, [tag]),
    });
  };

  const upload = async () => {
    if (!lgrData.preview) {
      setAlert({
        ...alert,
        open: true,
        title: 'Error',
        text: `Both an lgr and an image file must be provided to create new lgr!`,
        link: '',
      });
      return;
    }
    if (!replayValid) {
      setAlert({
        ...alert,
        open: true,
        title: 'Error',
        text: `A valid replay must be linked!`,
        link: '',
      });
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    // files
    formData.append('lgr', lgrData.file);
    formData.append('preview', lgrData.preview);
    // body
    formData.append('filename', lgrData.filename);
    formData.append('description', lgrData.description);
    formData.append('tags', JSON.stringify(lgrData.tags));
    formData.append('replay', replay.UUID);
    try {
      const res = await NewLGR(formData);
      if (res.data && !res.data.error) {
        setAlert({
          ...alert,
          open: true,
          title: 'LGR Uploaded!',
          text: `Congratulations, your LGR is uploaded. You can see your LGR here:`,
          link: `/lgr/${lgrData.filename}`,
        });
        reset();
      } else {
        setAlert({
          ...alert,
          open: true,
          title: 'Error',
          text: `There was a problem with uploading your LGR: ${res.data ? res.data.error : 'Unknown error'}`,
          link: '',
        });
      }
    } finally {
      setIsUploading(false);
    }
  };
  const edit = async () => {
    if (lgrData.filename.length > 8) {
      setAlert({
        ...alert,
        open: true,
        title: 'Error',
        text: `LGR filename is too long!`,
        link: '',
      });
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    // files
    if (lgrData.preview) {
      formData.append('preview', lgrData.preview);
    }
    // body
    formData.append('filename', lgrData.filename);
    formData.append('kuskiName', lgrData.kuskiName);
    formData.append('description', lgrData.description);
    formData.append('tags', JSON.stringify(lgrData.tags));
    if (replayValid) {
      formData.append('replay', replay.UUID);
    }
    try {
      const res = await EditLGR(lgrToEdit.LGRName, formData);
      if (res.data && !res.data.error) {
        if (lgrData.filename !== lgrToEdit.LGRName) {
          navigate({ to: `/lgr/${lgrData.filename}` });
        }
        // Get the updated lgr data
        getLGR(lgrData.filename);
      } else {
        setAlert({
          ...alert,
          open: true,
          title: 'Error',
          text: `There was a problem editing your LGR: ${res.data ? res.data.error : 'Unknown error'}`,
          link: '',
        });
      }
    } finally {
      setIsUploading(false);
    }
  };
  const uploadOrEdit = lgrToEdit ? edit : upload;

  return (
    <>
      {!lgrToEdit && (
        <Column p="Large">
          {nick() ? (
            <>
              <Header h1>LGR Upload</Header>
              <Text>
                Upload an lgr here. Once uploaded, an lgr{' '}
                <b>cannot be renamed and cannot be deleted!</b>
              </Text>
              <Text>
                Your lgr will be automatically fancyboosted after being
                uploaded. Fancyboosting your lgr makes all 256 palette colors
                available as images to level designers.
              </Text>
              <Header h3>Tags:</Header>
              {tagDescriptions.map(({ label, description }) => (
                <Text>
                  <Chip
                    label={label}
                    key={label}
                    color="primary"
                    style={{ margin: 4 }}
                  />
                  {description}
                </Text>
              ))}
              <Dropzone filetype={'.lgr'} onDrop={e => onDropLGR(e)} />
            </>
          ) : (
            <>
              <Header h1>LGR Upload</Header>
              <Text>Please sign in to upload an lgr.</Text>
            </>
          )}
        </Column>
      )}
      <Alert {...alert} onClose={closeAlert} />
      <UploadButtonContainer container>
        <Grid item xs={12}>
          {(lgrData.file || lgrToEdit) && (
            <>
              <UploadCard>
                <CardContent>
                  {!modPrivileges ? (
                    <Typography color="primary">
                      {lgrData.filename}.lgr
                    </Typography>
                  ) : (
                    <TextField
                      fullWidth
                      id="Filename"
                      label="Change Filename (use with caution - mod-exclusive feature)"
                      value={lgrData.filename}
                      onChange={handleString('filename')}
                      margin="dense"
                    />
                  )}
                  {modPrivileges && (
                    <TextField
                      fullWidth
                      id="KuskiName"
                      label="Change LGR Ownership (use with caution - mod-exclusive feature)"
                      value={lgrData.kuskiName}
                      onChange={handleString('kuskiName')}
                      margin="dense"
                    />
                  )}
                  <TextField
                    fullWidth
                    id="Description"
                    multiline
                    label="Description"
                    value={lgrData.description}
                    onChange={handleString('description')}
                    margin="dense"
                  />
                </CardContent>
                <CardContent>
                  <Typography color="primary">Tags</Typography>
                  {tagOptions.filter(tagFilter).map(tag => {
                    if (lgrData.tags.includes(tag.TagIndex)) {
                      return (
                        <Chip
                          label={tag.Name}
                          key={tag.TagIndex}
                          onDelete={() => handleTag(tag.TagIndex)}
                          color="primary"
                          style={{ margin: 4 }}
                        />
                      );
                    } else {
                      return (
                        <Chip
                          label={tag.Name}
                          key={tag.TagIndex}
                          onClick={() => handleTag(tag.TagIndex)}
                          style={{ margin: 4 }}
                        />
                      );
                    }
                  })}
                </CardContent>
                <CardContent>
                  <TextField
                    fullWidth
                    id="Replay"
                    label="Replay UUID"
                    error={replayInvalid}
                    helperText={replayInvalid && 'Replay not found'}
                    value={lgrData.replayUuid}
                    onChange={handleString('replayUuid')}
                    margin="dense"
                  />
                  {replayValid && (
                    <Typography>
                      <Link to={replayLink} target="_blank">
                        {replayLink}
                      </Link>
                      {replay.DrivenByData &&
                        ` by ${replay.DrivenByData.Kuski}`}
                      {replay.LevelData && ` in ${replay.LevelData.LevelName}`}
                    </Typography>
                  )}
                </CardContent>
                <CardContent>
                  <Typography color="primary">
                    Upload a preview image{' '}
                    {lgrToEdit && 'if you want to replace the old one'} (max 10
                    MB)
                  </Typography>
                  <Dropzone filetype={'img'} onDrop={e => onDropPreview(e)} />
                </CardContent>
                {preview && <CardPreview src={preview}></CardPreview>}
              </UploadCard>
              <Button
                onClick={uploadOrEdit}
                disabled={isUploading}
                style={{ float: 'right' }}
                variant="contained"
                color="primary"
              >
                {lgrToEdit ? 'Edit' : 'Upload'}
              </Button>
              <Button
                onClick={reset}
                style={{ float: 'right', marginRight: '8px' }}
                variant="contained"
              >
                Cancel
              </Button>
            </>
          )}
        </Grid>
      </UploadButtonContainer>
    </>
  );
};

const UploadButtonContainer = styled(Grid)`
  margin-top: 8px;
`;
const UploadCard = styled(Card)`
  margin-top: 8px;
  margin-bottom: 8px;
`;
const CardPreview = styled.img`
  background-size: contain;
  height: 160px;
`;

export default LGRUpload;
