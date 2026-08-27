import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from 'components/Link';
import Flag from 'components/Flag';

const Kuski = ({
  kuskiData = null,
  team = false,
  flag = false,
  noLink = false,
  logo = false,
}) => (
  <>
    {kuskiData ? (
      <Container flex={logo && kuskiData?.TeamData?.Logo}>
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
        {(team || logo) &&
          kuskiData?.TeamData?.Team &&
          (!logo || !kuskiData?.TeamData?.Logo) && (
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
        {logo && kuskiData?.TeamData?.Logo ? (
          <>
            {noLink ? (
              <LogoImg
                src={kuskiData?.TeamData?.Logo}
                alt={kuskiData.TeamData.Team}
              />
            ) : (
              <Link to={`/team/${kuskiData.TeamData.Team}`}>
                <LogoImg
                  src={kuskiData?.TeamData?.Logo}
                  alt={kuskiData.TeamData.Team}
                />
              </Link>
            )}
          </>
        ) : null}
      </Container>
    ) : (
      <Container>Unknown</Container>
    )}
  </>
);

const LogoImg = styled.img`
  height: 20px;
  max-width: 40px;
  object-fit: contain;
`;

const Container = styled.span`
  white-space: nowrap;
  ${p =>
    p.flex
      ? `display: flex; align-items: center; gap: ${p.theme.padXXSmall}`
      : ''}
`;

Kuski.propTypes = {
  kuskiData: PropTypes.shape({}),
  team: PropTypes.bool,
  flag: PropTypes.bool,
  noLink: PropTypes.bool,
};

export default Kuski;
