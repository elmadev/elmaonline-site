import React from 'react';
import styled from 'styled-components';
import Header from 'components/Header';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    '& div': {
      lineHeight: '1.7em',
    },
  },
});

const EolFolder = () => {
  const classes = useStyles();
  return (
    <div>
      <Text>
        <Grid container direction="column" className={classes.container}>
          <Grid item>
            <Header h2>EOL Files</Header>
          </Grid>
          <Grid item>
            <Header h3>Folders</Header>
          </Grid>
          <Grid item>lev - Level folder</Grid>
          <Grid item>rec - Replay folder</Grid>
          <Grid item>bmp - The folder for custom shirts</Grid>
          <Grid item>lgr - Customize how the game looks</Grid>
          <Grid item>
            <Header h3>Files</Header>
          </Grid>
          <Grid item>eol.exe - The game executable</Grid>
          <Grid item>eolconf.exe - Online settings</Grid>
          <Grid item>startballe.exe - Start battles</Grid>
          <Grid item>elma.res - Original Elasto Mania resource list file</Grid>
          <Grid item>bs.dll - Online patch functionality</Grid>
          <Grid item>state.dat - Local internal time storage</Grid>
          <Grid item>
            stats.txt - Local internal times in a text file format
          </Grid>
          <Grid item>snp*****.pcx - Screenshot files</Grid>
          <Grid item>
            <Header h3>Useful additions</Header>
          </Grid>
          <Grid item>
            ddraw.dll - A useful library to make the game smoother
          </Grid>
          <Grid item>f_rate.inf - Check your in-game fps</Grid>
        </Grid>
      </Text>
    </div>
  );
};

const Text = styled.div`
  padding-left: 8px;
`;

export default EolFolder;
