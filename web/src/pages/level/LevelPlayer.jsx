import styled from '@emotion/styled';
import Loading from 'components/Loading';
import { Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import LevelMap from 'features/LevelMap';
import config from 'config';
import Recplayer from 'components/Recplayer';
import { battleStatus } from 'utils/battle';
import { useStoreActions, useStoreState } from 'easy-peasy';

const LevelPlayer = ({ loading, level, battles }) => {
  const {
    settings: { fancyMap, showGravityApples },
  } = useStoreState(state => state.Level);

  const { toggleFancyMap, toggleShowGravityApples } = useStoreActions(
    actions => actions.Level,
  );

  if (loading) {
    return <Loading />;
  }

  if (level.Locked) {
    return <>Can't show map. Level locked.</>;
  }

  // Don't show map if queued battles
  if (battles.length > 0 && battleStatus(battles[0]) === 'Queued') {
    return <>Can't show map. Queued battle.</>;
  }

  const showFancyMap = () => {
    const isWindow = typeof window !== 'undefined';
    return isWindow && fancyMap;
  };

  return (
    <>
      <PlayerContainer>
        <Player fancy={showFancyMap()}>
          {showFancyMap() ? (
            <Recplayer
              lev={`${config.dlUrl}level/${level.LevelIndex}`}
              controls
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
