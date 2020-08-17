import React from 'react';
import styled from 'styled-components';

export const ListCell = ({ width, children }) => {
  return <Cell width={width}>{children}</Cell>;
};

const Cell = styled.span`
  display: table-cell;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
  width: ${p => (p.width ? `${p.width}px` : 'auto')};
`;

export const ListContainer = ({ children, chin }) => {
  return <Container chin={chin}>{children}</Container>;
};

const Container = styled.div`
  padding-bottom: ${p => (p.chin ? '200px' : '0px')};
  display: table;
  width: 100%;
  font-size: 14px;
`;

export const ListHeader = ({ children }) => {
  return <Header>{children}</Header>;
};

const Header = styled.div`
  display: table-row;
  color: inherit;
  font-size: 14px;
  padding: 10px;
  font-weight: 600;
`;
