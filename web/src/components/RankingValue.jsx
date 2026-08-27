import { isEmpty } from 'lodash';
import styled from '@emotion/styled';
import React from 'react';

// ie. "1650 (+50)"
const RankingValue = ({ rankingHistory, fallback }) => {
  if (isEmpty(rankingHistory)) {
    return <>{fallback}</>;
  }

  const ranking = parseFloat(rankingHistory.Ranking).toFixed(2);
  const increase = parseFloat(rankingHistory.Increase).toFixed(2);

  return (
    <>
      {ranking}
      {` `}
      {increase >= 0 && <Green> (+{increase})</Green>}
      {increase < 0 && <Red> ({increase})</Red>}
    </>
  );
};

const Green = styled.span`
  color: ${p => p.theme.primary};
`;

const Red = styled.span`
  color: ${p => p.theme.errorColor};
`;

export default RankingValue;
