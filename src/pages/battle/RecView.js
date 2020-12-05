import React, { useState } from 'react';
import { useStoreState, useStoreActions, useStoreRehydrated } from 'easy-peasy';
import { Checkbox, FormControlLabel, withStyles } from '@material-ui/core';
import Recplayer from 'components/Recplayer';
import Play from 'styles/Play';
import styled from 'styled-components';

const RecView = props => {
  const [play, setPlay] = useState(
    navigator.userAgent.toLowerCase().indexOf('firefox') === -1,
  );

  const isRehydrated = useStoreRehydrated();

  const { isWindow, BattleIndex, levelIndex, battleStatus } = props;

  const { toggleRecAutoplay } = useStoreActions(actions => actions.Battle);

  const {
    settings: { autoPlayRecs },
  } = useStoreState(state => state.Battle);

  return (
    <div>
      {!isRehydrated ? null : (
        <PlayerContainer>
          <div className="player">
            {play ? (
              <>
                {isWindow && battleStatus !== 'Queued' && (
                  <Recplayer
                    rec={`/dl/battlereplay/${BattleIndex}`}
                    lev={`/dl/level/${levelIndex}`}
                    autoPlay={autoPlayRecs ? 'if-visible' : 'no'}
                    controls
                  />
                )}
              </>
            ) : (
              <Play type="replay" onClick={() => setPlay(true)} />
            )}
          </div>
          <StyledFormControlLabel
            control={
              <Checkbox
                onChange={() => toggleRecAutoplay()}
                checked={autoPlayRecs}
                color="primary"
                size="small"
              />
            }
            label="Autoplay replays"
          />
        </PlayerContainer>
      )}
    </div>
  );
};

const PlayerContainer = styled.div`
  width: 60%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
  .player {
    background: #f1f1f1;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const StyledFormControlLabel = withStyles({
  label: { fontSize: '14px' },
})(FormControlLabel);

export default RecView;
