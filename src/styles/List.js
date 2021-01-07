import React from 'react';
import styled from 'styled-components';

export const ListCell = ({ width, children, right }) => {
  return (
    <Cell width={width} right={right}>
      {children}
    </Cell>
  );
};

const Cell = styled.span`
  display: table-cell;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
  width: ${p => (p.width ? `${p.width}px` : 'auto')};
  text-align: ${p => (p.right ? 'right' : 'left')};
  button {
    max-height: 20px;
  }
`;

export const ListContainer = ({ children, chin, horizontalMargin, width }) => {
  return (
    <Container chin={chin} horizontalMargin={horizontalMargin} width={width}>
      {children}
    </Container>
  );
};

const Container = styled.div`
  padding-bottom: ${p => (p.chin ? '200px' : '0px')};
  display: table;
  width: ${p => (p.width ? p.width : '100%')};
  font-size: 14px;
  margin-left: ${p => (p.horizontalMargin ? p.horizontalMargin : '0')};
  margin-right: ${p => (p.horizontalMargin ? p.horizontalMargin : '0')};
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

export const ListRow = ({
  children,
  selected,
  onClick,
  bg = 'transparent',
  title = '',
}) => {
  return (
    <Row
      pointer={onClick}
      selected={selected}
      bg={bg}
      onClick={e => onClick && onClick(e)}
      title={title}
    >
      {children}
    </Row>
  );
};

const Row = styled.div`
  display: table-row;
  background: ${p => (p.selected ? '#f5f5f5' : p.bg)};
  cursor: ${p => (p.pointer ? 'pointer' : 'auto')};
  :hover {
    background: #ededed;
  }
`;
