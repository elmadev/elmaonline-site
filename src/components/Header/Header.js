import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Header = props => {
  const { h1, h2, h3, children, nomargin, right } = props;
  return (
    <>
      {h1 && !h2 && !h3 && (
        <Container1 right={right} nomargin={nomargin}>
          {children}
        </Container1>
      )}
      {h2 && (
        <Container2 right={right} nomargin={nomargin}>
          {children}
        </Container2>
      )}
      {h3 && (
        <Container3 right={right} nomargin={nomargin}>
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
  color: #1b3a57;
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
  color: #1b3a57;
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
  color: #1b3a57;
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
  children: PropTypes.node.isRequired,
  nomargin: PropTypes.bool,
};

Header.defaultProps = {
  h1: true,
  h2: false,
  h3: false,
  nomargin: false,
};

export default Header;
