import React from 'react';
import CardContent from '@material-ui/core/CardContent';
import BattleList from 'features/BattleList';
import CardActions from '@material-ui/core/CardActions';
import Header from 'components/Header';
import Button from 'components/Buttons';
import { useStoreActions } from 'easy-peasy';
import { Card, Cross } from '../';

export default function BattlesCard() {
  const {
    cards: { setHidden },
  } = useStoreActions(actions => actions.Page);
  return (
    <Card>
      <span title="Hide section">
        <Cross onClick={() => setHidden('battles')} />
      </span>
      <CardContent>
        <Header h2>Latest Battles</Header>
        <BattleList limit={15} condensed latest height={260} />
      </CardContent>
      <CardActions>
        <Button to="/battles" naked little>
          Show more
        </Button>
      </CardActions>
    </Card>
  );
}
