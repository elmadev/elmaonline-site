import React from 'react';
import { Grid, CardContent, CardActions, Button } from '@material-ui/core';
import LevelPackList from 'features/LevelPackList';
import Link from 'components/Link';
import Header from 'components/Header';
import { useStoreActions } from 'easy-peasy';
import { Card, Cross } from '../';

export default function PacksCard() {
  const {
    cards: { setHidden },
  } = useStoreActions(actions => actions.Page);
  return (
    <Grid item xs={12}>
      <Card>
        <span title="Hide section">
          <Cross onClick={() => setHidden('levelpacks')} />
        </span>
        <CardContent>
          <Header h2>New Level Packs</Header>
          <LevelPackList amount={10} height={200} />
        </CardContent>
        <CardActions>
          <Button size="small" color="primary">
            <Link to="/levels">Show all</Link>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
