import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';

const ClickToEdit = props => {
  const { children, value, update } = props;
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setEditMode(false);
        if (inputValue !== value) {
          update(inputValue);
        }
      }}
    >
      {!editMode ? (
        <Clickable
          role="button"
          tabIndex={0}
          onKeyPress={() => setEditMode(true)}
          onClick={() => setEditMode(true)}
        >
          {children}
        </Clickable>
      ) : (
        <TextField
          margin="none"
          variant="outlined"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
      )}
    </OutsideClickHandler>
  );
};

const Clickable = styled.span`
  cursor: pointer;
`;

export default ClickToEdit;
