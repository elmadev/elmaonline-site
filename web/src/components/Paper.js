import styled from '@emotion/styled';

export const Paper = styled.div`
  display: flex;
  flex-direction: ${p => (p.row ? 'row' : 'column')};
  width: ${p =>
    p.width
      ? p.width
      : p.padding
        ? `calc(100% - ${p.theme.padMedium} * 2)`
        : '100%'};
  background-color: ${p =>
    p.highlight ? p.theme.ongoing : p.theme.paperBackground};
  border: 1px solid
    ${p => (p.highlight ? 'rgba(0,0,0,0.2)' : p.theme.borderColor)};
  border-radius: 4px;
  ${p => p.padding && `padding: ${p.theme.padMedium};`}
  ${p => p.center && 'justify-content: center; align-items: center;'}
  ${p => p.grow && `flex: ${p.grow};`}
  ${p => p.top && `margin-top: ${p.theme.padXSmall};`}
  box-shadow: ${p =>
    p.highlight
      ? '0px 1px 5px 0px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 3px 1px -2px rgba(0,0,0,0.12)'
      : 'none'};
`;

export const Content = styled.div`
  margin: ${p => p.theme.padMedium};
  display: flex;
  flex-direction: column;
  ${p => p.center && 'justify-content: center; align-items: center;'}
`;
