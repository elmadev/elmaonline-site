import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TablePagination,
  Paper,
} from '@material-ui/core';
import { ListContainer, ListHeader, ListCell, ListRow } from 'components/List';
import Autocomplete from '@material-ui/lab/Autocomplete';
import styled from '@emotion/styled';
import { Level } from 'components/Names';
import Kuski from 'components/Kuski';
import Tags from 'components/Tags';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import { KuskiAutoComplete } from 'components/AutoComplete';
import Loading from 'components/Loading';
import LevelCard from 'components/LevelCard';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ListIcon from '@material-ui/icons/List';
import AppsIcon from '@material-ui/icons/Apps';
import { useSearch, useNavigate } from '@tanstack/react-router';
import Switch from 'components/Switch';

export default function LevelList({
  defaultPage = 0,
  defaultPageSize = 25,
  defaultAddedBy,
  summary,
  nonsticky = false,
  levelPack = null,
}) {
  const {
    page = defaultPage,
    selectedTags,
    excludedTags,
    addedBy = defaultAddedBy,
    selectedLevelpack = levelPack,
    finished = 'all',
    finishedBy,
    battled = 'all',
    q = '',
    order = 'desc',
  } = useSearch({
    strict: false,
  });
  const navigate = useNavigate();

  const [pageSize] = useState(defaultPageSize);
  const [query, setQuery] = useState(q);
  const { loggedIn } = useStoreState(state => state.Login);
  const { levels, tagOptions, kuskiOptions, loadingLevels, settings } =
    useStoreState(state => state.LevelList);
  const { levelpacksSorted } = useStoreState(state => state.Levels);
  const { getLevelpacks } = useStoreActions(state => state.Levels);
  const { getLevels, getTagOptions, getKuskiOptions, setSettings } =
    useStoreActions(actions => actions.LevelList);

  useEffect(() => {
    getTagOptions();
    getKuskiOptions();
    getLevelpacks(false);
  }, []);

  useEffect(() => {
    getLevels(buildSearchQueryParams());
  }, [
    page,
    pageSize,
    selectedTags,
    excludedTags,
    addedBy,
    finished,
    battled,
    finishedBy,
    selectedLevelpack,
    order,
    q,
  ]);

  const handleSearchBlur = () => {
    updateSearch({ q: query });
  };

  const handleSearchKeyPress = event => {
    if (event.key === 'Enter') {
      updateSearch({ q: query });
    }
  };

  const updateSearch = values => {
    navigate({
      search: prev => ({ ...prev, ...values }),
    });
  };

  const showGrid = () => {
    if (summary) {
      return false;
    }
    return settings.grid;
  };

  const buildSearchQueryParams = () => ({
    page,
    pageSize,
    tags: selectedTags,
    excludedTags,
    order,
    addedBy,
    finished,
    battled,
    finishedBy: finishedBy || undefined,
    q,
    levelPack: selectedLevelpack,
  });

  const columns = [
    'Added',
    'Filename',
    'Level name',
    'Added by',
    'Best time',
    'My time',
    'Battles',
    'Apples',
    'Killers',
  ];
  if (!summary) {
    columns.push('Tags');
  }

  if (!levels) {
    return null;
  }

  const getTags = level => {
    return level.Tags.map(tag => tag.Name);
  };

  return (
    <Root>
      <Container small={summary}>
        {!summary && (
          <>
            <StickyContainer nonsticky={nonsticky}>
              <TextField
                label="Search query"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onBlur={handleSearchBlur}
                onKeyDown={handleSearchKeyPress}
              />

              <Autocomplete
                value={tagOptions.filter(tag =>
                  selectedTags?.includes(tag.TagIndex),
                )}
                onChange={(_event, newValue) => {
                  updateSearch({
                    selectedTags: newValue.map(t => t.TagIndex),
                    page: 0,
                  });
                }}
                forcePopupIcon={false}
                multiple
                id="Tags"
                size="small"
                options={tagOptions.filter(
                  tag => !excludedTags?.includes(tag.TagIndex),
                )}
                getOptionLabel={option => option.Name}
                getOptionSelected={(option, value) =>
                  option.Name === value.Name
                }
                filterSelectedOptions
                renderInput={params => (
                  <StyledTextField {...params} label="Included tags" />
                )}
              />
              <Autocomplete
                value={tagOptions.filter(tag =>
                  excludedTags?.includes(tag.TagIndex),
                )}
                onChange={(_event, newValue) => {
                  updateSearch({
                    excludedTags: newValue.map(t => t.TagIndex),
                    page: 0,
                  });
                }}
                forcePopupIcon={false}
                multiple
                id="Excluded tags"
                size="small"
                options={tagOptions.filter(
                  tag => !selectedTags?.includes(tag.TagIndex),
                )}
                getOptionLabel={option => option.Name}
                getOptionSelected={(option, value) =>
                  option.Name === value.Name
                }
                filterSelectedOptions
                renderInput={params => (
                  <StyledTextField {...params} label="Excluded tags" />
                )}
              />
              <Autocomplete
                value={
                  levelpacksSorted.find(
                    lp => lp.LevelPackIndex === selectedLevelpack,
                  ) || null
                }
                onChange={(_event, newValue) => {
                  updateSearch({
                    selectedLevelpack: newValue?.LevelPackIndex,
                    page: 0,
                  });
                }}
                forcePopupIcon={false}
                multiple={false}
                id="Levelpack"
                size="small"
                options={levelpacksSorted}
                getOptionLabel={option => option.LevelPackName}
                getOptionSelected={(option, value) =>
                  option.LevelPackName === value?.LevelPackName
                }
                filterSelectedOptions
                renderInput={params => (
                  <StyledTextField {...params} label="Levelpack" />
                )}
              />
              {!defaultAddedBy && (
                <KuskiAutoComplete
                  list={kuskiOptions}
                  selected={
                    kuskiOptions.find(k => +k.KuskiIndex === +addedBy) || null
                  }
                  onChange={newValue => {
                    updateSearch({
                      addedBy: newValue?.KuskiIndex,
                      page: 0,
                    });
                  }}
                  multiple={false}
                  label="Added by"
                  variant="standard"
                />
              )}
              <FormControl>
                <InputLabel id="battled">Battled</InputLabel>
                <Select
                  labelId="battled"
                  value={battled}
                  displayEmpty
                  onChange={e => updateSearch({ battled: e.target.value })}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value={true}>Battled</MenuItem>
                  <MenuItem value={false}>Unbattled</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="finished">Finished</InputLabel>
                <Select
                  labelId="finished"
                  value={finished}
                  displayEmpty
                  onChange={e => {
                    updateSearch({
                      ...(e.target.value === 'all' && {
                        finishedBy: undefined,
                      }),
                      finished: e.target.value,
                    });
                  }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value={true}>Finished</MenuItem>
                  <MenuItem value={false}>Unfinished</MenuItem>
                </Select>
              </FormControl>
              <KuskiAutoComplete
                list={kuskiOptions}
                selected={
                  kuskiOptions.find(k => +k.KuskiIndex === +finishedBy) || null
                }
                onChange={newValue => {
                  updateSearch({
                    ...(finished === 'all' && newValue && { finished: true }),
                    finishedBy: newValue?.KuskiIndex,
                    page: 0,
                  });
                }}
                multiple={false}
                label="Finished by"
                variant="standard"
              />
            </StickyContainer>
          </>
        )}

        <LevelContainer>
          <Row>
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
            <SortPagination>
              <TablePagination
                component="div"
                count={
                  levels.rows.length < pageSize
                    ? pageSize * page + levels.rows.length
                    : -1
                }
                rowsPerPageOptions={false}
                rowsPerPage={pageSize}
                page={page}
                onPageChange={(e, value) => updateSearch({ page: value })}
              />
              <Switch
                checked={order === 'desc'}
                onChange={value =>
                  updateSearch({ order: value ? 'desc' : 'asc', page: 0 })
                }
              >
                Recent levels first
              </Switch>
            </SortPagination>
          </Row>

          {!showGrid() && (
            <ListContainerScrollable flex>
              <ListHeader>
                <ListCell width={170}>Added</ListCell>
                <ListCell width={120}>Filename</ListCell>
                <ListCell width={150}>Level name</ListCell>
                <ListCell width={100}>Added by</ListCell>
                <ListCell width={100}>Best time</ListCell>
                {loggedIn && <ListCell width={100}>My time</ListCell>}
                <ListCell width={80}>Battles</ListCell>
                <ListCell width={80}>Apples</ListCell>
                <ListCell width={80}>Killers</ListCell>

                {!summary && (
                  <>
                    <ListCell>Tags</ListCell>
                  </>
                )}
              </ListHeader>
              {loadingLevels ? (
                <Loading />
              ) : (
                levels.rows.map(level => {
                  return (
                    <ListRow key={`${level.LevelIndex}`}>
                      {columns.indexOf('Added') !== -1 && (
                        <ListCell width={170}>
                          <LocalTime
                            date={level.Added}
                            format="eee d MMM yyyy HH:mm"
                            parse="X"
                          />
                        </ListCell>
                      )}
                      {columns.indexOf('Filename') !== -1 && (
                        <ListCell width={120}>
                          <Level
                            LevelIndex={level.LevelIndex}
                            LevelData={level}
                          />
                        </ListCell>
                      )}
                      {columns.indexOf('Level name') !== -1 && (
                        <ListCell width={150}>{level.LongName}</ListCell>
                      )}
                      {columns.indexOf('Added by') !== -1 && (
                        <ListCell width={100}>
                          {level.KuskiData ? (
                            <Kuski kuskiData={level.KuskiData} />
                          ) : (
                            <div>{level.AddedByText || 'Unknown'}</div>
                          )}
                        </ListCell>
                      )}
                      {columns.indexOf('Best time') !== -1 && (
                        <ListCell width={100}>
                          {level.Besttime ? (
                            <Time time={level.Besttime} />
                          ) : (
                            '-'
                          )}
                        </ListCell>
                      )}
                      {loggedIn && columns.indexOf('My time') !== -1 && (
                        <ListCell width={100}>
                          {level.Mytime ? <Time time={level.Mytime} /> : '-'}
                        </ListCell>
                      )}
                      {columns.indexOf('Battles') !== -1 && (
                        <ListCell width={80}>
                          {level.BattleCount || '-'}
                        </ListCell>
                      )}
                      {columns.indexOf('Apples') !== -1 && (
                        <ListCell width={80}>{level.Apples}</ListCell>
                      )}
                      {columns.indexOf('Killers') !== -1 && (
                        <ListCell width={80}>{level.Killers}</ListCell>
                      )}
                      {columns.indexOf('Tags') !== -1 && (
                        <ListCell>
                          <Tags tags={getTags(level)} />
                        </ListCell>
                      )}
                    </ListRow>
                  );
                })
              )}
            </ListContainerScrollable>
          )}

          {showGrid() && (
            <CardGrid>
              {loadingLevels ? (
                <Loading />
              ) : (
                levels.rows.map(level => (
                  <LevelCard
                    key={level.LevelIndex}
                    level={level}
                    tags={getTags(level)}
                  />
                ))
              )}
            </CardGrid>
          )}
        </LevelContainer>
      </Container>
    </Root>
  );
}

const Root = styled.div`
  background: ${p => p.theme.pageBackground};
`;

const Container = styled.div`
  display: block;
  max-height: ${p => (p.small ? '243px' : 'auto')};
  overflow: ${p => (p.small ? 'auto' : 'visible')};
  a {
    color: ${p => p.theme.fontColor};
    :hover {
      color: ${p => p.theme.linkColor};
    }
  }
  padding: 0.5rem;
`;

const StickyContainer = styled(Paper)`
  position: ${p => (p.nonsticky ? 'relative' : 'sticky')};
  top: ${p => (p.nonsticky ? '0' : '52px')};
  padding: 1rem 0.25rem;
  margin: 0.5rem;
  z-index: 10;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;

  & > div:nth-child(2),
  & > div:nth-child(3) {
    grid-column: span 2;
  }
  padding: 12px;
`;

const LevelContainer = styled(Paper)`
  margin: 0.5rem;
`;

const StyledTextField = styled(TextField)`
  input {
    padding: 6px 0 !important;
  }
`;

const ListContainerScrollable = styled(ListContainer)`
  overflow: auto;
  background: ${p => p.theme.paperBackground};
  padding: 0.5rem;
  width: auto;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
  padding: 12px;
  background: ${p => p.theme.pageBackground};
`;

const SortPagination = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  padding-top: 3px;
  min-width: 473px;
  border-bottom: 0px;
  > * {
    padding-right: 10px;
  }
  td {
    padding: 0;
  }
  @media screen and (max-width: 900px) {
    min-width: auto;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-bottom: 10px;
`;
