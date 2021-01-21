import React from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import Link from 'components/Link';
import Header from 'components/Header';

const Links = () => {
  return (
    <Text>
      <Header h2>Community links</Header>
      <Grid>
        <Grid>
          <Link to="https://mopolauta.moposite.com/">
            mopolauta.moposite.com
          </Link>{' '}
          The community forums.
        </Grid>
        <Grid>
          <Link to="https://discord.gg/j5WMFC6">Elma discord</Link> Elma
          community discord.
        </Grid>
        <Grid>
          <Link to="http://wiki.elmaonline.net/">Elma wiki</Link> Elma wiki.
        </Grid>
        <Grid>
          <Link to="https://moposite.com/records_elma_wrs.php">
            World record table
          </Link>{' '}
          Current official internal world records.
        </Grid>
        <Grid>
          <Link to="https://moposite.com/">Moposite</Link> The heart of the
          community when it comes to web sites since 1998.
        </Grid>
        <Grid>
          <Link to="http://stats.sshoyer.net/">Elmastats</Link> A site made by
          jonsykkel dedicated to keep the community up to date with internal
          times, total times etc. You can also restore your old state.dat, find
          replays and much more.
        </Grid>
        <Grid>
          <Link to="http://kopasite.net/up">Kopasite.net/up</Link> A file
          uploading service hosted by Kopaka, if you ever need to upload an
          elma-related item to share with others.
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
