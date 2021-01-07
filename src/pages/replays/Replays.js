import React from 'react';
import { Grid, Container, Box } from '@material-ui/core';
import ReplayList from 'components/ReplayList';
import Upload from 'components/Upload';

export default function Replays() {
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} sm={8}>
          <ReplayList showPagination />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box p={2}>
            <Upload filetype=".rec" />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
