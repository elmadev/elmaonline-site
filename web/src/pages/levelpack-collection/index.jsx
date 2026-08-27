import React, { useState, useEffect } from 'react';
import Layout, { Content } from 'components/Layout';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Tabs, Tab } from '@material-ui/core';
import Header from 'components/Header';
import Kuski from 'components/Kuski';
import { Delete as DeleteIcon, PlaylistAdd } from '@material-ui/icons';
import { Grid, TextField } from '@material-ui/core';
import { ListRow, ListCell, ListContainer, ListHeader } from 'components/List';
import Link from 'components/Link';
import styled from '@emotion/styled';
import { nickId, mod } from 'utils/nick';
import { useParams } from '@tanstack/react-router';

const LevelpackCollection = () => {
  const { name } = useParams({ strict: false });
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const { packs, collection, packsFound } = useStoreState(
    state => state.LevelpackCollection,
  );
  const { getCollection, searchPack, addPack, deletePack } = useStoreActions(
    actions => actions.LevelpackCollection,
  );

  useEffect(() => {
    getCollection(name);
  }, []);

  const isAlreadyAdded = packId => {
    const find = packs.filter(l => l.LevelPackIndex === packId);
    return find.length;
  };

  return (
    <Layout edge t={`Levelpack collection - ${name}`}>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(e, t) => setTab(t)}
      >
        <Tab label="Packs" />
        {(nickId() === collection.KuskiIndex || mod()) && <Tab label="Admin" />}
      </Tabs>
      <Content>
        <Header h2>
          {collection.CollectionName} - {collection.CollectionLongName}
        </Header>
        <div>
          Maintainer: <Kuski kuskiData={collection.KuskiData} />
        </div>
      </Content>
      {(tab === 0 || tab === 1) && (
        <Grid container spacing={0}>
          <Grid item xs={12} md={tab === 1 ? 6 : 12}>
            <ListContainer>
              <ListHeader>
                <ListCell width={100}>Short Name</ListCell>
                <ListCell width={300}>Long Name</ListCell>
                {tab === 0 && <ListCell>Description</ListCell>}
                {tab === 1 && <ListCell>Delete</ListCell>}
              </ListHeader>
              {packs.map(p => (
                <ListRow key={p.LevelPackCollectionPackIndex}>
                  <ListCell>
                    <Link to={`/levels/packs/${p.PackData.LevelPackName}`}>
                      {p.PackData.LevelPackName}
                    </Link>
                  </ListCell>
                  <ListCell>
                    <Link to={`/levels/packs/${p.PackData.LevelPackName}`}>
                      {p.PackData.LevelPackLongName}
                    </Link>
                  </ListCell>
                  {tab === 0 && <ListCell>{p.PackData.LevelPackDesc}</ListCell>}
                  {tab === 1 && (
                    <ListCell>
                      <Delete
                        onClick={() =>
                          deletePack({
                            LevelPackCollectionIndex:
                              collection.LevelPackCollectionIndex,
                            LevelPackIndex: p.PackData.LevelPackIndex,
                            name,
                          })
                        }
                      />
                    </ListCell>
                  )}
                </ListRow>
              ))}
            </ListContainer>
          </Grid>
          {tab === 1 && (nickId() === collection.KuskiIndex || mod()) && (
            <Grid item xs={12} md={6}>
              <Header h3>Search packs</Header>
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
                    if (e.key === 'Enter') {
                      if (e.target.value === '') {
                        setSearch('');
                      } else if (search.length > 1) {
                        searchPack(search);
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
                  <ListCell width={70}>Short Name</ListCell>
                  <ListCell width={300}>Long name</ListCell>
                  <ListCell width={180}>Add</ListCell>
                </ListHeader>
                {packsFound.map(l => (
                  <ListRow
                    color={isAlreadyAdded(l.LevelPackIndex)}
                    key={l.LevelPackIndex}
                  >
                    <ListCell width={70}>
                      <Link to={`/levels/packs/${l.LevelPackName}`}>
                        {l.LevelPackName}
                      </Link>
                    </ListCell>
                    <ListCell width={300}>{l.LevelPackLongName}</ListCell>
                    <ListCell width={180}>
                      {!isAlreadyAdded(l.LevelPackIndex) && (
                        <Add
                          onClick={() =>
                            addPack({
                              LevelPackCollectionIndex:
                                collection.LevelPackCollectionIndex,
                              LevelPackIndex: l.LevelPackIndex,
                              name,
                            })
                          }
                        />
                      )}
                    </ListCell>
                  </ListRow>
                ))}
              </ListContainer>
            </Grid>
          )}
        </Grid>
      )}
    </Layout>
  );
};

const TextBox = styled.div`
  margin: 8px;
`;

const Delete = styled(DeleteIcon)`
  cursor: pointer;
`;

const Add = styled(PlaylistAdd)`
  cursor: pointer;
`;

export default LevelpackCollection;
