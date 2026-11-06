import React from 'react';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Column } from 'components/Containers';
import { Grid } from '@mui/material';
import { Paper } from 'components/Paper';
import { TextField } from '@mui/material';
import { Dropdown } from 'components/Inputs';
import FieldBoolean from 'components/FieldBoolean';

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

const ChatSettings = () => {
  const { corner, hideOnline } = useStoreState(
    state => state.Messages.settings,
  );
  const { setCorner, setHideOnline } = useStoreActions(
    actions => actions.Messages,
  );

  return (
    <ChatSettingsCon>
      <Dropdown
        name="Chat box position"
        options={[
          ['right', 'Bottom right'],
          ['left', 'Bottom left'],
        ]}
        selected={corner}
        update={setCorner}
      />
      <CheckboxRow>
        <FieldBoolean
          label="Hide my online status on this device"
          value={hideOnline}
          onChange={() => setHideOnline(!hideOnline)}
        />
      </CheckboxRow>
    </ChatSettingsCon>
  );
};

const ChatSettingsCon = styled.div`
  padding-top: ${p => p.theme.padMedium};
`;

// the dropdown is inset 10px and mui pulls checkboxes 2px left of their
// container, so this lines the checkbox up with the dropdown
const CheckboxRow = styled.div`
  margin-top: ${p => p.theme.padMedium};
  padding: 0 10px 0 12px;
`;

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
      <Grid item sm={6} xs={12}>
        <Paper padding width="auto">
          <Column>
            <ChatSettings />
          </Column>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DeviceSettings;
