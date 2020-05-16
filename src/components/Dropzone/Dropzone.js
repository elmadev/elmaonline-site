import React from 'react';
import ReactDropzone from 'react-dropzone';
import styled from 'styled-components';
import { nickId } from 'utils/nick';

const Dropzone = props => {
  const { error, success, filetype, onDrop, login } = props;
  return (
    <ReactDropzone
      accept={filetype}
      onDrop={e => onDrop(e)}
      multiple={false}
      style={{
        width: '100%',
        height: 'auto',
        minHeight: '100px',
        border: '2px dashed black',
      }}
    >
      {(!login || nickId() !== 0) && (
        <DropText>
          Drop replay file here, or click to select file to upload
        </DropText>
      )}
      {error && <ErrorText>{error}</ErrorText>}
      {success && <SuccessText>{success}</SuccessText>}
      {login && nickId() === 0 && (
        <LoginText>Please log in to upload</LoginText>
      )}
    </ReactDropzone>
  );
};

const DropText = styled.div`
  padding: 8px;
`;

const ErrorText = styled.div`
  padding: 8px;
  color: red;
`;

const SuccessText = styled.div`
  padding: 8px;
  color: green;
`;

const LoginText = styled.div`
  padding: 8px;
`;

export default Dropzone;
