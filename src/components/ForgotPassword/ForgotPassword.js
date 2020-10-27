import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TextField, Button } from '@material-ui/core';
import { useStoreActions, useStoreState } from 'easy-peasy';

const ForgotPassword = props => {
  const { close } = props;
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
    <Container>
      {resetSuccess ? (
        <SuccessMessage>
          Password reset request has been sent successfully. Check your email
          and click the confirmation link to continue.
        </SuccessMessage>
      ) : (
        <>
          <TextBox>
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
          </TextBox>
          <ButtonsContainer>
            {error !== '' && <ErrorMessage>{error}</ErrorMessage>}
            {resetMessage !== '' && <ErrorMessage>{resetMessage}</ErrorMessage>}
            <Button onClick={() => close && close()}>Login</Button>
            <Button
              onClick={() => clickReset()}
              variant="contained"
              color="primary"
            >
              Reset password
            </Button>
          </ButtonsContainer>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin: 0 auto;
  padding: 20px;
  max-width: var(--max-content-width);
`;

const TextBox = styled.div`
  margin-left: 4px;
  margin-right: 4px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ErrorMessage = styled.div`
  line-height: 36px;
  padding-right: 8px;
  color: red;
`;

const SuccessMessage = styled.div`
  color: green;
`;

ForgotPassword.propTypes = {
  close: PropTypes.func.isRequired,
};

export default ForgotPassword;
