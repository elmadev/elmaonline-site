import React from 'react';
import styled from '@emotion/styled';
import { TextField, Button } from '@material-ui/core';
import { Paper } from 'components/Paper';
import Header from 'components/Header';

const Setting = ({
  value,
  label,
  setValue,
  update,
  password,
  header,
  maxLength,
}) => {
  return (
    <Container>
      <Paper padding>
        {header && <Header h2>{header}</Header>}
        {label.map((l, i) => (
          <TextField
            type={password ? 'password' : 'text'}
            key={l}
            id="outlined-name"
            label={l}
            value={value[i]}
            onChange={e => setValue(e.target.value, i)}
            margin="normal"
            variant="outlined"
            fullWidth
            inputProps={{ maxLength }}
          />
        ))}
        {update && (
          <Buttons>
            <Button
              variant="contained"
              color="primary"
              onClick={() => update()}
            >
              Update
            </Button>
          </Buttons>
        )}
      </Paper>
    </Container>
  );
};

const Container = styled.div`
  padding-bottom: 20px;
`;

const Buttons = styled.div`
  margin: 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export default Setting;
