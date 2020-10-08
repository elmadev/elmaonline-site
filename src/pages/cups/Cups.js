import React, { useEffect, Fragment } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Typography, Grid } from '@material-ui/core';
import styled from 'styled-components';
import Link from 'components/Link';
import AddCup from 'components/AddCup';

const Cups = () => {
  const { cupList, addSuccess } = useStoreState(state => state.Cups);
  const { getCups, addCup } = useStoreActions(actions => actions.Cups);

  useEffect(() => {
    getCups();
  }, []);

  if (!cupList) {
    return null;
  }

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <Typography variant="h3" gutterBottom>
            Ongoing Cups
          </Typography>
          {cupList
            .filter(c => c.Finished === 0)
            .map(c => (
              <Fragment key={c.ShortName}>
                <Link to={`cup/${c.ShortName}`}>
                  <CupName>{c.CupName}</CupName>
                </Link>
                <Description
                  dangerouslySetInnerHTML={{ __html: c.Description }}
                />
              </Fragment>
            ))}
          <Typography variant="h3" gutterBottom>
            Finished Cups
          </Typography>
          {cupList
            .filter(c => c.Finished === 1)
            .map(c => (
              <Fragment key={c.ShortName}>
                <Link to={`cup/${c.ShortName}`}>
                  <CupName>{c.CupName}</CupName>
                </Link>
                <Description
                  dangerouslySetInnerHTML={{ __html: c.Description }}
                />
              </Fragment>
            ))}
        </Grid>
        <Grid item xs={12} sm={5}>
          <Typography variant="h3" gutterBottom>
            Create new cup
          </Typography>
          {addSuccess === '' ? (
            <AddCup add={data => addCup(data)} />
          ) : (
            <div>Cup {addSuccess} has been created successfully.</div>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const CupName = styled.div`
  font-weight: 500;
  color: #219653;
`;

const Description = styled.div`
  font-size: 13px;
  padding-bottom: 12px;
`;

export default Cups;
