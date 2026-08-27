import React, { useState } from 'react';
import styled from '@emotion/styled';
import { TextField, Button, Container } from '@material-ui/core';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Link from 'components/Link';
import Layout from 'components/Layout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { resetMessage, resetSuccess } = useStoreState(state => state.Register);
  const { resetPassword } = useStoreActions(actions => actions.Register);

  const validateEmail = e => {
    const re = /\S+@\S+\.\S+/;
    return re.test(e);
  };

  const clickReset = () => {
    setError('');
    if (!validateEmail(email)) {
      setError('Invalid email adresse.');
    } else {
      resetPassword({
        Email: email,
      });
    }
  };

  const onEnter = e => {
    if (e.key === 'Enter') {
      clickReset();
    }
  };

  return (
    <Layout t="Forgot Password">
      <Container maxWidth="sm">
        {resetSuccess ? (
          <SuccessMessage>
            Password reset request has been sent successfully. Check your email
            and click the confirmation link to continue.
          </SuccessMessage>
        ) : (
          <>
            <TextField
              id="email"
              label="Email *"
              margin="normal"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              onKeyPress={e => onEnter(e)}
              variant="outlined"
            />
            {error !== '' && <ErrorMessage>{error}</ErrorMessage>}
            {resetMessage !== '' && <ErrorMessage>{resetMessage}</ErrorMessage>}
            <PadY>
              <Button
                onClick={() => clickReset()}
                variant="contained"
                fullWidth
              >
                Reset password
              </Button>
            </PadY>
            <PadY>
              <Link to="/login">Back to login view</Link>
            </PadY>
          </>
        )}
      </Container>
    </Layout>
  );
};

const PadY = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
`;

const ErrorMessage = styled.div`
  line-height: 36px;
  padding-right: 8px;
  color: red;
`;

const SuccessMessage = styled.div`
  color: green;
`;

export default ForgotPassword;
