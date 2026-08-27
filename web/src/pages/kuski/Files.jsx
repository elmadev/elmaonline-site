import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Backdrop, Button as MuiButton } from '@material-ui/core';
import Button from 'components/Buttons';
import { Dropdown, TextField } from 'components/Inputs';
import { Edit, HighlightOffOutlined as CloseIcon } from '@material-ui/icons';
import Fab from 'components/Fab';
import { Row } from 'components/Containers';
import LocalTime from 'components/LocalTime';
import { formatDistanceStrict } from 'date-fns';
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

const expireValues = ['365 days', '30 days', '7 days', '1 day', 'Never'];

const FileList = ({ collapse }) => {
  const [hover, setHover] = useState(0);
  const [selectedFile, openFile] = useState(null);
  const [expire, setExpire] = useState('30 days');
  const [update, setUpdate] = useState(false);
  const [maxDownloads, setMaxDownloads] = useState('');
  const [maxDownloadError, setMaxDownloadError] = useState('');
  const {
    files: { data, loading, error },
    fileSearch,
  } = useStoreState(state => state.Kuski);
  const {
    files: { fetch },
    setFileSearch,
    deleteFile,
  } = useStoreActions(actions => actions.Kuski);
  const { updateFile } = useStoreActions(actions => actions.FileUpload);
  const windowSize = useElementSize();
  const listHeight = windowSize.height - 375 + (collapse ? 100 : 0);
  useEffect(() => {
    fetch({ limit: 100, search: fileSearch });
  }, []);

  const copyText = url => {
    navigator.clipboard.writeText(url);
  };

  const selectFile = f => {
    openFile(f);
    if (!f.Expire) {
      setExpire('Never');
    } else {
      const values = [365, 30, 7, 1];
      const expireTime = (f.Expire - f.UploadedOn) / 86400;
      const closest = values.reduce((prev, curr) => {
        return Math.abs(curr - expireTime) < Math.abs(prev - expireTime)
          ? curr
          : prev;
      });
      setExpire(expireValues[values.indexOf(closest)]);
    }
    setMaxDownloads(f.Downloads);
    setUpdate(false);
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

  return (
    <>
      <ListContainer loading={loading} error={error}>
        <ListHeader>
          <ListCell width={200}>Filename</ListCell>
          <ListCell width={150}>Expires</ListCell>
          <ListCell width={150}>Uploaded on</ListCell>
          <ListCell width={50} />
          <ListCell width={100}>Max downloads</ListCell>
          <ListCell width={100}>Downloaded</ListCell>
          <ListCell>Edit</ListCell>
        </ListHeader>
        <ListRow>
          <ListInput
            width={200}
            label="Search filename"
            value={fileSearch.filename}
            onChange={value => setFileSearch({ field: 'filename', value })}
            onEnter={filename =>
              fetch({ limit: 100, search: { ...fileSearch, filename } })
            }
          />
          <ListCell />
          <ListInput
            width={100}
            label="Uploaded on or after"
            date
            value={fileSearch.from}
            onChange={value => {
              setFileSearch({ field: 'from', value });
              fetch({
                limit: 100,
                search: { ...fileSearch, from: value },
              });
            }}
          />
          <ListInput
            width={100}
            label="Uploaded on or before"
            date
            value={fileSearch.to}
            onChange={value => {
              setFileSearch({ field: 'to', value });
              fetch({
                limit: 100,
                search: { ...fileSearch, to: value },
              });
            }}
          />
          <ListCell />
          <ListCell />
          <ListCell />
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
              const file = data[index];
              return (
                <div style={style} key={file.UploadIndex}>
                  <ListRow
                    onHover={hovering => {
                      if (hovering) {
                        setHover(file.UploadIndex);
                      } else {
                        setHover(0);
                      }
                    }}
                  >
                    <ListCell
                      to={`${config.up}${file.Uuid}/${file.Filename}`}
                      cutText
                      width={200}
                    >
                      {file.Filename}
                    </ListCell>
                    <ListCell width={150}>
                      {file.Expire
                        ? formatDistanceStrict(file.Expire * 1000, new Date(), {
                            addSuffix: true,
                          })
                        : 'Never'}
                    </ListCell>
                    <ListCell width={295}>
                      <LocalTime
                        date={file.UploadedOn}
                        format="eee d MMM yyyy HH:mm:ss"
                        parse="X"
                      />
                    </ListCell>
                    <ListCell right width={100}>
                      {file.Downloads === 0 ? '' : file.Downloads}
                    </ListCell>
                    <ListCell right width={100}>
                      {file.Downloaded}
                    </ListCell>
                    <ListCell>
                      {hover === file.UploadIndex && (
                        <MuiButton
                          title="Edit"
                          onClick={() => {
                            selectFile(file);
                          }}
                        >
                          <Edit />
                        </MuiButton>
                      )}
                    </ListCell>
                  </ListRow>
                </div>
              );
            }}
          </List>
          <Fab url="/up" />
        </ListContainer>
      )}
      {selectedFile && (
        <Backdrop open={true} style={{ zIndex: 100 }}>
          <Container>
            <Row jc="space-between">
              <div>
                <a
                  href={`${config.up}${selectedFile.Uuid}/${selectedFile.Filename}`}
                >
                  {selectedFile.Filename}
                </a>
              </div>
              <Close onClick={() => openFile(null)} />
            </Row>
            <Button
              margin="6px 0"
              onClick={() =>
                copyText(
                  `${config.up}${selectedFile.Uuid}/${selectedFile.Filename}`,
                )
              }
            >
              Copy
            </Button>
            <Row center>
              <Dropdown
                name="Expire after"
                options={expireValues}
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
                onClick={() => {
                  updateFile({
                    expire,
                    maxDownloads,
                    Uuid: selectedFile.Uuid,
                    Filename: selectedFile.Filename,
                  });
                  setUpdate(false);
                }}
              >
                Update
              </Button>
              <Button
                onClick={() => {
                  deleteFile({
                    uuid: selectedFile.Uuid,
                    filename: selectedFile.Filename,
                    limit: 100,
                    search: fileSearch,
                    index: selectedFile.UploadIndex,
                  });
                  openFile(null);
                }}
              >
                Delete
              </Button>
            </Row>
          </Container>
        </Backdrop>
      )}
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

const Container = styled.div`
  background: ${p => p.theme.paperBackground};
  width: 50%;
  @media (max-width: 730px) {
    width: 100%;
  }
  padding: ${p => p.theme.padMedium};
`;

export default FileList;
