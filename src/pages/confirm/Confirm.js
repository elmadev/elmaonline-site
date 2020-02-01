import React, { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Login from 'components/Login';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

const Confirm = props => {
  const { confirmCode } = props;
  const { confirmSuccess } = useStoreState(state => state.Register);
  const { tryConfirm } = useStoreActions(actions => actions.Register);

  useEffect(() => {
    tryConfirm({ confirmCode });
  }, []);

  return (
    <Container>
      <Grid container spacing={24}>
        <Grid item xs={12} md={8}>
          {confirmSuccess === 1 && (
            <Paper>
              Your email has been confirmed. You can now login using the form on
              the right.
            </Paper>
          )}
          {confirmSuccess === 0 && (
            <Paper>
              <CircularProgress />
            </Paper>
          )}
          {confirmSuccess === -1 && (
            <Paper>
              Email confirmation has failed. Either you are already confirmed,
              check your play rights. Or you have mistyped the confirm url,
              check the link in the email. Or there were a server error, try
              reloading the page.
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Login />
        </Grid>
      </Grid>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
`;

export default Confirm;
