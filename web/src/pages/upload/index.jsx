import React, { useState, useEffect } from 'react';
import Layout from 'components/Layout';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Dropzone from 'components/Dropzone';
import Button from 'components/Buttons';
import Header from 'components/Header';
import config from 'config';
import { Paper } from 'components/Paper';
import styled from '@emotion/styled';
import Loading from 'components/Loading';
import { Dropdown, TextField } from 'components/Inputs';
import { Row, Text } from 'components/Containers';
import { formatBytes } from 'utils/calcs';
import { nickId } from 'utils/nick';
import { format } from 'date-fns';
import Link from 'components/Link';

const Upload = () => {
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [expire, setExpire] = useState('30 days');
  const [maxDownloads, setMaxDownloads] = useState('');
  const [maxDownloadError, setMaxDownloadError] = useState('');
  const { response, update, uploadedAt } = useStoreState(
    state => state.FileUpload,
  );
  const { uploadFile, updateFile, setUpdate } = useStoreActions(
    actions => actions.FileUpload,
  );

  const dropped = (accepted, rejected) => {
    reset();
    if (rejected.length > 0) {
      if (accepted.length === 1) {
        setError('Only one file allowed at a time');
      } else if (rejected[0].size > config.maxUploadSize) {
        setError('File size too big, max 10mb allowed');
      } else {
        setError('Unknown error occured');
      }
    } else if (accepted.length === 1) {
      uploadtoServer(accepted[0]);
    }
  };

  const uploadtoServer = file => {
    setLoading(true);
    const formData = new FormData();
    formData.append('filename', file.name);
    formData.append('file', file);
    uploadFile(formData);
  };

  useEffect(() => {
    if (response) {
      if (response.error) {
        setError(response.error.message);
        setLoading(false);
      } else if (response.uuid) {
        setLoading(false);
        setUrl(encodeURI(`${config.up}${response.uuid}/${response.file}`));
      }
    }
  }, [response]);

  const copyText = () => {
    navigator.clipboard.writeText(url);
  };

  const updateMaxDownloads = value => {
    if (value === '') {
      setMaxDownloadError('');
      setMaxDownloads('');
    } else {
      const asInt = parseInt(value, 10);
      if (isNaN(asInt)) {
        setMaxDownloadError('Please input only numbers');
      } else {
        setMaxDownloadError('');
        setMaxDownloads(asInt);
      }
    }
  };

  const reset = () => {
    setUrl('');
    setError('');
    setUpdate(false);
    setExpire('30 days');
    setMaxDownloads('');
    setMaxDownloadError('');
  };

  return (
    <Layout t="Upload">
      <Header>Upload</Header>
      <Text>
        If you are looking for replay uploading go{' '}
        <Link to="/replays/upload">here</Link>.
      </Text>
      <Text>
        Upload any file with a unique secret url. Max file size is 10MB. By
        default files are deleted after 30 days and allow inifite downloads. If
        you are logged in you can change expire date and max amount of
        downloads. File will be deleted from server if one of these conditions
        are met.
      </Text>
      <Dropzone
        minHeight="200px"
        filetype=""
        onDrop={(a, r) => dropped(a, r)}
        error={error}
      />
      {loading && (
        <Row center>
          <Loading />
        </Row>
      )}
      {url !== '' && (
        <UrlContainer>
          <Paper padding center width="auto">
            <div>
              Uploaded: {response.file} ({formatBytes(response.size)}) at{' '}
              {format(new Date(uploadedAt), '	HH:mm')}
            </div>
            <div>
              <a href={url}>{url}</a>
            </div>
            <Button margin="6px 0" onClick={() => copyText()}>
              Copy
            </Button>
            {nickId() !== 0 && (
              <Row center>
                <Dropdown
                  name="Expire after"
                  options={['365 days', '30 days', '7 days', '1 day', 'Never']}
                  selected={expire}
                  update={v => {
                    setExpire(v);
                    setUpdate(true);
                  }}
                />
                <TextField
                  name="Max downloads"
                  error={maxDownloadError}
                  value={maxDownloads}
                  onChange={v => {
                    updateMaxDownloads(v);
                    setUpdate(true);
                  }}
                />
                <Button
                  disabled={!update}
                  onClick={() =>
                    updateFile({
                      expire,
                      maxDownloads,
                      Uuid: response.uuid,
                      Filename: response.file,
                    })
                  }
                >
                  Update
                </Button>
              </Row>
            )}
          </Paper>
        </UrlContainer>
      )}
    </Layout>
  );
};

const UrlContainer = styled.div`
  margin-top: 16px;
`;

export default Upload;
