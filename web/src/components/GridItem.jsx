import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Link from 'components/Link';

const GridItem = ({
  className,
  name = '',
  longname = '',
  afterName,
  afterLongname,
  to = '',
  children = null,
  promote = false,
}) => {
  const inner = (
    <>
      <Name>
        {name}
        {afterName && <AfterName>{afterName}</AfterName>}
      </Name>
      <LongName>{longname}</LongName>
      {afterLongname && afterLongname}
    </>
  );

  return (
    <Container className={className} promote={promote}>
      {to ? <Link to={to}>{inner}</Link> : <>{inner}</>}
      {children}
    </Container>
  );
};

const Name = styled.div`
  font-weight: 500;
  color: ${p => p.theme.linkColor};
`;

const AfterName = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${p => p.theme.headerColor};
`;

const LongName = styled.div`
  font-size: 13px;
`;

const Container = styled.div`
  float: left;
  width: ${p => (p.promote ? '40%' : '20%')};
  height: ${p => (p.promote ? '200px' : '100px')};
  padding-left: 1px;
  padding-top: 1px;
  box-sizing: border-box;
  position: relative;
  > a {
    display: block;
    background: ${p => p.theme.paperBackground};
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    color: inherit;
    overflow: hidden;
    position: relative;
    :hover {
      background: ${p => p.theme.hoverColor};
    }
  }
  @media (max-width: 1350px) {
    width: ${p => (p.promote ? '50%' : '25%')};
  }
  @media (max-width: 1160px) {
    width: calc(100% / 3);
  }
  @media (max-width: 730px) {
    width: 50%;
  }
  @media (max-width: 480px) {
    width: 100%;
    height: unset;
  }
`;

GridItem.propTypes = {
  name: PropTypes.string,
  longname: PropTypes.string,
  to: PropTypes.string,
  children: PropTypes.node,
  promote: PropTypes.bool,
};

export default GridItem;
