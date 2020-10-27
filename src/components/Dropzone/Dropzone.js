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
        border: '2px dashed rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {(!login || nickId() !== 0) && (
        <DropText>
          Drop replay file here, or click to select file to upload
        </DropText>
      )}
      {error && <ErrorText>{error}</ErrorText>}
      {success && <SuccessText>{success}</SuccessText>}
      {login && nickId() === 0 && <DropText>Please log in to upload</DropText>}
    </ReactDropzone>
  );
};

const DropText = styled.div`
  padding: 8px;
  opacity: 0.7;
`;

const ErrorText = styled.div`
  padding: 8px;
  color: red;
  opacity: 0.7;
`;

const SuccessText = styled.div`
  padding: 8px;
  color: green;
  opacity: 0.7;
`;

export default Dropzone;
