import React, { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Grid, CircularProgress } from '@material-ui/core';
import { Paper } from 'components/Paper';
import Link from 'components/Link';
import Layout from 'components/Layout';
import { useParams } from '@tanstack/react-router';

const Confirm = () => {
  const { confirmCode } = useParams({ strict: false });
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
    <Layout t="Confirm email">
      <Grid container spacing={3}>
        {confirmSuccess === 1 && (
          <Paper>
            Your email has been confirmed. You can now{' '}
            <Link to="/login">login</Link>.
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
            Your email has been confirmed. You can now
            <Link to="/login">login</Link>. Your new password is: {password}
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
    </Layout>
  );
};

export default Confirm;
