/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import styled from 'styled-components';
import { nickId } from 'utils/nick';
import { TextField, Button, Grid } from '@material-ui/core';
import { Paper } from 'styles/Paper';
import DerpTable from 'components/Table/DerpTable';
import Header from 'components/Header';
import { ListRow, ListCell } from 'styles/List';
import { points } from 'utils/cups';

const RulesInfo = props => {
  const { description, owner, updateDesc } = props;
  const [edit, openEdit] = useState(false);
  const [editDesc, setEditDesc] = useState('');

  const save = () => {
    openEdit(false);
    updateDesc(editDesc);
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Header h2>Cup description</Header>
          <Paper>
            <Text dangerouslySetInnerHTML={{ __html: description }} />
            {owner.length > 0 && owner.indexOf(nickId()) > -1 && (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    openEdit(!edit);
                    setEditDesc(description);
                  }}
                >
                  Edit
                </Button>
                {edit && (
                  <>
                    <TextField
                      id="outlined-name"
                      label="Edit description"
                      value={editDesc}
                      onChange={e => setEditDesc(e.target.value)}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      multiline
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => save()}
                    >
                      Save
                    </Button>
                  </>
                )}
              </>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Header h2>How to play cups</Header>
          <Paper>
            <Text>
              If you want to participate in a cup, the only thing you have to do
              is to play the level of the current event online in EOL. Your time
              will automatically be added to the results once the event deadline
              is over. However if you win the event or the specific cup requires
              replays it is required that you also upload your replay. You can
              upload replays during the event from the cup page, which is
              recommended even if you don&apos;t think you are going to win, so
              that others can see different styles etc. Uploaded replays
              won&apos;t be shared until the over. If you win and haven&apos;t
              yet uploaded your replay, you have 24 hours after the deadline to
              do so. All deadlines are shown in your local timezone.
            </Text>
          </Paper>
          <Header h2 top>
            Hiding of times
          </Header>
          <Paper>
            <Text>
              During an event the given level will have its &quot;Hidden&quot;
              flag turned on. This means that the shift+F5 (Best Times) list is
              disabled and times are not shown on EOL site either for that
              level. The times will still show on F7 (Recent Times) list, unless
              you drive hidden (Shift+F1) in which case your times are not shown
              on F7. Note that your times will still be visible on F7 to
              yourself, but they are not shown to others if you are hidden. If
              you are shown only to team, team members can see times on F7 etc.
              tl:dr version: Play hidden and others won&apos;t see your times
              anywhere.
            </Text>
          </Paper>
          <Header h2 top>
            Points awarded
          </Header>
          <DerpTable headers={['#', 'Points']} length={points.length}>
            {points.map((p, no) => (
              <ListRow key={p}>
                <ListCell>{no + 1}.</ListCell>
                <ListCell right>
                  {p} point{p > 1 ? 's' : ''}
                </ListCell>
              </ListRow>
            ))}
            <ListRow hover key="51">
              <ListCell>51...</ListCell>
              <ListCell right>1 point</ListCell>
            </ListRow>
          </DerpTable>
        </Grid>
      </Grid>
    </Container>
  );
};

const Container = styled.div`
  padding: 8px;
`;

const Text = styled.div`
  margin-bottom: 8px;
  padding: 8px;
`;

export default RulesInfo;
