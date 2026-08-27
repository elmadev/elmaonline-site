import React from 'react';
import styled from '@emotion/styled';
import { InputBase } from '@material-ui/core';
import Link from 'components/Link';
import Loading from 'components/Loading';
import Feedback from 'components/Feedback';

export const ListContainer = ({
  className,
  children,
  chin,
  horizontalMargin,
  width,
  flex,
  direction = 'row',
  loading = false,
  error = '',
}) => {
  return (
    <Container
      className={className}
      chin={chin}
      horizontalMargin={horizontalMargin}
      width={width}
      flex={flex}
      direction={direction}
    >
      {loading ? <Loading /> : <>{children}</>}
      {error && (
        <Feedback
          open={error !== ''}
          text={error}
          type="error"
          close={() => {}}
        />
      )}
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
  ${p =>
    p.flex &&
    `display: flex;
    flex-direction: column;
    ${Row} {
      display: flex;
      flex-direction: row;
    }
    ${Header} {
      display: flex;
      flex-direction: row;
    }
    ${Cell} {
      display: flex;
      flex-direction: ${p.direction};
    }
  `};
`;

export const ListRow = ({
  className,
  children,
  selected,
  onClick,
  bg = 'transparent',
  title = '',
  highlight = false,
  onHover,
  verticalAlign = 'baseline',
}) => {
  return (
    <Row
      className={className}
      pointer={onClick}
      selected={selected}
      bg={bg}
      onClick={e => onClick && onClick(e)}
      title={title}
      highlight={highlight}
      onMouseEnter={() => onHover && onHover(true)}
      onMouseLeave={() => onHover && onHover(false)}
      verticalAlign={verticalAlign}
    >
      {children}
    </Row>
  );
};

const Row = styled.div`
  display: table-row;
  position: relative;
  vertical-align: ${p => p.verticalAlign};
  background: ${p =>
    p.selected
      ? p.theme.selectedColor
      : p.highlight
        ? p.theme.highlightColor
        : p.bg};
  cursor: ${p => (p.pointer ? 'pointer' : 'auto')};
  :hover {
    background: ${p => p.theme.hoverColor};
  }
`;

export const ListHeader = ({ className, children }) => {
  return <Header className={className}>{children}</Header>;
};

const Header = styled.div`
  display: table-row;
  color: inherit;
  font-size: 14px;
  font-weight: 600;
`;

export const ListCell = ({
  className,
  width,
  children,
  right,
  highlight,
  to,
  whiteSpace,
  onClick,
  title,
  verticalAlign = 'baseline',
  textAlign = 'left',
  cutText,
  minWidth,
}) => {
  if (to) {
    return (
      <Cell
        className={className}
        whiteSpace={whiteSpace}
        width={width}
        right={right}
        highlight={highlight}
        to={to}
        verticalAlign={verticalAlign}
        textAlign={textAlign}
        cutText={cutText}
        minWidth={minWidth}
        title={title ? title : typeof children === 'string' ? children : ''}
      >
        <CellLink to={to}>{children}</CellLink>
      </Cell>
    );
  }
  return (
    <Cell
      className={className}
      whiteSpace={whiteSpace}
      width={width}
      right={right}
      highlight={highlight}
      onClick={() => onClick && onClick()}
      pointer={onClick}
      verticalAlign={verticalAlign}
      textAlign={textAlign}
      cutText={cutText}
      minWidth={minWidth}
      title={title ? title : typeof children === 'string' ? children : ''}
    >
      {children}
    </Cell>
  );
};

const CellLink = styled(Link)`
  padding: 10px;
  display: block;
  color: ${p => p.theme.fontColor};
`;

const Cell = styled.span`
  color: ${p => p.theme.fontColor};
  display: table-cell;
  padding: ${p => (p.to ? 0 : '10px')};
  border-bottom: 1px solid #eaeaea;
  width: ${p => (p.width ? `${p.width}px` : 'auto')};
  text-align: ${p => (p.right ? 'right' : p.textAlign)};
  background: ${p => (p.highlight ? p.theme.highlightColor : 'transparent')};
  position: relative;
  white-space: ${p => (p.whiteSpace ? p.whiteSpace : 'normal')};
  flex: ${p => (p.width ? 'none' : '1')};
  justify-content: ${p => (p.right ? 'flex-end' : 'flex-start')};
  vertical-align: ${p => p.verticalAlign};
  ${p => p.cutText && 'white-space: nowrap; overflow: hidden;'}
  ${p => p.pointer && 'cursor: pointer;'}
  ${p => p.minWidth && `min-width: ${p.minWidth}px;`}
  button {
    max-height: 20px;
  }
`;

export const ListInput = ({
  label,
  value,
  onChange,
  date,
  maxLength,
  onEnter,
  width,
  title = label,
}) => {
  return (
    <ListCell width={width}>
      <Input
        type={date ? 'date' : 'text'}
        placeholder={label}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        inputProps={{ maxLength }}
        title={title}
        onKeyUp={e => {
          if (e.key === 'Enter') {
            if (onEnter) {
              onEnter(e.target.value);
            }
          }
          if (e.key === 'Escape' && onChange) {
            onChange('');
            onEnter('');
          }
        }}
      />
    </ListCell>
  );
};

const Input = styled(InputBase)`
  && {
    input {
      padding: 0;
    }
  }
`;
