import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import Time from 'components/Time';
import Crown from 'images/crown.svg';
import CrownWhite from 'images/crown-white.svg';

const Compare = ({
  time,
  compareTime,
  hideCrown = false,
  relative = false,
}) => {
  const theme = useTheme();
  if (!time || !compareTime) {
    return null;
  }
  if (compareTime === time && hideCrown) {
    return null;
  }
  if (compareTime === time) {
    return (
      <span>
        <Image
          src={theme.type === 'light' ? Crown : CrownWhite}
          alt="Crown"
          title="You have the record!"
        />
      </span>
    );
  }
  return (
    <Color bettertime={compareTime > time}>
      {compareTime > time ? '-' : '+'}
      {relative ? (
        <span>
          {Math.abs(((compareTime - time) * 100) / compareTime).toFixed(2)}%
        </span>
      ) : (
        <Time time={Math.abs(compareTime - time)} />
      )}
    </Color>
  );
};

const Color = styled.span`
  && {
    color: ${p => (p.bettertime ? p.theme.linkColor : '#da0000')};
  }
`;

const Image = styled.img`
  height: 19px;
  width: 19px;
`;

export default Compare;
