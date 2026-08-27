import React from 'react';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Header from 'components/Header';
import Button from 'components/Buttons';
import RankingTable from 'features/RankingTable';
import { formatPeriod } from 'pages/ranking';
import { format } from 'date-fns';
import { useStoreActions } from 'easy-peasy';
import { Card, Cross } from '../';

export default function RankingCard() {
  const {
    cards: { setHidden },
  } = useStoreActions(actions => actions.Page);
  return (
    <Card>
      <span title="Hide section">
        <Cross onClick={() => setHidden('ranking')} />
      </span>
      <CardContent>
        <Header h2>
          Battle Ranking {format(new Date(), 'MMMM')} {new Date().getFullYear()}
        </Header>
        <RankingTable
          battleType="All"
          minPlayed={2}
          tableIndex="RankingMonthlyIndex"
          periodType="month"
          period={formatPeriod(
            'month',
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0,
            new Date().getDay() - 1,
          )}
          fixedHeight={200}
        />
      </CardContent>
      <CardActions>
        <Button to="/ranking" naked little>
          Show more
        </Button>
      </CardActions>
    </Card>
  );
}
