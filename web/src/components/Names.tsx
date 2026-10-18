import styled from '@emotion/styled';
import Link from 'components/Link';

type LevelName = {
  LevelName: string;
  LongName?: string;
};

const formatLevel = (level: string) => {
  if (
    level.substring(0, 6).toUpperCase() === 'QWQUU0' &&
    parseInt(level.substring(6, 8), 10) <= 55
  ) {
    return `Internal ${level.substring(6, 8)}`;
  }
  return level;
};

type LevelNameFormattedProps = {
  long: boolean;
  LevelData?: LevelName | null;
};

const LevelNameFormatted = ({ long, LevelData }: LevelNameFormattedProps) => {
  return (
    <>
      {long && LevelData && LevelData.LongName}
      {!long && LevelData && formatLevel(LevelData.LevelName)}
      {!LevelData && 'Unknown'}
    </>
  );
};

type LevelProps = {
  LevelIndex?: number | null;
  long?: boolean;
  LevelData?: LevelName | null;
  noLink?: boolean;
};

const Level = ({
  LevelIndex = null,
  long = false,
  LevelData = null,
  noLink = false,
}: LevelProps) => {
  return (
    <>
      {noLink ? (
        <LevelNameFormatted long={long} LevelData={LevelData} />
      ) : (
        <Link to={`/levels/${LevelIndex}`}>
          <LevelNameFormatted long={long} LevelData={LevelData} />
        </Link>
      )}
    </>
  );
};

const types: Record<string, string> = {
  NM: 'Normal',
  FF: 'First Finish',
  OL: 'One Life',
  SL: 'Slowness',
  SR: 'Survivor',
  FT: 'Flag Tag',
  AP: 'Apple',
  SP: 'Speed',
  LC: 'Last Counts',
  FC: 'Finish Count',
  HT: '1 Hour TT',
};

type BattleTypeProps = {
  type: string;
  lower?: boolean;
  small?: boolean;
  upper?: boolean;
};

const BattleType = ({
  type,
  lower = false,
  small = false,
  upper = false,
}: BattleTypeProps) => (
  <TypeSpan small={small} lower={lower} upper={upper}>
    {types[type]}
  </TypeSpan>
);

const TypeSpan = styled.span<{
  small: boolean;
  lower: boolean;
  upper: boolean;
}>`
  text-transform: ${p =>
    p.upper ? 'uppercase' : p.lower ? 'lowercase' : 'none'};
  font-size: ${p => (p.small ? '10px' : 'inherit')};
`;

export { Level, BattleType, formatLevel };
