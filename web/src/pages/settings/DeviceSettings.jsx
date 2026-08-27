import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Column } from 'components/Containers';
import { Grid } from '@material-ui/core';
import { Paper } from 'components/Paper';
import { TextField } from '@material-ui/core';

const SetZoomScale = () => {
  const { zoomScale } = useStoreState(
    actions => actions.ReplaySettings.settings,
  );
  const { setZoomScale } = useStoreActions(actions => actions.ReplaySettings);

  return (
    <TextField
      type="number"
      label="Replay Viewer Scale %"
      value={zoomScale}
      onChange={e => setZoomScale(e.target.value)}
      margin="normal"
      variant="outlined"
      fullWidth
    />
  );
};

const DeviceSettings = () => {
  return (
    <Grid container spacing={2}>
      <Grid item sm={6} xs={12}>
        <Paper padding width="auto">
          <Column>
            <SetZoomScale />
          </Column>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DeviceSettings;
