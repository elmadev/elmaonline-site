import React from 'react';
import PropTypes from 'prop-types';

import Flag from 'components/Flag';

const Kuski = ({ kuskiData, team, flag }) => (
  <>
    {kuskiData ? (
      <span>
        {flag && kuskiData.Country && (
          <span>
            <Flag nationality={kuskiData.Country} />{' '}
          </span>
        )}
        {kuskiData.Kuski && kuskiData.Kuski}
        {team && kuskiData.TeamData && ` [${kuskiData.TeamData.Team}]`}
      </span>
    ) : (
      <span>Unkonwn</span>
    )}
  </>
);

Kuski.defaultProps = {
  team: false,
  flag: false,
  kuskiData: null,
};

Kuski.propTypes = {
  kuskiData: PropTypes.shape({}),
  team: PropTypes.bool,
  flag: PropTypes.bool,
};

export default Kuski;
