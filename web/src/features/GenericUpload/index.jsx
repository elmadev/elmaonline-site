import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Dropzone from 'components/Dropzone';
import config from 'config';
import Loading from 'components/Loading';
import { Row } from 'components/Containers';

const GenericUpload = ({ maxUploadSize, onUploaded, filetype }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { response } = useStoreState(state => state.GenericUpload);
  const { uploadFile, setUpdate } = useStoreActions(
    actions => actions.GenericUpload,
  );

  const dropped = (accepted, rejected) => {
    reset();
    if (rejected.length > 0) {
      if (accepted.length === 1) {
        setError('Only one file allowed at a time');
      } else if (
        rejected[0].size > maxUploadSize ? maxUploadSize : config.maxUploadSize
      ) {
        setError(
          `File size too big, max ${maxUploadSize ? maxUploadSize / 1000000 : config.maxUploadSize / 1000000}mb allowed`,
        );
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
        onUploaded(encodeURI(`${config.up}${response.uuid}/${response.file}`));
      }
    }
  }, [response]);

  const reset = () => {
    setError('');
    setUpdate(false);
  };

  return (
    <>
      <Dropzone
        minHeight="200px"
        filetype={filetype}
        onDrop={(a, r) => dropped(a, r)}
        error={error}
        maxSize={maxUploadSize}
      />
      {loading && (
        <Row center>
          <Loading />
        </Row>
      )}
    </>
  );
};

export default GenericUpload;
