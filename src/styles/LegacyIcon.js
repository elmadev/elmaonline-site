import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moposite from '../images/legacy/moposite.png';
import kopasite from '../images/legacy/kopasite.png';
import skintatious from '../images/legacy/skintatious.png';
import stats from '../images/legacy/stats.png';

const icons = {
  1: moposite,
  2: kopasite,
  3: skintatious,
  4: stats,
};

const alts = {
  1: 'Moposite',
  2: 'Kopasite',
  3: 'skintatious',
  4: 'stats',
};

const titles = {
  1: 'Legacy time from Moposite',
  2: 'Legacy time from Kopasite',
  3: 'Legacy time from skintatious',
  4: 'Legacy time from stats',
};

const LegacyIcon = ({ source, show }) => {
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

LegacyIcon.defaultProps = {
  show: true,
};

export default LegacyIcon;
