import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  TextField,
  FormControl,
  Select,
  OutlinedInput,
  InputLabel,
  Button,
} from '@material-ui/core';
import { useStoreActions, useStoreState } from 'easy-peasy';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = props => {
  const { close } = props;
  const [kuski, setKuski] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [team, setTeam] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [captcha, setCaptcha] = useState('');
  const { countries, registerMessage, registerSuccess } = useStoreState(
    state => state.Register,
  );
  const { getCountries, register } = useStoreActions(
    actions => actions.Register,
  );

  const isWindow = typeof window !== 'undefined';

  useEffect(() => {
    if (countries.length === 0) {
      getCountries();
    }
  }, []);

  const validateEmail = e => {
    const re = /\S+@\S+\.\S+/;
    return re.test(e);
  };

  const clickRegister = () => {
    setError('');
    if (!kuski && !password && !repeatPassword && !email && !country) {
      setError('Mandatory field is missing.');
    } else if (password !== repeatPassword) {
      setError('Passwords does not match.');
    } else if (!validateEmail(email)) {
      setError('Invalid email adresse.');
    } else if (captcha === '') {
      setError('ReCAPTCHA not completed.');
    } else {
      register({
        Kuski: kuski,
        Password: password,
        Team: team,
        Email: email,
        Country: country,
      });
    }
  };

  const onEnter = e => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      clickRegister();
    }
  };

  return (
    <Container>
      {registerSuccess ? (
        <SuccessMessage>
          You have successfully registered. Check your email and click the
          confirmation link to continue.
        </SuccessMessage>
      ) : (
        <>
          <TextBox>
            <TextField
              id="kuski"
              label="Kuski *"
              value={kuski}
              onChange={e => setKuski(e.target.value)}
              margin="normal"
              fullWidth
              onKeyPress={e => onEnter(e)}
              variant="outlined"
            />
          </TextBox>
          <TextBox>
            <TextField
              id="password"
              label="Password *"
              type="password"
              autoComplete="current-password"
              margin="normal"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              onKeyPress={e => onEnter(e)}
              variant="outlined"
            />
          </TextBox>
          <TextBox>
            <TextField
              id="repeat-password"
              label="Repeat password *"
              type="password"
              autoComplete="current-password"
              margin="normal"
              value={repeatPassword}
              onChange={e => setRepeatPassword(e.target.value)}
              fullWidth
              onKeyPress={e => onEnter(e)}
              variant="outlined"
            />
          </TextBox>
          <TextBox>
            <TextField
              id="tean"
              label="Team"
              margin="normal"
              value={team}
              onChange={e => setTeam(e.target.value)}
              fullWidth
              onKeyPress={e => onEnter(e)}
              variant="outlined"
            />
          </TextBox>
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
          <TextBox>
            <FormControl
              style={{ width: '100%', marginTop: '16px', marginBottom: '8px' }}
              variant="outlined"
            >
              <InputLabel htmlFor="country">Country *</InputLabel>
              <Select
                native
                value={country}
                onChange={e => setCountry(e.target.value)}
                input={
                  <OutlinedInput labelWidth={0} name="country" id="country" />
                }
              >
                <option value=""> </option>
                {countries.map(c => (
                  <option value={c.Iso}>{c.Name}</option>
                ))}
              </Select>
            </FormControl>
          </TextBox>
          <TextBox>
            {isWindow && (
              <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                <ReCAPTCHA
                  sitekey={window.App.recaptcha}
                  onChange={result => setCaptcha(result)}
                />
              </div>
            )}
          </TextBox>
          <ButtonsContainer>
            {error !== '' && <ErrorMessage>{error}</ErrorMessage>}
            {registerMessage !== '' && (
              <ErrorMessage>{registerMessage}</ErrorMessage>
            )}
            <Button onClick={() => close && close()}>Login</Button>
            <Button
              onClick={() => clickRegister()}
              variant="contained"
              color="primary"
            >
              Register
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

Register.propTypes = {
  close: PropTypes.func.isRequired,
};

export default Register;
