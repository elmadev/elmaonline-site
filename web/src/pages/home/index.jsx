import React from 'react';
import styled from '@emotion/styled';
import { Grid, Card as MuiCard } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { useStoreActions, useStoreState } from 'easy-peasy';
import CardContent from '@material-ui/core/CardContent';
import News from 'features/News';
import Layout from 'components/Layout';
import Button from 'components/Buttons';
import WelcomeCard from './cards/WelcomeCard';
import BattlesCard from './cards/BattlesCard';
import ReplaysCard from './cards/ReplaysCard';
import CurrentBattleCard from './cards/CurrentBattleCard';
import FeedCard from './cards/FeedCard';
import PacksCard from './cards/PacksCard';
import RankingCard from './cards/RankingCard';
import ExtrasCard from './cards/ExtrasCard';
import HighlightedCup from './cards/HighlightedCup';

export default function Home() {
  const { loggedIn } = useStoreState(state => state.Login);
  const {
    cards: { hidden },
  } = useStoreState(state => state.Page);
  const {
    cards: { setShown, setHidden },
  } = useStoreActions(actions => actions.Page);
  const isHidden = Object.keys(hidden).filter(h => hidden[h]);
  return (
    <Layout t="Home">
      <Grid container spacing={3}>
        <HighlightedCup />
        {!loggedIn && (
          <Grid container item xs={12}>
            <Grid item xs={12}>
              <WelcomeCard />
            </Grid>
          </Grid>
        )}
        <Grid container item sm={7} alignContent="flex-start" spacing={3}>
          {hidden.battles ? null : (
            <Grid item xs={12}>
              <BattlesCard />
            </Grid>
          )}
          {hidden.replays ? null : (
            <Grid item xs={12}>
              <ReplaysCard />
            </Grid>
          )}
          {hidden.ranking ? null : (
            <Grid item xs={12}>
              <RankingCard />
            </Grid>
          )}
          {isHidden.length > 0 ? (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  Show hidden sections:{' '}
                  {isHidden.map(section => (
                    <Button onClick={() => setShown(section)} naked little>
                      {section}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ) : null}
        </Grid>
        <Grid container spacing={3} item sm alignContent="flex-start">
          <CurrentBattleCard />
          {hidden.events ? null : <FeedCard />}
          {hidden.levelpacks ? null : <PacksCard />}
          {hidden.news ? null : (
            <Grid item xs={12}>
              <News
                amount={15}
                height={220}
                onCross={() => setHidden('news')}
              />
            </Grid>
          )}
          {hidden.extras ? null : (
            <Grid item xs={12}>
              <ExtrasCard />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}

export const Cross = styled(CancelIcon)`
  visibility: hidden;
  right: ${p => p.theme.padXSmall};
  top: ${p => p.theme.padXSmall};
  position: absolute;
  cursor: pointer;
`;

export const Card = styled(MuiCard)`
  position: relative;
  :hover {
    ${Cross} {
      visibility: visible;
    }
  }
`;
