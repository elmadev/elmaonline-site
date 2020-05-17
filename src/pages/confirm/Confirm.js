import React, { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Login from 'components/Login';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

const Confirm = props => {
  const { confirmCode } = props;
  const { confirmSuccess, password } = useStoreState(state => state.Register);
  const { tryConfirm, tryReset } = useStoreActions(actions => actions.Register);

  useEffect(() => {
    if (confirmCode.substring(0, 3) === 'rez') {
      tryReset({ confirmCode });
    } else {
      tryConfirm({ confirmCode });
    }
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
              Email confirmation has failed. Either you are already confirmed
              (check your play rights), or you have mistyped the confirm url
              (check the link in the email), or there were a server error, try
              reloading the page.
            </Paper>
          )}
          {confirmSuccess === 2 && (
            <Paper>
              Your email has been confirmed. You can now login using the form on
              the right. Your new password is: {password}
            </Paper>
          )}
          {confirmSuccess === -2 && (
            <Paper>
              Email confirmation has failed. Either or you have mistyped the
              confirm url (check the link in the email), or there were a server
              error, try reloading the page.
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
