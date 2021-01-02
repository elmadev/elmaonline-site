import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField, Button, Container, Box } from '@material-ui/core';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Link from 'components/Link';

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
    if (e.key === 'Enter' || e.keyCode === 13) {
      clickReset();
    }
  };

  return (
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
          <Box py={2}>
            <Button onClick={() => clickReset()} variant="contained" fullWidth>
              Reset password
            </Button>
          </Box>
          <Box py={2}>
            <Link to="/login">Back to login view</Link>
          </Box>
        </>
      )}
    </Container>
  );
};

const ErrorMessage = styled.div`
  line-height: 36px;
  padding-right: 8px;
  color: red;
`;

const SuccessMessage = styled.div`
  color: green;
`;

export default ForgotPassword;
