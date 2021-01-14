import React from 'react';
import { Grid, Container, Box } from '@material-ui/core';
import { useStoreState } from 'easy-peasy';
import News from 'components/News';
import WelcomeCard from './cards/WelcomeCard';
import BattlesCard from './cards/BattlesCard';
import ReplaysCard from './cards/ReplaysCard';
import CurrentBattleCard from './cards/CurrentBattleCard';
import FeedCard from './cards/FeedCard';

export default function Home() {
  const { loggedIn } = useStoreState(state => state.Login);

  return (
    <Container>
      <Box py={3}>
        <Grid container spacing={3}>
          {!loggedIn && (
            <Grid container item xs={12} sm={12} spacing={3}>
              <Grid item xs={12}>
                <WelcomeCard />
              </Grid>
            </Grid>
          )}
          <Grid
            container
            item
            xs={12}
            sm={7}
            alignContent="flex-start"
            spacing={3}
          >
            <Grid item xs={12}>
              <BattlesCard />
            </Grid>
            <Grid item xs={12}>
              <ReplaysCard />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
            item
            xs={12}
            sm={5}
            alignContent="flex-start"
          >
            <Grid item xs={12}>
              <CurrentBattleCard />
            </Grid>
            <Grid item xs={12}>
              <FeedCard />
            </Grid>
            <Grid item xs={12}>
              <News amount={5} />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
