import { useState } from 'react';
import styled from '@emotion/styled';
import { ClickAwayListener } from '@mui/material';

type ClickToRevealProps = {
  children: React.ReactNode;
  value: React.ReactNode;
  outsideClick?: boolean;
};

const ClickToReveal = ({
  children,
  value,
  outsideClick = false,
}: ClickToRevealProps) => {
  const [editMode, setEditMode] = useState(false);
  return (
    <ClickAwayListener
      onClickAway={() => {
        if (outsideClick) {
          setEditMode(false);
        }
      }}
    >
      <div>
        {!editMode ? (
          <Clickable
            role="button"
            tabIndex={0}
            onKeyPress={() => setEditMode(true)}
            onClick={() => setEditMode(true)}
          >
            {value}
          </Clickable>
        ) : (
          <>{children}</>
        )}
      </div>
    </ClickAwayListener>
  );
};

const Clickable = styled.span`
  cursor: pointer;
`;

export default ClickToReveal;
