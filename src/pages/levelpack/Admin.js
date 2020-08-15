/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import DragHandle from '@material-ui/icons/DragHandle';
import TextField from '@material-ui/core/TextField';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ListCell, ListContainer, ListHeader } from 'styles/List';
import Loading from 'components/Loading';

const Admin = ({ records, LevelPack }) => {
  const [search, setSearch] = useState('');
  const { levelsFound, adminLoading } = useStoreState(state => state.LevelPack);
  const { deleteLevel, searchLevel, addLevel, sortLevel } = useStoreActions(
    actions => actions.LevelPack,
  );

  const onDragEnd = result => {
    if (
      result.destination &&
      result.destination.index !== result.source.index
    ) {
      sortLevel({
        LevelPackIndex: LevelPack.LevelPackIndex,
        levels: records,
        source: result.source,
        destination: result.destination,
        name: LevelPack.LevelPackName,
      });
    }
  };

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} md={6}>
        <h2>Current levels</h2>
        <ListContainer>
          <ListHeader>
            <ListCell width={70}>Filename</ListCell>
            <ListCell width={300}>Level name</ListCell>
            <ListCell width={180}>Remove</ListCell>
            <ListCell>Sort</ListCell>
          </ListHeader>
        </ListContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="levels">
            {provided => (
              <div
                style={{ position: 'relative' }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <ListContainer chin>
                  {records.map((l, index) => (
                    <Draggable
                      key={l.LevelIndex}
                      draggableId={`${l.LevelIndex}${l.Level.LevelName}`}
                      index={index}
                    >
                      {Dragprovided => (
                        <Row
                          key={`${l.LevelIndex}${l.Level.LevelName}`}
                          ref={Dragprovided.innerRef}
                          {...Dragprovided.draggableProps}
                          {...Dragprovided.dragHandleProps}
                        >
                          <ListCell width={70}>{l.Level.LevelName}</ListCell>
                          <ListCell width={300}>{l.Level.LongName}</ListCell>
                          <ListCell width={180}>
                            <Delete
                              onClick={() =>
                                deleteLevel({
                                  LevelIndex: l.LevelIndex,
                                  LevelPackIndex: LevelPack.LevelPackIndex,
                                  name: LevelPack.LevelPackName,
                                })
                              }
                            />
                          </ListCell>
                          <ListCell>
                            <DragHandle />
                          </ListCell>
                        </Row>
                      )}
                    </Draggable>
                  ))}
                </ListContainer>
                {adminLoading && (
                  <Overlay>
                    <Loading />
                  </Overlay>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Grid>
      <Grid item xs={12} md={6}>
        <h2>Search levels</h2>
        <TextBox>
          <TextField
            id="outlined-name"
            label="Filename"
            value={search}
            onChange={e => setSearch(e.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
            onKeyUp={e => {
              if (e.keyCode === 13) {
                if (e.target.value === '') {
                  setSearch('');
                } else if (search.length > 1) {
                  searchLevel({ q: search });
                }
              }
              if (e.keyCode === 27) {
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
          {levelsFound.map(l => (
            <Row key={l.LevelIndex}>
              <ListCell width={70}>{l.LevelName}</ListCell>
              <ListCell width={300}>{l.LongName}</ListCell>
              <ListCell width={180}>
                <Add
                  onClick={() =>
                    addLevel({
                      LevelIndex: l.LevelIndex,
                      LevelPackIndex: LevelPack.LevelPackIndex,
                      name: LevelPack.LevelPackName,
                      levels: records,
                    })
                  }
                />
              </ListCell>
            </Row>
          ))}
        </ListContainer>
      </Grid>
    </Grid>
  );
};

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
  color: inherit;
  background: ${p => (p.selected ? '#219653' : 'transparent')};
  color: ${p => (p.selected ? '#fff' : 'inherit')};
  :hover {
    background: ${p => (p.selected ? '#219653' : '#f9f9f9')};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
`;

export default Admin;
