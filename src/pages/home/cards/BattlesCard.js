import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import BattleList from 'components/BattleList';
import subYears from 'date-fns/subYears';
import addHours from 'date-fns/addHours';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Link from 'components/Link';

export default function BattlesCard() {
  return (
    <Card>
      <CardHeader title="Latest Battles" />
      <CardContent>
        <BattleList
          start={subYears(new Date(), 1)}
          end={addHours(new Date(), 12)}
          limit={5}
        />
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          <Link to="/battles">Show more</Link>
        </Button>
      </CardActions>
    </Card>
  );
}
