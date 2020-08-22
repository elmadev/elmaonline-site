import React, { useState, useEffect } from 'react';
import { forEach } from 'lodash';
import { format } from 'date-fns';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DerpTable from 'components/Table/DerpTable';
import DerpTableCell from 'components/Table/DerpTableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import { calculateStandings } from 'utils/cups';
import CupResults from 'components/CupResults';
import Dropzone from 'components/Dropzone';
import Time from 'components/Time';
import CupCurrent from 'components/CupCurrent';

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
        } else if (json.finished) {
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
      <Grid container spacing={16}>
        <Grid item xs={12} sm={12}>
          <Description dangerouslySetInnerHTML={{ __html: cup.Description }} />
        </Grid>
      </Grid>
      <Grid container spacing={16}>
        <Grid item xs={12} sm={6}>
          <Headline>Upload</Headline>
          <DropContainer>
            <Dropzone
              filetype=".rec"
              error={error}
              success={success}
              onDrop={e => onDrop(e)}
              login
            />
            {file && (
              <>
                <Paper style={{ marginTop: '8px' }}>
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
                </Paper>
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
              </>
            )}
          </DropContainer>
          <Headline>Current Event</Headline>
          <CupCurrent events={events} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Headline link onClick={() => openEvent(lastEvent)}>
            Last Event
          </Headline>
          {events[lastEvent] && (
            <CupResults
              ShortName={cup.ShortName}
              eventNo={lastEvent + 1}
              results={events[lastEvent].CupTimes.slice(0, 5)}
            />
          )}
          <Headline link onClick={() => openStandings()}>
            Standings
          </Headline>
          {standings.player && (
            <DerpTable
              headers={['#', 'Player', 'Points']}
              length={standings.player.length}
            >
              {standings.player.slice(0, 5).map((r, no) => (
                <TableRow hover key={r.KuskiIndex}>
                  <DerpTableCell>{no + 1}.</DerpTableCell>
                  <DerpTableCell>{r.Kuski}</DerpTableCell>
                  <DerpTableCell right>
                    {r.Points} point{r.Points > 1 ? 's' : ''}
                  </DerpTableCell>
                </TableRow>
              ))}
            </DerpTable>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

const Buttons = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
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

const Description = styled.div`
  padding-bottom: 12px;
`;

const Headline = styled.div`
  font-weight: bold;
  padding: 8px;
  color: ${props => (props.link ? '#219653' : 'auto')};
  cursor: ${props => (props.link ? 'pointer' : 'auto')};
`;

export default Dashboard;
