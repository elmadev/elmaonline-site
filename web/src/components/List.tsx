import styled from '@emotion/styled';
import { InputBase } from '@mui/material';
import Link from 'components/Link';
import Loading from 'components/Loading';
import Feedback from 'components/Feedback';

type ListContainerProps = {
  className?: string;
  children?: React.ReactNode;
  chin?: boolean;
  horizontalMargin?: string;
  width?: string;
  flex?: boolean;
  direction?: 'row' | 'column';
  loading?: boolean;
  error?: string;
};

export const ListContainer = ({
  className,
  children,
  chin = false,
  horizontalMargin,
  width,
  flex = false,
  direction = 'row',
  loading = false,
  error = '',
}: ListContainerProps) => {
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

type ListRowProps = {
  className?: string;
  children?: React.ReactNode;
  selected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  bg?: string;
  title?: string;
  highlight?: boolean;
  onHover?: (hovering: boolean) => void;
  verticalAlign?: string;
};

export const ListRow = ({
  className,
  children,
  selected = false,
  onClick,
  bg = 'transparent',
  title = '',
  highlight = false,
  onHover,
  verticalAlign = 'baseline',
}: ListRowProps) => {
  return (
    <Row
      className={className}
      pointer={Boolean(onClick)}
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

const Row = styled.div<{
  pointer: boolean;
  selected: boolean;
  bg: string;
  highlight: boolean;
  verticalAlign: string;
}>`
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

type ListHeaderProps = {
  className?: string;
  children?: React.ReactNode;
};

export const ListHeader = ({ className, children }: ListHeaderProps) => {
  return <Header className={className}>{children}</Header>;
};

const Header = styled.div`
  display: table-row;
  color: inherit;
  font-size: 14px;
  font-weight: 600;
`;

type ListCellProps = {
  className?: string;
  width?: number | null;
  children?: React.ReactNode;
  right?: boolean;
  highlight?: boolean;
  to?: string;
  whiteSpace?: string;
  onClick?: () => void;
  title?: string;
  verticalAlign?: string;
  textAlign?: string;
  cutText?: boolean;
  minWidth?: number;
};

export const ListCell = ({
  className,
  width,
  children,
  right = false,
  highlight = false,
  to,
  whiteSpace,
  onClick,
  title,
  verticalAlign = 'baseline',
  textAlign = 'left',
  cutText = false,
  minWidth,
}: ListCellProps) => {
  const cellTitle = title
    ? title
    : typeof children === 'string'
      ? children
      : '';
  if (to) {
    return (
      <Cell
        className={className}
        whiteSpace={whiteSpace}
        width={width}
        right={right}
        highlight={highlight}
        isLink
        pointer={false}
        verticalAlign={verticalAlign}
        textAlign={textAlign}
        cutText={cutText}
        minWidth={minWidth}
        title={cellTitle}
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
      isLink={false}
      onClick={() => onClick && onClick()}
      pointer={Boolean(onClick)}
      verticalAlign={verticalAlign}
      textAlign={textAlign}
      cutText={cutText}
      minWidth={minWidth}
      title={cellTitle}
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

const Cell = styled.span<{
  width?: number | null;
  right: boolean;
  highlight: boolean;
  isLink: boolean;
  pointer: boolean;
  whiteSpace?: string;
  verticalAlign: string;
  textAlign: string;
  cutText: boolean;
  minWidth?: number;
}>`
  color: ${p => p.theme.fontColor};
  display: table-cell;
  padding: ${p => (p.isLink ? 0 : '10px')};
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

const Container = styled.div<{
  chin: boolean;
  horizontalMargin?: string;
  width?: string;
  flex: boolean;
  direction: string;
}>`
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

type ListInputProps = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  date?: boolean;
  maxLength?: number;
  onEnter?: (value: string) => void;
  width?: number;
  title?: string;
};

export const ListInput = ({
  label,
  value,
  onChange,
  date = false,
  maxLength,
  onEnter,
  width,
  title = label,
}: ListInputProps) => {
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
              onEnter(value);
            }
          }
          if (e.key === 'Escape' && onChange) {
            onChange('');
            if (onEnter) {
              onEnter('');
            }
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
