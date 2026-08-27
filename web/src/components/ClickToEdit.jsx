import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import styled from '@emotion/styled';
import OutsideClickHandler from 'react-outside-click-handler';

const ClickToEdit = props => {
  const { children, value, update, allowEmpty } = props;
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const sendValue = () => {
    setEditMode(false);
    if (inputValue !== value && (inputValue !== '' || allowEmpty)) {
      update(inputValue);
    }
  };

  return (
    <>
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
        <OutsideClickHandler onOutsideClick={() => sendValue()}>
          <TextField
            margin="none"
            variant="outlined"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            size="small"
            onKeyDown={e => e.key === 'Enter' && sendValue()}
          />
        </OutsideClickHandler>
      )}
    </>
  );
};

const Clickable = styled.span`
  cursor: pointer;
`;

export default ClickToEdit;
