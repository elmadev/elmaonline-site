import React from 'react';
import styled from 'styled-components';
import { TextField, Button } from '@material-ui/core';
import { Paper } from 'styles/Paper';

const Setting = ({ value, label, setValue, update, password }) => {
  return (
    <Container>
      <Paper>
        <PaperCon>
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
        </PaperCon>
      </Paper>
    </Container>
  );
};

const Container = styled.div`
  padding-bottom: 20px;
`;

const PaperCon = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
`;

const Buttons = styled.div`
  margin: 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export default Setting;
