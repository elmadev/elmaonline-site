import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TextField, Button } from '@material-ui/core';
import { useStoreActions } from 'easy-peasy';
import moment from 'moment';
import { nick } from 'utils/nick';

const AddComment = props => {
  const [text, setText] = useState('');
  const { type, index, add } = props;
  const addComment = useStoreActions(
    actions => actions.ReplayComments.addComment,
  );

  const addText = () => {
    add(text);
    setText('');
    if (type === 'replay') {
      addComment({
        ReplayIndex: index,
        Entered: moment().format('X'),
        Text: text,
      });
    }
  };

  if (!nick()) {
    return null;
  }

  return (
    <Container>
      <TextBox>
        <TextField
          id="outlined-name"
          label="Add comment"
          value={text}
          onChange={e => setText(e.target.value)}
          margin="normal"
          variant="outlined"
          fullWidth
        />
      </TextBox>
      <Buttons>
        <Button variant="contained" onClick={() => setText('')}>
          Reset
        </Button>
        <Button variant="contained" color="primary" onClick={() => addText()}>
          Add
        </Button>
      </Buttons>
    </Container>
  );
};

const Container = styled.div`
  max-height: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TextBox = styled.div`
  margin: 8px;
`;

const Buttons = styled.div`
  margin: 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

AddComment.propTypes = {
  type: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default AddComment;
