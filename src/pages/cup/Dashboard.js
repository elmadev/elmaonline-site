import React, { useState, useEffect } from 'react';
import { forEach } from 'lodash';
import { format } from 'date-fns';
import styled from 'styled-components';
import { Grid, Checkbox, Button, TextField } from '@material-ui/core';
import Header from 'components/Header';
import DerpTable from 'components/Table/DerpTable';
import { calculateStandings } from 'utils/cups';
import CupResults from 'components/CupResults';
import Dropzone from 'components/Dropzone';
import Time from 'components/Time';
import Kuski from 'components/Kuski';
import CupCurrent from 'components/CupCurrent';
import { Paper } from 'styles/Paper';
import { ListRow, ListCell } from 'styles/List';

const Dashboard = props => {
  const { events, openEvent, openStandings, cup } = props;
  const [standings, setStandings] = useState({});
  const [lastEvent, setLastEvent] = useState(-1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [share, setShare] = useState(true);
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);

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

  const onDrop = e => {
    setFile(e[0]);
  };

  const cancel = () => {
    setFile(null);
  };

  const upload = () => {
    const body = new FormData();
    body.append('file', file);
    body.append('filename', file.name);
    body.append('share', share);
    body.append('comment', comment);
    fetch('/upload/cupreplay', {
      method: 'POST',
      body,
    }).then(response => {
      response.json().then(json => {
        if (json.error) {
          setError(json.error);
        } else if (json.Finished) {
          setSuccess(
            <>
              Replay uploaded, time: <Time time={json.Time} />
            </>,
          );
        } else {
          setSuccess(<>Replay uploaded, apples: {json.Apples}</>);
        }
        setFile(null);
        setComment('');
      });
    });
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Header h2>Upload</Header>
          <DropContainer>
            <Dropzone
              filetype=".rec"
              error={error}
              success={success}
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
          <Header h2 top>
            Current Event
          </Header>
          <CupCurrent events={events} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Header h2 onClick={() => openEvent(lastEvent)}>
            Last Event
          </Header>
          {events[lastEvent] && (
            <CupResults
              CupIndex={events[lastEvent].CupIndex}
              ShortName={cup.ShortName}
              eventNo={lastEvent + 1}
              results={events[lastEvent].CupTimes.slice(0, 5)}
            />
          )}
          <Header h2 onClick={() => openStandings()}>
            Standings
          </Header>
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
                  <ListCell right>
                    {r.Points} point{r.Points > 1 ? 's' : ''}
                  </ListCell>
                </ListRow>
              ))}
            </DerpTable>
          )}
        </Grid>
      </Grid>
    </Container>
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
