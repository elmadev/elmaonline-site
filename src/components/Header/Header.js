import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Header = props => {
  const { h1, h2, h3, children, nomargin, right, top, onClick } = props;
  return (
    <>
      {h1 && !h2 && !h3 && (
        <Container1
          link={onClick}
          onClick={() => onClick && onClick()}
          right={right}
          top={top}
          nomargin={nomargin}
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
        >
          {children}
        </Container3>
      )}
    </>
  );
};

const Container1 = styled.h1`
  margin: ${p => (p.nomargin ? '0' : '10px')};
  margin-left: 0;
  margin-bottom: 16px;
  margin-top: ${p => (p.top ? '16px' : '0')};
  color: ${p => (p.link ? '#219653' : '#1b3a57')};
  cursor: ${p => (p.link ? 'pointer' : 'auto')};
  font-weight: 600;
  font-size: 36px;
  text-transform: none;
  letter-spacing: 0.5px;
  text-align: ${p => (p.right ? 'right' : 'left')};
`;

const Container2 = styled.h2`
  margin: ${p => (p.nomargin ? '0' : '10px')};
  margin-left: 0;
  margin-bottom: 8px;
  margin-top: ${p => (p.top ? '16px' : '0')};
  color: ${p => (p.link ? '#219653' : '#1b3a57')};
  cursor: ${p => (p.link ? 'pointer' : 'auto')};
  font-weight: 600;
  font-size: 22px;
  text-transform: none;
  letter-spacing: 0.5px;
  text-align: ${p => (p.right ? 'right' : 'left')};
`;

const Container3 = styled.h3`
  margin: ${p => (p.nomargin ? '0' : '10px')};
  margin-left: 0;
  margin-bottom: 0px;
  margin-top: ${p => (p.top ? '16px' : '0')};
  color: ${p => (p.link ? '#219653' : '#1b3a57')};
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
};

Header.defaultProps = {
  h1: true,
  h2: false,
  h3: false,
  children: null,
  nomargin: false,
  top: false,
  onClick: null,
};

export default Header;
