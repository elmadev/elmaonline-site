import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Tabs, Tab } from '@material-ui/core';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { VariableSizeGrid as Grid } from 'react-window';
import Layout from 'components/Layout';
import GridItem from 'components/GridItem';
import Popularity from 'components/Popularity';
import useElementSize from 'utils/useWindowSize';
import Fab from 'components/Fab';
import LevelpacksDetailed from './LevelpacksDetailed';
import Controls from './Controls';
import FavStar from './FavStar';
import RecordsCard from './RecordsCard';
import LevelList from '../../features/LevelList';
import { useQueryAlt, LevelPackStatsKuski } from 'api';
import { nickId } from 'utils/nick';

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
                    if (!p) {
                      return <GridItem2 full></GridItem2>;
                    }
                    const s = stats[p.LevelPackIndex] ?? {};

                    const widthPct = (s.NormalizedPopularity || 0) * 100;
                    const avg = (s.AvgKuskiPerLevel || 0).toFixed(1);
                    const count = s.LevelCountAll || 0;

                    return (
                      <div style={style} key={p.LevelPackIndex}>
                        <GridItem2
                          key={p.LevelPackIndex}
                          to={`/levels/packs/${p.LevelPackName}`}
                          name={p.LevelPackName}
                          longname={p.LevelPackLongName}
                          afterName={` (${count} levels)`}
                          afterLongname={
                            <Popularity2
                              title={`Avg. number of kuskis played per level: ${avg}`}
                              widthPct={widthPct}
                              after={<span>{avg}</span>}
                            />
                          }
                        >
                          <StarCon>
                            <FavStar
                              pack={p}
                              {...{ loggedIn, addFav, removeFav }}
                            />
                          </StarCon>
                        </GridItem2>
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
    </Layout>
  );
};

const GridItem2 = styled(GridItem)`
  width: 100% !important;
  &:hover {
    .pop-bar-1 {
      background: ${p => p.theme.paperBackground};
    }
  }
`;

const Popularity2 = styled(Popularity)`
  margin-top: 20px;
  width: 100%;
  max-width: 320px;
  .pop-after {
    min-width: 24px;
    span {
      font-size: 12px;
    }
  }
`;

const StarCon = styled.div`
  cursor: pointer;
  position: absolute;
  top: 12px;
  right: 13px;
`;

const StyledRecentRecords = styled.div`
  padding: 10px 0 40px 0;
`;

export default Levels;
