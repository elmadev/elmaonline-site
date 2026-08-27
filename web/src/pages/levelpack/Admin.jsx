import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
} from '@material-ui/core';
import styled from '@emotion/styled';
import {
  Delete as DeleteIcon,
  PlaylistAdd,
  DragHandle,
  ExpandMore,
} from '@material-ui/icons';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Link from 'components/Link';
import Header from 'components/Header';
import UpdateForm from './UpdateForm';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ListCell, ListContainer, ListHeader } from 'components/List';
import { Row as ContainerRow } from 'components/Containers';
import Button from 'components/Buttons';

const SortableItem = ({
  level,
  updateLevel,
  deleteLevel,
  levelPackInfo,
  showLegacy,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${level.LevelIndex}${level.LevelName}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Row ref={setNodeRef} style={style} {...attributes}>
      <ListCell width={70}>{level.LevelName}</ListCell>
      <ListCell width={300}>{level.LongName}</ListCell>
      <ListCell width={120}>
        <CheckboxCon>
          <Checkbox
            checked={Boolean(level.ExcludeFromTotal)}
            onChange={e =>
              updateLevel({
                LevelPackLevelIndex: level.LevelPackLevelIndex,
                ExcludeFromTotal: e.target.checked ? 1 : 0,
                name: levelPackInfo.LevelPackName,
              })
            }
          />
        </CheckboxCon>
      </ListCell>
      <ListCell width={180}>
        <Delete
          onClick={() =>
            deleteLevel({
              LevelIndex: level.LevelIndex,
              LevelPackIndex: levelPackInfo.LevelPackIndex,
              name: levelPackInfo.LevelPackName,
              showLegacy,
            })
          }
        />
      </ListCell>
      <ListCell>
        <DragCon {...listeners}>
          <DragHandle />
        </DragCon>
      </ListCell>
    </Row>
  );
};

const Admin = () => {
  const [search, setSearch] = useState('');
  const [sortedLevels, setSortedLevels] = useState(null);
  const {
    levelsFound,
    adminLoading,
    settings: { showLegacy },
    levelPackInfo,
  } = useStoreState(state => state.LevelPack);
  const { deleteLevel, searchLevel, addLevel, sortPack, updateLevel } =
    useStoreActions(actions => actions.LevelPack);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragEnd = event => {
    const { active, over } = event;

    if (!active || !over) {
      return;
    }
    if (active.id !== over.id) {
      const currentLevels = sortedLevels || levelPackInfo.levels;
      const oldIndex = currentLevels.findIndex(
        level => `${level.LevelIndex}${level.LevelName}` === active.id,
      );
      const newIndex = currentLevels.findIndex(
        level => `${level.LevelIndex}${level.LevelName}` === over.id,
      );

      // enter sorting mode on first drag
      if (sortedLevels === null) {
        setSortedLevels([...levelPackInfo.levels]);
      }

      // update the local sorted levels array using arrayMove
      const newSortedLevels = arrayMove(currentLevels, oldIndex, newIndex);
      setSortedLevels(newSortedLevels);
    }
  };

  const handleSaveSorting = () => {
    const levelOrder = sortedLevels.map(level => level.LevelIndex);
    sortPack({
      LevelPackIndex: levelPackInfo.LevelPackIndex,
      levelOrder,
      name: levelPackInfo.LevelPackName,
      showLegacy,
    });
    setSortedLevels(null);
  };

  const handleCancelSorting = () => {
    setSortedLevels(null);
  };

  const isAlreadyAdded = level => {
    if (level.Locked) {
      return 'Level is locked.';
    }
    if (level.Hidden) {
      return 'Level is hidden.';
    }
    const find = levelPackInfo.levels.filter(
      l => l.LevelIndex === level.LevelIndex,
    );
    if (find.length) {
      return 'Level is already added to pack.';
    }
    return '';
  };

  const levels = sortedLevels !== null ? sortedLevels : levelPackInfo?.levels;

  return (
    <Grid container spacing={3} style={{ padding: '0 8px' }}>
      <Grid item xs={12} md={6}>
        <Header h2 mLeft top>
          Current levels
        </Header>
        {sortedLevels !== null && (
          <SortingModeContainer>
            You are currently sorting levels, continue sorting until you're
            satisfied and click save when you're done. If you don't click save
            the sorting will be discarded.
            <ContainerRow t={2}>
              <Button onClick={handleSaveSorting} right={1}>
                Save
              </Button>
              <Button onClick={handleCancelSorting} naked>
                Cancel
              </Button>
            </ContainerRow>
          </SortingModeContainer>
        )}
        <ListContainer>
          <ListHeader>
            <ListCell width={70}>Filename</ListCell>
            <ListCell width={300}>Level name</ListCell>
            <ListCell width={120}>Exclude From Total</ListCell>
            <ListCell width={180}>Remove</ListCell>
            <ListCell>Sort</ListCell>
          </ListHeader>
        </ListContainer>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <div style={{ position: 'relative' }}>
            <SortableContext
              items={levels?.map(l => `${l.LevelIndex}${l.LevelName}`) || []}
              strategy={verticalListSortingStrategy}
            >
              <ListContainer chin>
                {levels?.map(l => (
                  <SortableItem
                    key={`${l.LevelIndex}${l.LevelName}`}
                    level={l}
                    updateLevel={updateLevel}
                    deleteLevel={deleteLevel}
                    levelPackInfo={levelPackInfo}
                    showLegacy={showLegacy}
                  />
                ))}
              </ListContainer>
            </SortableContext>
            {adminLoading && <Overlay />}
          </div>
        </DndContext>
      </Grid>
      <Grid item xs={12} md={6}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Header h2 mLeft>
              Edit Level Pack Details
            </Header>
          </AccordionSummary>
          <AccordionDetails>
            <UpdateForm />
          </AccordionDetails>
        </Accordion>
        <br />
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Header h2 mLeft>
              Search Levels
            </Header>
          </AccordionSummary>
          <AccordionDetails style={{ display: 'block' }}>
            <TextBox>
              <TextField
                id="outlined-name"
                label="Filename"
                value={search}
                onChange={e => setSearch(e.target.value)}
                margin="normal"
                variant="outlined"
                fullWidth
                helperText="Enter to search"
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    if (e.target.value === '') {
                      setSearch('');
                    } else if (search.length > 1) {
                      searchLevel({
                        q: encodeURIComponent(search),
                        ShowLocked: 0,
                      });
                    }
                  }
                  if (e.key === 'Escape') {
                    setSearch('');
                  }
                }}
              />
            </TextBox>
            <ListContainer>
              <ListHeader>
                <ListCell width={70}>Filename</ListCell>
                <ListCell width={300}>Level name</ListCell>
                <ListCell width={180}>Add</ListCell>
              </ListHeader>
              {levelsFound.map(l => {
                const title = isAlreadyAdded(l);
                return (
                  <Row key={l.LevelIndex}>
                    <ListCell title={title} width={70}>
                      <Link to={`/levels/${l.LevelIndex}`}>{l.LevelName}</Link>
                    </ListCell>
                    <ListCell title={title} width={300}>
                      {l.LongName}
                    </ListCell>
                    <ListCell title={title} width={180}>
                      {!isAlreadyAdded(l) && (
                        <Add
                          onClick={() =>
                            addLevel({
                              LevelIndex: l.LevelIndex,
                              LevelPackIndex: levelPackInfo.LevelPackIndex,
                              name: levelPackInfo.LevelPackName,
                              levels: levelPackInfo.levels.length,
                              last: levelPackInfo.levels[
                                levelPackInfo.levels.length - 1
                              ],
                              showLegacy,
                            })
                          }
                        />
                      )}
                    </ListCell>
                  </Row>
                );
              })}
            </ListContainer>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

const CheckboxCon = styled.span`
  .MuiButtonBase-root {
    padding: 0;
  }
`;

const DragCon = styled.span`
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

const Overlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: white;
  z-index: 10;
  opacity: 0.8;
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

const TextBox = styled.div`
  margin: 8px;
`;

const Delete = styled(DeleteIcon)`
  cursor: pointer;
`;

const Add = styled(PlaylistAdd)`
  cursor: pointer;
`;

const Row = styled.div`
  display: table-row;
  background: transparent;
  :hover {
    background: ${p => p.theme.hoverColor};
  }
`;

const SortingModeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.padSmall};
  margin: ${p => p.theme.padSmall};
  padding: ${p => p.theme.padSmall};
  border-radius: ${p => p.theme.padXSmall};
  background-color: ${p => p.theme.primaryAlpha};
  border: 1px solid ${p => p.theme.primaryAlpha3};
`;

export default Admin;
