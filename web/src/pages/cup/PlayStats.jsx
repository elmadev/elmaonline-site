import React from 'react';
import styled from '@emotion/styled';
import LevelCollectionStats from 'features/LevelCollectionStats';

const PlayStats = ({ events }) => {
  const levelIds = events?.map(event => event.LevelIndex);

  return (
    <Root>
      <LevelCollectionStats levelIds={levelIds} />
    </Root>
  );
};

const Root = styled.div`
  padding-bottom: 50px;
`;

export default PlayStats;
