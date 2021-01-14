import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ReplayList from 'components/ReplayList';
import Link from 'components/Link';

export default function ReplaysCard() {
  return (
    <Card>
      <CardHeader title="Latest Replays" />
      <CardContent>
        <ReplayList
          defaultPage={0}
          defaultPageSize={5}
          showPagination={false}
        />
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          <Link to="/replays">Show more</Link>
        </Button>
      </CardActions>
    </Card>
  );
}
