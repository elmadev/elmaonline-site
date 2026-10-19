import { useState, useEffect, useRef, useCallback } from 'react';
import Recplayer from 'components/Recplayer';
import Button from 'components/Buttons';
import config from 'config';
import { shirtBmpUrl } from 'utils/misc';
import styled from '@emotion/styled';
import useElementSize from 'utils/useWindowSize';
import { useQueryAlt, RandomReplay } from 'api';
import { getReplayLink } from 'utils/link';
import { isValidLevUrl, isValidRecUrl } from 'utils/recplayerUrls';
import Loading from 'components/Loading';

const MAX_CONSECUTIVE_FAILURES = 5;
const SKIP_DELAY = 500;

const levUrl = replay => `${config.dlUrl}level/${replay.LevelData?.LevelIndex}`;

const isPlayable = replay =>
  isValidRecUrl(getReplayLink(replay).link) && isValidLevUrl(levUrl(replay));

export default function Randomizer() {
  const [index, setIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [gaveUp, setGaveUp] = useState(false);
  const failures = useRef(0);
  const skipTimer = useRef(null);
  const [visibilityState, setVisibilityState] = useState(
    document.visibilityState,
  );
  const windowSize = useElementSize();
  const height = windowSize.height - 48 - 54;

  useEffect(() => {
    const handleVisibilityChange = () => {
      const newVisibilityState = document.visibilityState;
      setVisibilityState(newVisibilityState);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const { data: randomReplays } = useQueryAlt(
    ['RandomReplay', refreshKey],
    RandomReplay,
    { select: replays => replays.filter(isPlayable) },
  );

  const replay = randomReplays?.[index];
  const replayCount = randomReplays?.length ?? 0;

  const next = useCallback(() => {
    if (index + 1 >= replayCount) {
      setRefreshKey(prev => prev + 1);
      setIndex(0);
      return;
    }
    setIndex(prev => prev + 1);
  }, [index, replayCount]);

  const skip = useCallback(() => {
    if (skipTimer.current) return;
    failures.current += 1;
    if (failures.current >= MAX_CONSECUTIVE_FAILURES) {
      setGaveUp(true);
      return;
    }
    skipTimer.current = setTimeout(next, SKIP_DELAY);
  }, [next]);

  // a new replay cancels a pending skip of the previous one
  useEffect(() => {
    return () => {
      clearTimeout(skipTimer.current);
      skipTimer.current = null;
    };
  }, [refreshKey, index]);

  if (gaveUp || randomReplays?.length === 0) {
    return (
      <Container height={height}>
        <Message>
          <p>Couldn&apos;t play the last few random replays.</p>
          <Button
            onClick={() => {
              failures.current = 0;
              setGaveUp(false);
              next();
            }}
          >
            Try again
          </Button>
        </Message>
      </Container>
    );
  }

  if (!replay) {
    return <Loading />;
  }

  const handleReplayEnd = () => {
    failures.current = 0;
    next();
  };

  return (
    <Container height={height}>
      <Recplayer
        key={`${refreshKey}-${index}`}
        rec={getReplayLink(replay).link}
        lev={levUrl(replay)}
        shirt={[shirtBmpUrl(replay.DrivenByData?.KuskiIndex)]}
        controls
        height={height}
        onEnd={handleReplayEnd}
        onError={skip}
        autoPlay={visibilityState === 'visible' ? 'yes' : 'no'}
      />
    </Container>
  );
}

const Container = styled.div`
  height: ${p => p.height}px;
  width: 100%;
`;

const Message = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
