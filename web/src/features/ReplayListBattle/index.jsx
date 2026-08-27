import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import ReplayCard from 'components/ReplayCard';
import Preview from 'components/Preview';
import styled from '@emotion/styled';
import Pagination from '@material-ui/lab/Pagination';
import { findIndex } from 'lodash';

export default function ReplayListBattle({
  defaultPage = 0,
  defaultPageSize = 25,
}) {
  const [previewRec, setPreviewRec] = useState(null);
  const [page, setPage] = useState(defaultPage);
  const [pageSize] = useState(defaultPageSize);
  const { battles } = useStoreState(state => state.ReplayList);
  const { getBattles } = useStoreActions(actions => actions.ReplayList);

  useEffect(() => {
    if (!battles) {
      getBattles(200);
    }
  }, []);

  const handleReplayClick = replay => {
    setPreviewRec(replay);
  };

  const nextReplay = () => {
    if (!previewRec) {
      return null;
    }
    const currentIndex = findIndex(battles, {
      BattleIndex: previewRec.BattleIndex,
    });

    const nextIndex =
      currentIndex + 1 >= battles.length ? currentIndex : currentIndex + 1;

    const nextReplay = battles[nextIndex];
    setPreviewRec(nextReplay);
  };

  const previousReplay = () => {
    if (!previewRec) {
      return null;
    }
    const currentIndex = findIndex(battles, {
      BattleIndex: previewRec.BattleIndex,
    });

    const previousIndex =
      currentIndex - 1 < 0 ? currentIndex : currentIndex - 1;

    const previousReplay = battles[previousIndex];
    setPreviewRec(previousReplay);
  };

  if (!battles) {
    return null;
  }

  return (
    <Container grid>
      <CardGrid>
        {battles
          .slice(page * pageSize, page * pageSize + pageSize)
          .map(replay => {
            return (
              <ReplayCard
                key={replay.ReplayIndex}
                replay={replay}
                onPreviewClick={() => handleReplayClick(replay)}
              />
            );
          })}
      </CardGrid>
      <div style={{ padding: '16px' }}>
        <Pagination
          count={Math.ceil(battles.length / pageSize)}
          onChange={(event, value) => setPage(value - 1)}
          page={page + 1}
          showFirstButton
          showLastButton
        />
      </div>
      {previewRec && (
        <Preview
          previewRec={previewRec}
          setPreviewRec={setPreviewRec}
          nextReplay={nextReplay}
          previousReplay={previousReplay}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: block;
  background: ${p =>
    p.grid ? p.theme.pageBackgroundDark : p.theme.paperBackground};
  min-width: 100%;
  max-height: ${p => (p.small ? '243px' : 'auto')};
  overflow: ${p => (p.small ? 'auto' : 'visible')};
  a {
    color: ${p => p.theme.fontColor};
    :hover {
      color: ${p => p.theme.linkColor};
    }
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
  padding: 12px;
`;
