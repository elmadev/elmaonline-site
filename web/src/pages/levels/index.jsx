import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Tabs, Tab } from '@material-ui/core';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { VariableSizeGrid as Grid } from 'react-window';
import Layout from 'components/Layout';
import GridItem from 'components/GridItem';
import useElementSize from 'utils/useWindowSize';
import Fab from 'components/Fab';
import LevelpacksDetailed from './LevelpacksDetailed';
import Controls from './Controls';
import RecordsCard from './RecordsCard';
import LevelList from '../../features/LevelList';
import { useQueryAlt, LevelPackStatsKuski } from 'api';
import { nickId } from 'utils/nick';
import { LevelExplorerDialog } from 'features/LevelExplorer';
import LevelpackCard from './LevelpackCard';

const getColumnCount = window_width => {
  if (window_width > 1300) {
    return 5;
  }

  if (window_width > 1100) {
    return 4;
  }

  if (window_width > 600) {
    return 3;
  }

  if (window_width > 400) {
    return 2;
  }

  return 1;
};

const Levels = ({ tab, detailed }) => {
  const [previewPack, setPreviewPack] = useState(null);
  const GridRef = useRef();
  const navigate = useNavigate();
  const windowSize = useElementSize();
  const listHeight = windowSize.height - 186;
  const listWidth =
    windowSize.width > 1000 ? windowSize.width - 250 : windowSize.width || 0;

  const columnCount = getColumnCount(windowSize.width);

  const { levelpacksSorted, stats, collections } = useStoreState(
    state => state.Levels,
  );

  const { loggedIn } = useStoreState(state => state.Login);
  const {
    getLevelpacks,
    getStats,
    setSort,
    addFav,
    removeFav,
    getFavs,
    getCollections,
  } = useStoreActions(actions => actions.Levels);

  const kuskiIndex = nickId();
  const { data: levelpackStats = [] } = useQueryAlt(
    ['LevelPackStatsKuski', kuskiIndex],
    async () => LevelPackStatsKuski(kuskiIndex),
    {
      enabled: loggedIn && Boolean(detailed),
    },
  );

  const location = useLocation();
  const urlArgs = location.search;
  const sort = (urlArgs && urlArgs.sort) || '';

  useEffect(() => {
    setSort(sort);
  }, [sort]);

  useEffect(() => {
    if (GridRef?.current) {
      GridRef.current.resetAfterIndices({
        columnIndex: 0,
        rowIndex: 0,
        shouldForceUpdate: true,
      });
    }
  }, [listWidth]);

  useEffect(() => {
    getLevelpacks(false);
    getStats(false);

    if (loggedIn) {
      getFavs(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'collections') {
      getCollections();
    }
  }, [tab]);

  return (
    <Layout edge t="Levels">
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab || ''}
        onChange={(e, value) =>
          navigate({ to: ['/levels', value].filter(Boolean).join('/') })
        }
      >
        <Tab label="Packs" value="" />
        <Tab label="Collections" value="collections" />
        <Tab label="Recent Records" value="recent-records" />
        <Tab label="Search" value="search" />
      </Tabs>
      {!tab && (
        <>
          <Controls detailed={detailed} sort={sort} />
          {detailed && (
            <LevelpacksDetailed
              levelpacksSorted={levelpacksSorted}
              stats={stats}
              addFav={addFav}
              removeFav={removeFav}
              loggedIn={loggedIn}
              levelpackStats={levelpackStats}
              onPreview={setPreviewPack}
            />
          )}
          {!detailed && (
            <>
              {levelpacksSorted.length > 0 && (
                <Grid
                  ref={GridRef}
                  columnCount={columnCount}
                  columnWidth={() => (listWidth - 20) / columnCount}
                  height={listHeight}
                  rowCount={
                    Math.floor(levelpacksSorted.length / columnCount) + 1
                  }
                  rowHeight={() => 100}
                  width={listWidth}
                >
                  {({ columnIndex, rowIndex, style }) => {
                    const index =
                      rowIndex * columnCount + (columnIndex + 1) - 1;
                    const p = levelpacksSorted[index];
                    if (!p) return null;
                    return (
                      <div style={style} key={p.LevelPackIndex}>
                        <LevelpackCard
                          pack={p}
                          stats={stats[p.LevelPackIndex]}
                          onPreview={setPreviewPack}
                          {...{ loggedIn, addFav, removeFav }}
                        />
                      </div>
                    );
                  }}
                </Grid>
              )}
            </>
          )}
          <Fab url="/levels/add" />
        </>
      )}
      {tab === 'collections' && (
        <>
          {collections && (
            <>
              {collections.length > 0 &&
                collections.map(c => (
                  <GridItem
                    to={`/levels/collections/${c.CollectionName}`}
                    name={c.CollectionName}
                    longname={c.CollectionLongName}
                    key={c.LevelPackCollectionIndex}
                  />
                ))}
            </>
          )}
          <Fab url="/levels/collections/add" />
        </>
      )}
      {tab === 'recent-records' && (
        <StyledRecentRecords>
          <RecordsCard />
        </StyledRecentRecords>
      )}
      {tab === 'search' && <LevelList />}
      <LevelExplorerDialog
        open={previewPack !== null}
        onClose={() => setPreviewPack(null)}
        levelPack={previewPack}
        title={`Levelpack Preview — ${previewPack}`}
        contextLink={{
          to: `/levels/packs/${previewPack}`,
          label: 'Go to levelpack page →',
        }}
      />
    </Layout>
  );
};

const StyledRecentRecords = styled.div`
  padding: 10px 0 40px 0;
`;

export default Levels;
