import styled from '@emotion/styled';
import Loading from 'components/Loading';
import { Checkbox, FormControlLabel } from '@mui/material';
import React, { useState } from 'react';
import LevelMap from 'features/LevelMap';
import config from 'config';
import Recplayer from 'components/Recplayer';
import { battleStatus } from 'utils/battle';
import { useStoreActions, useStoreState } from 'easy-peasy';

const LevelPlayer = ({ LevelIndex, loading, level, battles }) => {
  const [failedLevel, setFailedLevel] = useState(null);
  const failed = failedLevel === LevelIndex;
  const {
    settings: { fancyMap, showGravityApples },
  } = useStoreState(state => state.Level);

  const { toggleFancyMap, toggleShowGravityApples } = useStoreActions(
    actions => actions.Level,
  );

  const showFancyMap = () => {
    const isWindow = typeof window !== 'undefined';
    return isWindow && fancyMap;
  };

  if (loading && (!showFancyMap() || failed)) {
    return <Loading />;
  }

  if (!loading && level.Locked) {
    return <>Can't show map. Level locked.</>;
  }

  if (!loading && battles.length > 0 && battleStatus(battles[0]) === 'Queued') {
    return <>Can't show map. Queued battle.</>;
  }

  return (
    <>
      <PlayerContainer>
        <Player fancy={showFancyMap()}>
          {showFancyMap() ? (
            <Recplayer
              lev={`${config.dlUrl}level/${LevelIndex}`}
              controls
              onError={() => setFailedLevel(LevelIndex)}
            />
          ) : (
            <LevelMap LevelIndex={level.LevelIndex} />
          )}
        </Player>
      </PlayerContainer>
      <StyledFormControlLabel
        control={
          <Checkbox
            onChange={toggleFancyMap}
            checked={fancyMap}
            color="primary"
            size="small"
          />
        }
        label="Fancy map"
      />
      {!showFancyMap() && (
        <StyledFormControlLabel
          control={
            <Checkbox
              onChange={toggleShowGravityApples}
              checked={showGravityApples}
              color="primary"
              size="small"
            />
          }
          label="Show gravity apples"
        />
      )}
    </>
  );
};

const PlayerContainer = styled.div`
  container-type: inline-size;
`;

const Player = styled.div`
  background: ${p => p.theme.pageBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  ${p => p.fancy && 'height: max(320px, 100cqw * 9 / 16);'}
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  span {
    font-size: 14px;
  }
`;

export default LevelPlayer;
