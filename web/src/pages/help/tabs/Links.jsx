import React from 'react';
import styled from '@emotion/styled';
import { Grid } from '@material-ui/core';
import Header from 'components/Header';

const Links = ({ hideHeader = false }) => {
  return (
    <Text>
      {hideHeader ? null : <Header h2>Community links</Header>}
      <Grid>
        <Grid>
          <a href="https://mopolauta.moposite.com/">mopolauta.moposite.com</a>{' '}
          The community forums.
        </Grid>
        <Grid>
          <a href="https://discord.gg/j5WMFC6">Elma discord</a> Elma community
          discord.
        </Grid>
        <Grid>
          <a href="http://wiki.elmaonline.net/">Elma wiki</a> Elasto Mania and
          EOL wiki.
        </Grid>
        <Grid>
          <a href="https://moposite.com/records_elma_wrs.php">
            World record table
          </a>{' '}
          Current official internal world records.
        </Grid>
        <Grid>
          <a href="https://moposite.com/">Moposite</a> The heart of the
          community when it comes to web sites since 1998.
        </Grid>
        <Grid>
          <a href="https://stats.elma.online/">Elmastats</a> A site made by
          jonsykkel dedicated to keep the community up to date with internal
          times, total times etc. You can also restore your old state.dat, find
          replays and much more.
        </Grid>
      </Grid>
    </Text>
  );
};

const Text = styled.div`
  padding-left: 8px;
  max-width: 900px;
`;

export default Links;
