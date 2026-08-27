import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, Checkbox, Grid } from '@material-ui/core';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Paper } from 'components/Paper';
import Field from 'components/Field';
import FieldBoolean from 'components/FieldBoolean';
import FieldAutoComplete from 'components/FieldAutoComplete';
import DerpTable from 'components/Table/DerpTable';
import useFormal from '@kevinwolf/formal-web';
import * as yup from 'yup';
import Kuski from 'components/Kuski';
import LocalTime from 'components/LocalTime';
import ClickToEdit from 'components/ClickToEdit';
import ClickToReveal from 'components/ClickToReveal';
import Feedback from 'components/Feedback';
import Header from 'components/Header';
import { points } from 'utils/cups';
import { format } from 'date-fns';
import { ListRow, ListCell } from 'components/List';

const schema = yup.object().shape({
  StartTime: yup.date().required(),
  StartHour: yup.number().min(0).max(23),
  EndTime: yup.date().required(),
  EndHour: yup.number().min(0).max(23),
  Designer: yup.string().max(15),
});

const Admin = () => {
  const { cup, lastCupShortName, events, updated, levelList } = useStoreState(
    state => state.Cup,
  );
  const {
    addEvent,
    editEvent,
    deleteEvent,
    generateEvent,
    setUpdated,
    findLevels,
  } = useStoreActions(actions => actions.Cup);
  const [error, setError] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [shown, setShown] = useState(false);
  const [positions, setPositions] = useState(false);
  const [appleResults, setAppleResults] = useState(false);

  useEffect(() => {
    setAppleResults(Boolean(cup.AppleResults));
  }, [cup]);

  const formal = useFormal(
    {},
    {
      schema,
      onSubmit: values =>
        addEvent({
          event: {
            ...values,
            LevelIndex: selectedLevel,
            ShownTimes: shown ? 1 : 0,
            AppleResults: appleResults ? 1 : 0,
            ShownPositions: positions ? 1 : 0,
          },
          last: lastCupShortName,
          CupGroupIndex: cup.CupGroupIndex,
        }),
    },
  );

  const editLevelIndex = (CupIndex, v) => {
    if (isNaN(v)) {
      setError('LevelIndex should be a number');
    } else {
      editEvent({
        CupIndex,
        event: { LevelIndex: v },
        CupGroupIndex: cup.CupGroupIndex,
        last: lastCupShortName,
      });
    }
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper padding>
            <Header h2>Add event</Header>
            <form {...formal.getFormProps()}>
              <FieldAutoComplete
                label="Level"
                list={levelList}
                getOptions={v => findLevels(v)}
                valueSelected={v => setSelectedLevel(v)}
              />
              <Field
                label="Start Date"
                {...formal.getFieldProps('StartTime')}
                date
              />
              <Field
                label="Start Hour"
                {...formal.getFieldProps('StartHour')}
              />
              <Field
                label="End Date"
                {...formal.getFieldProps('EndTime')}
                date
              />
              <Field label="End Hour" {...formal.getFieldProps('EndHour')} />
              <Field label="Designer" {...formal.getFieldProps('Designer')} />
              <FieldBoolean
                label="Shown times"
                value={shown}
                onChange={() => setShown(!shown)}
              />
              {shown ? null : (
                <FieldBoolean
                  label="Shown positions"
                  value={positions}
                  onChange={() => setPositions(!positions)}
                />
              )}
              <FieldBoolean
                label="Apple results"
                value={appleResults}
                onChange={() => setAppleResults(!appleResults)}
              />
              <Button variant="contained" onClick={() => formal.submit()}>
                Add
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper padding>
            <Header h2>How to add events</Header>
            <ol>
              <li>
                Play level in EOL locked (turn lock new levels on in
                eolconf.exe).
              </li>
              <li>
                Under add event search for the level name and select it in the
                dropdown.
              </li>
              <li>
                Then add start, deadline and designer, remember it&apos;s in
                server&apos;s timezone (UTC).
              </li>
            </ol>
          </Paper>
          <Paper padding top>
            <Header h2>Editing events</Header>
            <ul>
              <li>
                To edit Designer or LevelIndex click on it in the table below to
                enter edit mode, click outside to update.
              </li>
              <li>
                The results public checkbox makes no actual difference prior to
                the generating of results. It is meant for keeping results
                hidden after you generate if you wish to publish results
                somewhere else first, such as Discord.
              </li>
              <li>Shown times means times are visible during the event.</li>
              <li>
                Shown positions means that positions are shown in-game without
                times shown. Only relevant if shown times is off.
              </li>
              <li>
                When an event is over the first thing you do is click Generate
                Results. Now the results are visible to only you, and you can
                publish them in Discord or elsewhere first if you wish. When you
                want the results to be shown to everyone on the site, tick the
                public checkbox.
              </li>
              <li>
                Clicking Remove will delete the event from the cup and the
                results will no longer be part of the standings. Changing level
                index will not change results from past events.
              </li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
      <Paper padding top>
        <Header h2>Events</Header>
        <DerpTable
          headers={[
            'Designer',
            'Start',
            'End',
            'Public',
            'LevelIndex',
            'Actions',
            'Shown times',
            'Shown positions',
          ]}
          length={points.length}
        >
          {events.map(e => (
            <ListRow hover key={e.CupIndex}>
              <ListCell>
                <ClickToEdit
                  value={e.KuskiData ? e.KuskiData.Kuski : 'Unknown'}
                  update={v =>
                    editEvent({
                      CupIndex: e.CupIndex,
                      event: { Designer: v },
                      CupGroupIndex: cup.CupGroupIndex,
                      last: lastCupShortName,
                    })
                  }
                >
                  <Kuski noLink kuskiData={e.KuskiData} />
                </ClickToEdit>
              </ListCell>
              <ListCell>
                <LocalTime
                  date={e.StartTime}
                  format="eee d MMM yyyy HH:mm"
                  parse="X"
                />
              </ListCell>
              <ListCell>
                <LocalTime
                  date={e.EndTime}
                  format="eee d MMM yyyy HH:mm"
                  parse="X"
                />
              </ListCell>
              <ListCell>
                <CheckboxNoPad
                  checked={e.ShowResults === 1}
                  onChange={() =>
                    editEvent({
                      CupIndex: e.CupIndex,
                      event: { ShowResults: e.ShowResults ? 0 : 1 },
                      CupGroupIndex: cup.CupGroupIndex,
                      last: lastCupShortName,
                    })
                  }
                  value="ShowResults"
                />
              </ListCell>
              <ListCell>
                <ClickToReveal value={e.LevelIndex}>
                  <FieldAutoComplete
                    label="Level"
                    list={levelList}
                    getOptions={v => findLevels(v)}
                    valueSelected={v => editLevelIndex(e.CupIndex, v)}
                    margin="none"
                  />
                </ClickToReveal>
              </ListCell>
              <ListCell>
                {e.Updated === 0 && e.EndTime < format(new Date(), 't') && (
                  <Button
                    variant="contained"
                    onClick={() =>
                      generateEvent({
                        event: e,
                        last: lastCupShortName,
                        CupGroupIndex: cup.CupGroupIndex,
                      })
                    }
                  >
                    Generate
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={() =>
                    deleteEvent({
                      event: e,
                      last: lastCupShortName,
                      CupGroupIndex: cup.CupGroupIndex,
                    })
                  }
                >
                  Delete
                </Button>
              </ListCell>
              <ListCell>
                <CheckboxNoPad
                  checked={e.ShownTimes === 1}
                  onChange={() =>
                    editEvent({
                      CupIndex: e.CupIndex,
                      event: { ShownTimes: e.ShownTimes === 1 ? 0 : 1 },
                      CupGroupIndex: cup.CupGroupIndex,
                      last: lastCupShortName,
                    })
                  }
                  value="ShownTimes"
                />
              </ListCell>
              <ListCell>
                {e.ShownTimes === 1 ? null : (
                  <CheckboxNoPad
                    checked={e.ShownTimes === 2}
                    onChange={() =>
                      editEvent({
                        CupIndex: e.CupIndex,
                        event: { ShownTimes: e.ShownTimes ? 0 : 2 },
                        CupGroupIndex: cup.CupGroupIndex,
                        last: lastCupShortName,
                      })
                    }
                    value="ShownPositions"
                  />
                )}
              </ListCell>
            </ListRow>
          ))}
        </DerpTable>
      </Paper>
      <Feedback
        open={error !== ''}
        text={error}
        type="error"
        close={() => setError('')}
      />
      <Feedback
        open={updated !== ''}
        text={updated}
        type="success"
        close={() => setUpdated('')}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 8px;
`;

const CheckboxNoPad = styled(Checkbox)`
  && {
    padding: 0;
  }
`;

export default Admin;
