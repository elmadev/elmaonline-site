import { useState, useEffect } from 'react';
import Recplayer from 'components/Recplayer';
import config from 'config';
import styled from '@emotion/styled';
import useElementSize from 'utils/useWindowSize';
import { useQueryAlt, RandomReplay } from 'api';
import { getReplayLink } from 'utils/link';
import Loading from 'components/Loading';

export default function Randomizer() {
  const [index, setIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
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
  );

  if (!randomReplays?.length) {
    return <Loading />;
  }

  const handleReplayEnd = () => {
    if (index + 1 >= randomReplays.length) {
      setRefreshKey(prev => prev + 1);
      setIndex(0);
      return;
    }
    setIndex(prev => prev + 1);
  };

  const link = getReplayLink(randomReplays[index]);
  return (
    <Container height={height}>
      <Recplayer
        rec={link.link}
        lev={`${config.dlUrl}level/${randomReplays[index].LevelData.LevelIndex}`}
        shirt={
          randomReplays[index].DrivenByData?.KuskiIndex
            ? [
                `${config.dlUrl}shirt/${randomReplays[index].DrivenByData?.KuskiIndex}`,
              ]
            : []
        }
        controls
        height={height}
        onEnd={handleReplayEnd}
        autoPlay={visibilityState === 'visible' ? 'yes' : 'no'}
      />
    </Container>
  );
}

const Container = styled.div`
  height: ${p => p.height}px;
  width: 100%;
`;
