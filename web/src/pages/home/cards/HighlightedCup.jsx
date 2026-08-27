import React from 'react';
import { useStoreState } from 'easy-peasy';
import { Grid } from '@material-ui/core';
import { CupCover } from 'pages/cup';
import Link from 'components/Link';

const HighlightedCup = () => {
  const [, cups] = useStoreState(state => state.Cup.onGoingCups);
  const highlightedCups = cups?.filter(cup => cup.Cover);
  if (!highlightedCups?.length > 0) {
    return null;
  }
  return (
    <Grid item xs={12}>
      <Link to={`/cup/${highlightedCups[0].ShortName}`}>
        <CupCover noBottomMargin cup={highlightedCups[0]} />
      </Link>
    </Grid>
  );
};

export default HighlightedCup;
