import React from 'react';
import PropTypes from 'prop-types';

import Flag from 'components/Flag';

const Kuski = ({ kuskiData, team, flag }) => (
  <span>
    {flag &&
      kuskiData.Country && (
        <span>
          <Flag nationality={kuskiData.Country} />{' '}
        </span>
      )}
    {kuskiData.Kuski && kuskiData.Kuski}
    {team && kuskiData.TeamData && ` [${kuskiData.TeamData.Team}]`}
  </span>
);

Kuski.defaultProps = {
  team: false,
  flag: false,
};

Kuski.propTypes = {
  kuskiData: PropTypes.shape({}).isRequired,
  team: PropTypes.bool,
  flag: PropTypes.bool,
};

export default Kuski;
