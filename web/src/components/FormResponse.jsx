import React from 'react';
import styled from '@emotion/styled';

const FormResponse = ({ msgs, showIfEmpty = false, isError }) => {
  if (!msgs && !showIfEmpty) {
    return null;
  }

  return (
    <Root isError={isError}>
      {msgs.map((msg, index) => (
        <div key={index}>{msg}</div>
      ))}
    </Root>
  );
};

const Root = styled.div`
  border: 1px solid lightGrey;
  padding: 15px;
  > * {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  border-left: ${p => (p.isError ? '4px solid red' : '4px solid green')};
`;

export default FormResponse;
