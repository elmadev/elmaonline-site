import React, { useState, useEffect } from 'react';
import { forEach } from 'lodash';
import { format } from 'date-fns';
import Link from 'components/Link';
import styled from '@emotion/styled';
import { Grid, Checkbox, Button, TextField } from '@material-ui/core';
import Header from 'components/Header';
import DerpTable from 'components/Table/DerpTable';
import { calculateStandings, pts } from 'utils/cups';
import CupResults from 'components/CupResults';
import Dropzone from 'components/Dropzone';
import Time from 'components/Time';
import Kuski from 'components/Kuski';
import CupCurrent from 'components/CupCurrent';
import { Paper, Content } from 'components/Paper';
import { ListRow, ListCell } from 'components/List';
import config from 'config';
import { authToken } from 'utils/nick';
import { Text } from 'components/Containers';

const Dashboard = props => {
  const { events, cup } = props;
  const [standings, setStandings] = useState({});
  const [lastEvent, setLastEvent] = useState(-1);

  useEffect(() => {
    setStandings(calculateStandings(events, cup, true));
    let lastEndTime = 0;
    forEach(events, (e, i) => {
      if (e.EndTime < format(new Date(), 't')) {
        if (e.EndTime >= lastEndTime && e.Updated && e.ShowResults) {
          setLastEvent(i);
          lastEndTime = e.EndTime;
        }
      }
    });
  }, [events]);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper padding>
            <Header h2>Current Event</Header>
            <CupCurrent events={events} ShortName={cup.ShortName} />
          </Paper>
          <CupUpload top />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper>
            <Content>
              <Header h2>
                <Link
                  to={`/cup/${cup.ShortName}/events/${lastEvent + 1}/results`}
                >
                  Last Event
                </Link>
              </Header>
            </Content>
            {events[lastEvent] && (
              <CupResults
                CupIndex={events[lastEvent].CupIndex}
                cup={cup}
                eventNo={lastEvent + 1}
                results={events[lastEvent].CupTimes.slice(0, 5)}
              />
            )}
          </Paper>
          <Paper top>
            <Content>
              <Header h2>
                <Link to={`/cup/${cup.ShortName}/standings`}>Standings</Link>
              </Header>
            </Content>
            {standings.player && (
              <DerpTable
                headers={['#', 'Player', { t: 'Points', r: true, w: 'auto' }]}
                length={standings.player.length}
              >
                {standings.player.slice(0, 5).map((r, no) => (
                  <ListRow key={r.KuskiIndex}>
                    <ListCell>{no + 1}.</ListCell>
                    <ListCell>
                      <Kuski kuskiData={r.KuskiData} team flag />
                    </ListCell>
                    <ListCell right>{pts(r.Points)}</ListCell>
                  </ListRow>
                ))}
              </DerpTable>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export const CupUpload = ({ onUpload, top = false }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [warning, setWarning] = useState('');
  const [share, setShare] = useState(true);
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);

  const onDrop = e => {
    setFile(e[0]);
  };

  const cancel = () => {
    setFile(null);
  };

  const reset = () => {
    setError('');
    setSuccess('');
    setWarning('');
  };

  const upload = () => {
    reset();
    const body = new FormData();
    body.append('file', file);
    body.append('filename', file.name);
    body.append('share', share);
    body.append('comment', comment);
    fetch(`${config.url}upload/cupreplay`, {
      method: 'POST',
      body,
      headers: {
        Authorization: authToken(),
      },
    }).then(response => {
      response.json().then(json => {
        if (json.error) {
          setError(json.error);
        } else {
          if (json.Finished) {
            setSuccess(
              <>
                Replay uploaded, time: <Time time={json.Time} />
              </>,
            );
          } else {
            setSuccess(<>Replay uploaded, apples: {json.Apples}</>);
          }
          if (json.Match === -1 && json.Finished) {
            setWarning(<>Your time was not verified and will not count</>);
          }
          if (onUpload) {
            onUpload();
          }
        }
        setFile(null);
        setComment('');
      });
    });
  };

  return (
    <Paper padding top={top}>
      <Header h2>Upload</Header>
      <Text>
        Cup replays are saved automatically, so you won't need to upload your
        replay. In rare cases automatic saving of recs may fail and you can
        upload the replay after the fact here. You can also use this to share
        replays with team.
      </Text>
      <DropContainer>
        <Dropzone
          filetype=".rec"
          error={error}
          success={success}
          warning={warning}
          onDrop={e => onDrop(e)}
          login
        />
        {file && (
          <Paper highlight style={{ marginTop: '8px' }}>
            <UploadInput>
              {file.name}
              <Checkbox
                color="primary"
                checked={share}
                onChange={() => setShare(!share)}
              />
              Share replay with team
            </UploadInput>
            <UploadInput>
              <TextField
                id="Comment"
                label="Comment"
                margin="normal"
                fullWidth
                type="text"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </UploadInput>
            <Buttons>
              <Button
                onClick={() => {
                  cancel();
                }}
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  upload();
                }}
                style={{
                  marginLeft: '8px',
                }}
                variant="contained"
                color="primary"
              >
                Upload
              </Button>
            </Buttons>
          </Paper>
        )}
      </DropContainer>
    </Paper>
  );
};

const Buttons = styled.div`
  margin: 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const UploadInput = styled.div`
  flex-direction: row;
  display: flex;
  padding-right: 8px;
  padding-left: 8px;
  align-items: center;
`;

const DropContainer = styled.div`
  padding-right: 8px;
`;

const Container = styled.div`
  padding-left: 8px;
  padding-right: 8px;
`;

export default Dashboard;
