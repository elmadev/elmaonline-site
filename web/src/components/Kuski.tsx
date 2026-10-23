import styled from '@emotion/styled';
import Link from 'components/Link';
import Flag from 'components/Flag';
import type { KuskiData } from 'contract/kuski.ts';

type KuskiProps = {
  kuskiData?: KuskiData | null;
  team?: boolean;
  flag?: boolean;
  noLink?: boolean;
  logo?: boolean;
  customUrl?: string | null;
};

const Kuski = ({
  kuskiData = null,
  team = false,
  flag = false,
  noLink = false,
  logo = false,
  customUrl = null,
}: KuskiProps) => (
  <>
    {kuskiData ? (
      <Container flex={Boolean(logo && kuskiData?.TeamData?.Logo)}>
        {flag && kuskiData.Country && (
          <span>
            <Flag nationality={kuskiData.Country} />{' '}
          </span>
        )}
        {noLink ? (
          <span>{kuskiData.Kuski && kuskiData.Kuski}</span>
        ) : (
          <Link to={customUrl || `/kuskis/${kuskiData.Kuski}`}>
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

const Container = styled.span<{ flex?: boolean }>`
  white-space: nowrap;
  ${p =>
    p.flex
      ? `display: flex; align-items: center; gap: ${p.theme.padXXSmall}`
      : ''}
`;

export default Kuski;
