import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { useStoreActions } from 'easy-peasy';
import { format } from 'date-fns';
import Button from 'components/Buttons';
import { nick } from 'utils/nick';

const AddComment = ({ type, index, add }) => {
  const [text, setText] = useState('');
  const addReplayComment = useStoreActions(
    actions => actions.ReplayComments.addComment,
  );
  const addLGRComment = useStoreActions(
    actions => actions.LGRComments.addComment,
  );

  const addText = () => {
    if (add) {
      add(text);
    }
    setText('');
    if (type === 'replay') {
      addReplayComment({
        ReplayIndex: index,
        Entered: format(new Date(), 't'),
        Text: text,
      });
    }
    if (type === 'lgr') {
      addLGRComment({
        LGRIndex: index,
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
        <Button secondary onClick={() => setText('')} right>
          Reset
        </Button>
        <Button onClick={() => addText()}>Add</Button>
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
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default AddComment;
