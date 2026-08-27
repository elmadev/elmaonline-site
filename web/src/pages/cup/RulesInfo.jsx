import React, { useState } from 'react';
import styled from '@emotion/styled';
import { nickId } from 'utils/nick';
import { TextField, Button, Grid } from '@material-ui/core';
import { Paper } from 'components/Paper';
import DerpTable from 'components/Table/DerpTable';
import Header from 'components/Header';
import { ListRow, ListCell } from 'components/List';
import { points, pointsSystem2, pts } from 'utils/cups';

const RulesInfo = props => {
  const { description, owner, updateDesc, cup } = props;
  const [edit, openEdit] = useState(false);
  const [editDesc, setEditDesc] = useState('');

  const save = () => {
    openEdit(false);
    updateDesc(editDesc);
  };

  const ptsSystem = cup.PointSystem === 1 ? pointsSystem2 : points;

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper padding>
            <Header h2>Cup description</Header>
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
          <Paper padding>
            <Header h2>How to play cups</Header>
            <Text>
              If you want to participate in a cup, the only thing you have to do
              is to play the level of the current event online in EOL. Your time
              will automatically be added to the results once the event deadline
              is over. Cup replays are saved automatically, so you won't need to
              upload your replay. However, in rare cases the automatic saving of
              recs may fail, in which case you can use the Cup dashboard to
              upload the replay afterwards. You can also use it to share replays
              with your team. All deadlines are shown in your local timezone.
            </Text>
          </Paper>
          <Paper padding top>
            <Header h2>Hiding of times and players</Header>
            <Text>
              During an event the given level will have its &quot;Hidden&quot;
              flags turned on. This means that the shift+F5 (Best Times) list is
              disabled, and times are not shown on EOL site either for that
              level. Your times will still be visible on F7 (Finished Times) to
              yourself, and to your team unless you drive hidden (shift+F1), but
              never to others. Others can't spy you in the level either, except
              your team members if you are not hidden (shift+F1). tl;dr version:
              Team members can see you and your times unless you are hidden,
              others can never see you or your times.
            </Text>
          </Paper>
          <Paper padding top>
            <Header h2>Points awarded</Header>
            <DerpTable headers={['#', 'Points']} length={ptsSystem.length}>
              {ptsSystem.map((p, no) => (
                <ListRow key={p}>
                  <ListCell>{no + 1}.</ListCell>
                  <ListCell right>{pts(p * 10)}</ListCell>
                </ListRow>
              ))}
              {cup.PointSystem === 1 ? (
                <>
                  <ListRow hover key="51">
                    <ListCell>51...</ListCell>
                    <ListCell right>above minus 0.1 points</ListCell>
                  </ListRow>
                  <ListRow hover key="100">
                    <ListCell>100...</ListCell>
                    <ListCell right>1 point</ListCell>
                  </ListRow>
                </>
              ) : (
                <ListRow hover key="51">
                  <ListCell>51...</ListCell>
                  <ListCell right>1 point</ListCell>
                </ListRow>
              )}
            </DerpTable>
          </Paper>
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
`;

export default RulesInfo;
