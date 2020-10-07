import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import Flag from 'components/Flag';

const Kuski = ({ kuskiData, team, flag, noLink }) => (
  <>
    {kuskiData ? (
      <span>
        {flag && kuskiData.Country && (
          <span>
            <Flag nationality={kuskiData.Country} />{' '}
          </span>
        )}
        {noLink ? (
          <span>{kuskiData.Kuski && kuskiData.Kuski}</span>
        ) : (
          <Link to={`/kuskis/${kuskiData.Kuski}`}>
            {kuskiData.Kuski && kuskiData.Kuski}
          </Link>
        )}
        {team && kuskiData.TeamData && (
          <>
            {' '}
            {noLink ? (
              <span>[{kuskiData.TeamData.Team}]</span>
            ) : (
              <Link to={`/team/${kuskiData.TeamData.Team}`}>
                [{kuskiData.TeamData.Team}]
              </Link>
            )}
          </>
        )}
      </span>
    ) : (
      <span>Unknown</span>
    )}
  </>
);

Kuski.defaultProps = {
  team: false,
  flag: false,
  kuskiData: null,
  noLink: false,
};

Kuski.propTypes = {
  kuskiData: PropTypes.shape({}),
  team: PropTypes.bool,
  flag: PropTypes.bool,
  noLink: PropTypes.bool,
};

export default Kuski;
