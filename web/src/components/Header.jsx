import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const Header = ({
  h1 = true,
  h2 = false,
  h3 = false,
  children = null,
  nomargin = false,
  right = false,
  top = false,
  onClick = null,
  mLeft = false,
}) => {
  return (
    <>
      {h1 && !h2 && !h3 && (
        <Container1
          link={onClick}
          onClick={() => onClick && onClick()}
          right={right}
          top={top}
          nomargin={nomargin}
          mLeft={mLeft}
        >
          {children}
        </Container1>
      )}
      {h2 && (
        <Container2
          link={onClick}
          onClick={() => onClick && onClick()}
          right={right}
          top={top}
          nomargin={nomargin}
          mLeft={mLeft}
        >
          {children}
        </Container2>
      )}
      {h3 && (
        <Container3
          link={onClick}
          onClick={() => onClick && onClick()}
          right={right}
          top={top}
          nomargin={nomargin}
          mLeft={mLeft}
        >
          {children}
        </Container3>
      )}
    </>
  );
};

const Container1 = styled.h1`
  margin: ${p => (p.nomargin ? '0' : p.theme.padSmall)};
  margin-left: ${p => (p.mLeft ? p.theme.padSmall : 0)};
  margin-bottom: ${p => p.theme.padMedium};
  margin-top: ${p => (p.top ? p.theme.padMedium : '0')};
  color: ${p => (p.link ? p.theme.linkColor : p.theme.headerColor)};
  cursor: ${p => (p.link ? 'pointer' : 'auto')};
  font-weight: 600;
  font-size: 36px;
  text-transform: none;
  letter-spacing: 0.5px;
  text-align: ${p => (p.right ? 'right' : 'left')};
`;

const Container2 = styled.h2`
  margin: ${p => (p.nomargin ? '0' : p.theme.padSmall)};
  margin-left: ${p => (p.mLeft ? p.theme.padSmall : 0)};
  margin-bottom: ${p => p.theme.padSmall};
  margin-top: ${p => (p.top ? p.theme.padMedium : '0')};
  color: ${p => (p.link ? p.theme.linkColor : p.theme.headerColor)};
  cursor: ${p => (p.link ? 'pointer' : 'auto')};
  font-weight: 600;
  font-size: 22px;
  text-transform: none;
  letter-spacing: 0.5px;
  text-align: ${p => (p.right ? 'right' : 'left')};
`;

const Container3 = styled.h3`
  margin: ${p => (p.nomargin ? '0' : p.theme.padSmall)};
  margin-left: ${p => (p.mLeft ? p.theme.padSmall : 0)};
  margin-bottom: 0px;
  margin-top: ${p => (p.top ? p.theme.padMedium : '0')};
  color: ${p => (p.link ? p.theme.linkColor : p.theme.headerColor)};
  cursor: ${p => (p.link ? 'pointer' : 'auto')};
  font-weight: 600;
  font-size: 1em;
  text-transform: none;
  letter-spacing: 0.5px;
  text-align: ${p => (p.right ? 'right' : 'left')};
`;

Header.propTypes = {
  h1: PropTypes.bool,
  h2: PropTypes.bool,
  h3: PropTypes.bool,
  children: PropTypes.node,
  nomargin: PropTypes.bool,
  top: PropTypes.bool,
  onClick: PropTypes.func,
  right: PropTypes.bool,
  mLeft: PropTypes.bool,
};

export default Header;
