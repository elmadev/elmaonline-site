import React, { useEffect, useState } from 'react';
import DerpTable from 'components/Table/DerpTable';
import { ListRow, ListCell } from 'components/List';
import { Grid } from '@material-ui/core';
import styled from '@emotion/styled';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import { Level } from 'components/Names';
import Header from 'components/Header';
import { useStoreState, useStoreActions } from 'easy-peasy';

const LatestTimes = ({ KuskiIndex }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pagePR, setPagePR] = useState(0);
  const [rowsPerPagePR, setRowsPerPagePR] = useState(10);
  const { latestTimes, latestPRs } = useStoreState(state => state.Kuski);
  const { getLatest } = useStoreActions(actions => actions.Kuski);
  useEffect(() => {
    getLatest({ KuskiIndex, limit: 100 });
  }, [KuskiIndex]);

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} md={6}>
        <Container>
          <Header h2>Latest finishes</Header>
        </Container>
        {latestTimes.length > 0 && (
          <DerpTable
            headers={['Level', 'Time', 'Driven']}
            length={latestTimes.length}
            pagination
            onChangePage={nextPage => setPage(nextPage)}
            onChangeRowsPerPage={rows => {
              setPage(0);
              setRowsPerPage(rows);
            }}
          >
            {latestTimes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(r => (
                <ListRow key={`${r.LevelIndex}${r.Driven}`}>
                  <ListCell>
                    <Level LevelIndex={r.LevelIndex} LevelData={r.LevelData} />
                  </ListCell>
                  <ListCell>
                    <Time time={r.Time} />
                  </ListCell>
                  <ListCell>
                    <LocalTime
                      date={r.Driven}
                      format="eee d MMM yyyy HH:mm:ss"
                      parse="X"
                    />
                  </ListCell>
                </ListRow>
              ))}
          </DerpTable>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <Container>
          <Header h2>Latest PRs</Header>
        </Container>
        {latestPRs.length > 0 && (
          <DerpTable
            headers={['Level', 'Time', 'Driven']}
            length={latestPRs.length}
            pagination
            onChangePage={nextPage => setPagePR(nextPage)}
            onChangeRowsPerPage={rows => {
              setPagePR(0);
              setRowsPerPagePR(rows);
            }}
          >
            {latestPRs
              .slice(
                pagePR * rowsPerPagePR,
                pagePR * rowsPerPagePR + rowsPerPagePR,
              )
              .map(r => (
                <ListRow key={`${r.LevelIndex}${r.Time}`}>
                  <ListCell>
                    <Level LevelIndex={r.LevelIndex} LevelData={r.LevelData} />
                  </ListCell>
                  <ListCell>
                    <Time time={r.Time} />
                  </ListCell>
                  <ListCell>
                    <LocalTime
                      date={r.Driven}
                      format="eee d MMM yyyy HH:mm:ss"
                      parse="X"
                    />
                  </ListCell>
                </ListRow>
              ))}
          </DerpTable>
        )}
      </Grid>
    </Grid>
  );
};

const Container = styled.div`
  margin: 8px;
`;

export default LatestTimes;
