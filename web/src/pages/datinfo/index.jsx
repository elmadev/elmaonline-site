import React, { useState, useEffect } from 'react';
import { Text, Column } from 'components/Containers';
import { Button, Grid } from '@material-ui/core';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Dropzone from 'components/Dropzone';
import styled from '@emotion/styled';
import Layout from 'components/Layout';
import Time from 'components/Time';

import Header from 'components/Header';

const DatInfo = () => {
  const { setError, getDatInfo } = useStoreActions(actions => actions.DatInfo);

  const { datInfo, error } = useStoreState(state => state.DatInfo);

  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDatInfo, setUploadedDatInfo] = useState([]);
  const [levId, setLevId] = useState();

  useEffect(() => {
    if (datInfo && datInfo.datInfo) {
      setUploadedDatInfo([...uploadedDatInfo, datInfo.datInfo]);
    }
  }, [datInfo]);

  const onDrop = newFiles => {
    setFiles(newFiles);
    setUploadedDatInfo([]);
  };

  const upload = () => {
    setIsUploading(true);

    files.forEach(file => {
      const data = new FormData();
      data.append('file', file);
      data.append('filename', file.name);
      data.append('levelid', levId);
      getDatInfo(data);
    });

    setIsUploading(false);
  };

  return (
    <Layout>
      <Column p="Large">
        <Header h1>Get dat info</Header>
        <Text>Get the information from an okesl dat file.</Text>
        <input
          type="text"
          value={levId}
          onChange={e => {
            setLevId(e.target.value);
          }}
          placeholder="Level id"
        />
        <div className="dropzone">
          <Dropzone
            login
            filetype=".dat"
            error={error}
            onDrop={e => onDrop(e)}
          />
        </div>
      </Column>
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
                  // setDuplicate(false);
                  // setDuplicateReplayIndex(0);
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
      {uploadedDatInfo &&
        uploadedDatInfo.map(datInfo => (
          <Column p="Large">
            <Text>Level name: {datInfo.lev_fname}</Text>
            <Text>Finished: {datInfo.finished ? 'Yes' : 'No'}</Text>
            <Text>
              Time: <Time thousands time={datInfo.time} />
            </Text>

            <Text>Average fps: {datInfo.fps_avg}</Text>
            <Text>Changed fps: {datInfo.ft_range > 1 ? 'Yes' : 'No'}</Text>

            <Text>
              Time of strongest bug: <Time thousands time={datInfo.bug_time} />
            </Text>
            <Text>Strongest bug factor: {datInfo.bug_factor}</Text>
          </Column>
        ))}
    </Layout>
  );
};

const UploadButtonContainer = styled(Grid)`
  margin-top: 8px;
`;

export default DatInfo;
