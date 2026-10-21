import { useState } from 'react';
import { ClickAwayListener, TextField } from '@mui/material';
import styled from '@emotion/styled';

type ClickToEditProps = {
  children: React.ReactNode;
  value: string;
  update: (value: string) => void;
  allowEmpty?: boolean;
};

const ClickToEdit = ({
  children,
  value,
  update,
  allowEmpty = false,
}: ClickToEditProps) => {
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
        <ClickAwayListener onClickAway={() => sendValue()}>
          <div>
            <TextField
              margin="none"
              variant="outlined"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              size="small"
              onKeyDown={e => e.key === 'Enter' && sendValue()}
            />
          </div>
        </ClickAwayListener>
      )}
    </>
  );
};

const Clickable = styled.span`
  cursor: pointer;
`;

export default ClickToEdit;
