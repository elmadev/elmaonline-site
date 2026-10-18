import React from 'react';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import ReplayList from 'features/ReplayList';
import Link from 'components/Link';
import { useStoreActions } from 'easy-peasy';
import Header from 'components/Header';
import { Card, Cross } from '../';

export default function ReplaysCard() {
  const {
    cards: { setHidden },
  } = useStoreActions(actions => actions.Page);
  return (
    <Card>
      <span title="Hide section">
        <Cross onClick={() => setHidden('replays')} />
      </span>
      <CardContent>
        <Header h2>Latest Replays</Header>
        <ReplayList defaultPage={0} defaultPageSize={20} summary />
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          <Link to="/replays">Show more</Link>
        </Button>
        <Button size="small" color="primary" style={{ marginLeft: 'auto' }}>
          <Link to="/replays/upload">Upload</Link>
        </Button>
      </CardActions>
    </Card>
  );
}
