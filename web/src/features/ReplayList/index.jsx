import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import RecListItem from 'components/RecListItem';
import { ListContainer, ListHeader, ListCell } from 'components/List';
import { findIndex } from 'lodash';
import styled from '@emotion/styled';
import Preview from 'components/Preview';
import ReplayCard from 'components/ReplayCard';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ListIcon from '@material-ui/icons/List';
import AppsIcon from '@material-ui/icons/Apps';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';

import { TablePagination } from '@material-ui/core';
import Fab from 'components/Fab';
import TagFilter from 'components/TagFilter';

export default function ReplayList({
  defaultPage = 0,
  defaultPageSize = 25,
  drivenBy = 0,
  uploadedBy = 0,
  summary,
  nonsticky = false,
  levelPack = 0,
  persist = '',
  uploadFab = false,
}) {
  const [previewRec, setPreviewRec] = useState(null);
  const [page, setPage] = useState(defaultPage);
  const [pageSize] = useState(defaultPageSize);
  const {
    replays,
    tagOptions,
    settings,
    persistPage,
    tags: { includedTags, excludedTags },
  } = useStoreState(state => state.ReplayList);
  const {
    getReplays,
    getTagOptions,
    setSettings,
    setPersistPage,
    tags: { setIncludedTags, setExcludedTags },
  } = useStoreActions(actions => actions.ReplayList);
  const { loggedIn, userid } = useStoreState(state => state.Login);

  useEffect(() => {
    getTagOptions();
    setPage(getPage());
  }, []);

  useEffect(() => {
    getReplays({
      page: getPage(),
      pageSize,
      tags: includedTags.map(tag => tag.TagIndex),
      excludedTags: excludedTags.map(tag => tag.TagIndex),
      sortBy: !summary ? settings.sortBy : 'uploaded',
      order: settings.sortBy === 'time' ? 'asc' : 'desc',
      drivenBy,
      uploadedBy,
      levelPack,
    });
  }, [page, pageSize, includedTags, excludedTags, settings.sortBy]);

  const updatePage = pageNo => {
    setPage(pageNo);
    if (persist) {
      setPersistPage({ key: persist, pageNo });
    }
  };

  const getPage = () => {
    if (persist && persistPage?.[persist]) {
      return persistPage[persist];
    }
    return page;
  };

  const columns = ['Uploaded', 'Replay', 'Level', 'Time', 'By'];
  const personal = Boolean(
    loggedIn &&
      ((drivenBy && userid === drivenBy) ||
        (uploadedBy && userid === uploadedBy)),
  );
  if (personal) {
    columns.push('Unlisted');
  }
  if (!summary) {
    columns.push('Rating');
    columns.push('Views');
    columns.push('Tags');
  }

  const handleReplayClick = replay => {
    setPreviewRec(replay);
  };

  const nextReplay = () => {
    if (!previewRec) {
      return null;
    }
    const currentIndex = findIndex(replays, {
      ReplayIndex: previewRec.ReplayIndex,
    });

    const nextIndex =
      currentIndex + 1 >= replays.length ? currentIndex : currentIndex + 1;

    const nextReplay = replays[nextIndex];
    setPreviewRec(nextReplay);
  };

  const previousReplay = () => {
    if (!previewRec) {
      return null;
    }
    const currentIndex = findIndex(replays, {
      ReplayIndex: previewRec.ReplayIndex,
    });

    const previousIndex =
      currentIndex - 1 < 0 ? currentIndex : currentIndex - 1;

    const previousReplay = replays[previousIndex];
    setPreviewRec(previousReplay);
  };

  if (!replays) {
    return null;
  }

  const showGrid = () => {
    if (summary) {
      return false;
    }
    return settings.grid;
  };

  return (
    <Container small={summary} grid={showGrid()}>
      {!summary && (
        <>
          <StickyContainer nonsticky={nonsticky}>
            <TagFilter
              tagOptions={tagOptions}
              selectedTags={includedTags}
              onSelectedTagsChange={(_event, newValue) => {
                setIncludedTags(newValue);
                updatePage(0);
              }}
              excludedTags={excludedTags}
              onExcludedTagsChange={(_event, newValue) => {
                setExcludedTags(newValue);
                updatePage(0);
              }}
            />
            <ToggleButtonGroup
              value={settings.sortBy}
              size="small"
              exclusive
              style={{ alignSelf: 'center', marginRight: '12px' }}
              onChange={(ev, value) => setSettings({ sortBy: value })}
            >
              <ToggleButton title="Sort by uploaded" value="">
                {settings.sortBy === '' ? (
                  <CalendarTodayIcon fontSize="small" />
                ) : (
                  <CalendarTodayOutlinedIcon fontSize="small" />
                )}
              </ToggleButton>
              <ToggleButton title="Sort by time" value="time">
                {settings.sortBy === 'time' ? (
                  <WatchLaterIcon fontSize="small" />
                ) : (
                  <AccessTimeIcon fontSize="small" />
                )}
              </ToggleButton>
              <ToggleButton title="Sort by rating" value="rating">
                {settings.sortBy === 'rating' ? (
                  <StarIcon fontSize="small" />
                ) : (
                  <StarBorderIcon fontSize="small" />
                )}
              </ToggleButton>
              <ToggleButton title="Sort by views" value="views">
                {settings.sortBy === 'views' ? (
                  <VisibilityIcon fontSize="small" />
                ) : (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                )}
              </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              value={settings.grid}
              size="small"
              exclusive
              style={{ alignSelf: 'center', marginRight: '12px' }}
              onChange={(ev, value) => setSettings({ grid: value })}
            >
              <ToggleButton title="List view" value={false}>
                <ListIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton title="Thumbnail view" value={true}>
                <AppsIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </StickyContainer>
          {previewRec && (
            <Preview
              previewRec={previewRec}
              setPreviewRec={setPreviewRec}
              nextReplay={nextReplay}
              previousReplay={previousReplay}
            />
          )}
        </>
      )}
      {!showGrid() && (
        <ListContainer>
          <ListHeader>
            <ListCell>Uploaded</ListCell>
            <ListCell>Replay</ListCell>
            <ListCell>Level</ListCell>
            <ListCell right>Time</ListCell>
            <ListCell>By</ListCell>
            {personal && <ListCell>Unlisted</ListCell>}
            {!summary && (
              <>
                <ListCell>Rating</ListCell>
                <ListCell>Views</ListCell>
                <ListCell>Tags</ListCell>
              </>
            )}
          </ListHeader>
          {replays.map(replay => {
            return (
              <RecListItem
                key={replay.ReplayIndex}
                replay={replay}
                columns={columns}
              />
            );
          })}
        </ListContainer>
      )}
      {showGrid() && (
        <CardGrid>
          {replays.map(replay => {
            return (
              <ReplayCard
                key={replay.ReplayIndex}
                replay={replay}
                onPreviewClick={() => handleReplayClick(replay)}
              />
            );
          })}
        </CardGrid>
      )}
      {!summary && (
        <PaginationCon>
          <TablePagination
            style={{ width: '600px; max-width: 100%;' }}
            component="div"
            count={-1}
            rowsPerPage={25}
            page={getPage()}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onPageChange={(event, newPage) => updatePage(newPage)}
            rowsPerPageOptions={[]}
          />
        </PaginationCon>
      )}
      {uploadFab ? <Fab url="/replays/upload" /> : null}
    </Container>
  );
}

const PaginationCon = styled.div`
  padding: 16px;
  .MuiTablePagination-spacer {
    display: none;
  }
`;

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

const StickyContainer = styled.div`
  background: ${p => p.theme.pageBackground};
  position: ${p => (p.nonsticky ? 'relative' : 'sticky')};
  display: flex;
  justify-content: space-between;
  top: ${p => (p.nonsticky ? '0' : '52px')};
  z-index: 10;
`;
