import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Grid, TextField, Button } from '@material-ui/core';
import { Paper } from 'components/Paper';
import { ListRow, ListCell, ListHeader } from 'components/List';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Kuski from 'components/Kuski';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';

const ErrorLog = () => {
  const { errorLog } = useStoreState(state => state.Mod);
  const { getErrorLog } = useStoreActions(actions => actions.Mod);
  const [kuski, setKuski] = useState('');
  const [fromDate, setFromDate] = useState('');

  useEffect(() => {
    getErrorLog({ Kuski: 0, ErrorTime: 0 });
  }, []);

  const search = () => {
    getErrorLog({
      Kuski: kuski || '0',
      ErrorTime: fromDate || '0',
    });
  };

  return (
    <Container>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={8}>
          <Header h2>Error Log</Header>
          <Paper>
            <ListHeader>
              <ListCell>Kuski</ListCell>
              <ListCell>IP</ListCell>
              <ListCell>Error Text</ListCell>
              <ListCell>Error Time</ListCell>
              <ListCell>Code</ListCell>
            </ListHeader>
            {errorLog.length > 0 &&
              errorLog.map(n => (
                <ListRow key={n.ErrorIndex} title={n.Reason}>
                  <ListCell>
                    <Kuski kuskiData={n.KuskiData} />
                  </ListCell>
                  <ListCell>{n.IP}</ListCell>
                  <ListCell>{n.ErrorText}</ListCell>
                  <ListCell>
                    <LocalTime
                      date={n.ErrorTime}
                      format="d MMM yyyy HH:mm:ss"
                      parse="X"
                    />
                  </ListCell>
                  <ListCell>
                    {n.PreviousMessage} / {n.CurrentMessage}
                  </ListCell>
                </ListRow>
              ))}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Header h2>Search</Header>
          <Paper>
            <TextField
              id="outlined-name"
              label="Kuski"
              value={kuski}
              onChange={e => setKuski(e.target.value)}
              margin="normal"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="outlined-name"
              label="From date (YYYY-MM-DD)"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              margin="normal"
              variant="outlined"
              fullWidth
            />
            <Button
              onClick={() => search()}
              variant="contained"
              color="primary"
            >
              Search
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

export default ErrorLog;
