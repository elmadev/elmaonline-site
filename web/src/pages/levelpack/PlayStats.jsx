import React from 'react';
import styled from '@emotion/styled';
import LevelCollectionStats from 'features/LevelCollectionStats';

const PlayStats = ({ LevelPack }) => {
  const levels = LevelPack?.levels || [];
  const levelIds = levels.map(l => l.LevelIndex);
  const excludeFromTotalIds = levels
    .filter(l => l.ExcludeFromTotal === 1)
    .map(l => l.LevelIndex);

  return (
    <Root>
      <LevelCollectionStats
        levelIds={levelIds}
        excludeFromTotalIds={excludeFromTotalIds}
      />
    </Root>
  );
};

const Root = styled.div`
  padding-bottom: 50px;
`;

export default PlayStats;
