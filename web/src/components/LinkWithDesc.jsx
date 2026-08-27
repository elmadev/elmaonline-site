import React from 'react';
import styled from '@emotion/styled';
import Link from 'components/Link';
import LocalTime from 'components/LocalTime';
import { Divider as MuiDivider } from '@material-ui/core';

const TimeRange = ({ start, end }) => {
  if (!start) {
    return null;
  }

  return (
    <Range>
      <LocalTime date={start} format="d MMM yyyy" parse="X" /> -{' '}
      {end && <LocalTime date={end} format="d MMM yyyy" parse="X" />}
    </Range>
  );
};

const LinkWithDesc = ({ link, name, desc, start, end, divider }) => {
  return (
    <>
      <Link to={link}>
        <CupName>{name}</CupName>
      </Link>
      <TimeRange start={start} end={end} />
      <Description
        dangerouslySetInnerHTML={{ __html: desc }}
        paddingBottom={!divider}
      />
      {divider && <Divider />}
    </>
  );
};

const Divider = styled(MuiDivider)`
  margin-top: 12px;
  margin-bottom: 12px;
`;

const Range = styled.div`
  font-size: 12px;
  padding-bottom: 4px;
`;

const CupName = styled.div`
  font-weight: 500;
  color: ${p => p.theme.linkColor};
`;

const Description = styled.div`
  font-size: 13px;
  padding-bottom: ${props => props.paddingBottom && '12px'};
`;

export default LinkWithDesc;
