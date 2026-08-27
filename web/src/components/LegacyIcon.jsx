import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import moposite from '../images/legacy/moposite.png';
import kopasite from '../images/legacy/kopasite.png';
import skintatious from '../images/legacy/skintatious.png';
import zebrasite from '../images/legacy/zebrasite.png';
import zebrasite_unverified from '../images/legacy/zebrasite_unverified.png';
import stats from '../images/legacy/stats.png';

const icons = {
  1: moposite,
  2: kopasite,
  3: skintatious,
  4: zebrasite,
  5: zebrasite_unverified,
  6: stats,
};

const alts = {
  1: 'Moposite',
  2: 'Kopasite',
  3: 'skintatious',
  4: 'zebra site',
  5: 'zebra site (unverified)',
  6: 'stats',
};

const titles = {
  1: 'Legacy time from Moposite',
  2: 'Legacy time from Kopasite',
  3: 'Legacy time from skintatious',
  4: 'Legacy time from zebra site',
  5: 'Legacy time from zebra site (unverified)',
  6: 'Legacy time from stats',
};

const LegacyIcon = ({ source, show = true }) => {
  if (!show) return <span />;
  return (
    <Container>
      <img src={icons[source]} alt={alts[source]} title={titles[source]} />
    </Container>
  );
};

const Container = styled.span`
  text-align: right;
`;

LegacyIcon.propTypes = {
  source: PropTypes.number.isRequired,
  show: PropTypes.bool,
};

export default LegacyIcon;
