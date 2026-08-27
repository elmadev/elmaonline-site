import React, { useState } from 'react';
import styled from '@emotion/styled';
import OutsideClickHandler from 'react-outside-click-handler';

const ClickToReveal = ({ children, value, outsideClick }) => {
  const [editMode, setEditMode] = useState(false);
  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        if (outsideClick) {
          setEditMode(false);
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
          {value}
        </Clickable>
      ) : (
        <>{children}</>
      )}
    </OutsideClickHandler>
  );
};

const Clickable = styled.span`
  cursor: pointer;
`;

export default ClickToReveal;
