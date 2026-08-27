import React from 'react';
import { useStoreRehydrated } from 'easy-peasy';
import { useMediaQuery } from '@material-ui/core';
import { useStoreState } from 'easy-peasy';
import Recplayer from 'components/Recplayer';
import styled from '@emotion/styled';
import config from 'config';
import { Row } from 'components/Containers';
import Time from 'components/Time';
import Kuski from 'components/Kuski';
import { downloadRec } from 'utils/misc';
import ReplaySettings from 'features/ReplaySettings';

const RecView = props => {
  const isRehydrated = useStoreRehydrated();

  const {
    isWindow,
    BattleIndex,
    levelIndex,
    battleStatus,
    replayUrl,
    player,
    levelName,
    hasReplay,
  } = props;

  const isMobile = useMediaQuery('(max-width: 1000px)');
  const {
    settings: { theater },
  } = useStoreState(state => state.ReplaySettings);

  return (
    <div>
      {!isRehydrated ? null : (
        <PlayerContainer theater={theater}>
          <div className="player">
            <>
              {isWindow && battleStatus !== 'Queued' && (
                <Recplayer
                  rec={
                    !hasReplay
                      ? undefined
                      : replayUrl ||
                        `${config.dlUrl}battlereplay/${BattleIndex}`
                  }
                  lev={`${config.dlUrl}level/${levelIndex}`}
                  shirt={[`${config.dlUrl}shirt/${player?.Kuski?.KuskiIndex}`]}
                  controls
                  forceRefresh
                />
              )}
            </>
          </div>
          <Row jc="space-between">
            {player?.Kuski?.Kuski && !isMobile && hasReplay && (
              <PlayerTitle>
                <Kuski kuskiData={player.Kuski} flag={true} team={true} />
                <span>&nbsp;</span>
                <Download
                  onClick={() =>
                    downloadRec(
                      replayUrl || `${config.dlUrl}battlereplay/${BattleIndex}`,
                      levelName,
                      player.Kuski.Kuski,
                      player.Time,
                    )
                  }
                >
                  <Time time={player.Time} apples={player.Apples} />
                </Download>
              </PlayerTitle>
            )}
            <ReplaySettings />
          </Row>
        </PlayerContainer>
      )}
    </div>
  );
};

const PlayerTitle = styled.div`
  padding: 9px;
  padding-right: 18px;
  font-size: ${p => p.theme.smallFont};
`;

const Download = styled.span`
  cursor: pointer;
  color: ${p => p.theme.linkColor};
  :hover {
    color: ${p => p.theme.linkHover};
  }
`;

const PlayerContainer = styled.div`
  width: ${p => (p.theater ? '100%' : '60%')};
  float: left;
  padding: 7px;
  box-sizing: border-box;
  .player {
    background: ${p => p.theme.pageBackground};
    height: 550px;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 1650px) {
      height: 450px;
    }
    @media screen and (max-width: 500px) {
      height: 400px;
    }
  }
  @media screen and (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

export default RecView;
