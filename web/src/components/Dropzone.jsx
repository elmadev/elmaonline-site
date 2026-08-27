import React from 'react';
import { useDropzone } from 'react-dropzone';
import styled from '@emotion/styled';
import config from 'config';
import { nickId } from 'utils/nick';

const types = {
  // Even though */* gives a warning on Firefox and Chrome,
  // do not change to avoid issues with selecting files for certain users
  '.rec': { '*/*': ['.rec'] },
  '.dat': { '*/*': ['.dat'] },
  '.lgr': { '*/*': ['.lgr'] },
  img: { 'image/*': ['.png', '.gif', '.webp', '.jpg', '.apng', '.svg'] },
};

const Dropzone = ({
  error,
  success,
  filetype,
  onDrop,
  login,
  warning,
  minHeight = '100px',
  maxSize,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: filetype ? types[filetype] : undefined,
    multiple: false,
    maxSize: maxSize ? maxSize : config.maxUploadSize,
  });
  return (
    <Container
      {...getRootProps()}
      isDragActive={isDragActive}
      minHeight={minHeight}
    >
      <input {...getInputProps()} />
      {(!login || nickId() !== 0) && (
        <>
          {isDragActive ? <DropText>Drop to upload</DropText> : null}
          {!isDragActive ? (
            <DropText>
              Drop file here, or click to select file to upload
            </DropText>
          ) : null}
        </>
      )}
      {error && <ErrorText>{error}</ErrorText>}
      {success && <SuccessText>{success}</SuccessText>}
      {warning && <WarningText>{warning}</WarningText>}
      {login && nickId() === 0 && <DropText>Please log in to upload</DropText>}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: auto;
  min-height: ${p => p.minHeight};
  border: 2px dashed ${p => p.theme.borderColor};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${p =>
    p.isDragActive ? p.theme.pageBackgroundDark : p.theme.paperBackground};
  color: ${p => p.theme.fontColor};
`;

const DropText = styled.div`
  padding: 8px;
  opacity: 0.7;
`;

const ErrorText = styled.div`
  padding: 8px;
  color: red;
  opacity: 0.7;
`;

const WarningText = styled.div`
  padding: 8px;
  color: #ff8000;
  opacity: 0.7;
`;

const SuccessText = styled.div`
  padding: 8px;
  color: green;
  opacity: 0.7;
`;

export default Dropzone;
