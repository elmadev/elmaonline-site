/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { Paper } from 'styles/Paper';
import Field from 'components/Field';
import Checkbox from '@material-ui/core/Checkbox';
import DerpTable from 'components/Table/DerpTable';
import Grid from '@material-ui/core/Grid';
import useFormal from '@kevinwolf/formal-web';
import * as yup from 'yup';
import Kuski from 'components/Kuski';
import LocalTime from 'components/LocalTime';
import ClickToEdit from 'components/ClickToEdit';
import Feedback from 'components/Feedback';
import Header from 'components/Header';
import { points } from 'utils/cups';
import { format } from 'date-fns';
import { ListRow, ListCell } from 'styles/List';

const schema = yup.object().shape({
  LevelIndex: yup.number().min(1),
  StartTime: yup.date().required(),
  StartHour: yup
    .number()
    .min(0)
    .max(23),
  EndTime: yup.date().required(),
  EndHour: yup
    .number()
    .min(0)
    .max(23),
  Designer: yup.string().max(15),
});

const Admin = props => {
  const {
    events,
    addEvent,
    editEvent,
    deleteEvent,
    generateEvent,
    updated,
    closeUpdated,
  } = props;
  const [error, setError] = useState('');
  const formal = useFormal(
    {},
    {
      schema,
      onSubmit: values => addEvent(values),
    },
  );

  const editLevelIndex = (CupIndex, v) => {
    if (isNaN(v)) {
      setError('LevelIndex should be a number');
    } else {
      editEvent(CupIndex, { LevelIndex: v });
    }
  };

  return (
    <Container>
      <Grid container spacing={16}>
        <Grid item xs={12} sm={6}>
          <Header h2>Add event</Header>
          <Paper>
            <form {...formal.getFormProps()}>
              <Field
                label="Level Index"
                {...formal.getFieldProps('LevelIndex')}
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
              <Button variant="contained" onClick={() => formal.submit()}>
                Add
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Header h2>How to add events</Header>
          <Paper>
            <ol>
              <li>
                Play level in EOL locked (turn lock new levels on in
                eolconf.exe).
              </li>
              <li>
                In site search box, search for the level, tick show locked
                levels.
              </li>
              <li>
                Copy the index number, and come back to the cup admin page.
              </li>
              <li>
                Put the number in level index under add event, add start,
                deadline and designer, remember it&apos;s in server&apos;s
                timezone (UTC).
              </li>
            </ol>
          </Paper>
          <Header h2 top>
            Editing events
          </Header>
          <Paper>
            <ul>
              <li>
                To edit Designer or LevelIndex click on the in the table below
                to enter edit mode, click outside to update.
              </li>
              <li>
                The results public checkbox makes no actual difference prior to
                the generating of results. It is meant for keeping results
                hidden after you generate if you wish to publish results
                somewhere else first, such as Discord.
              </li>
              <li>
                When an event is over the first thing you do is click Generate
                Results. Now the results are visable to only you, and you can
                puplish them in Discord or elsewhere first if you wish. When you
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
      <Header h2 top>
        Events
      </Header>
      <Paper>
        <DerpTable
          headers={[
            'Designer',
            'Start',
            'End',
            'Public',
            'LevelIndex',
            'Actions',
          ]}
          length={points.length}
        >
          {events.map(e => (
            <ListRow hover key={e.CupIndex}>
              <ListCell>
                <ClickToEdit
                  value={e.KuskiData ? e.KuskiData.Kuski : 'Unknown'}
                  update={v => editEvent(e.CupIndex, { Designer: v })}
                >
                  <Kuski noLink kuskiData={e.KuskiData} />
                </ClickToEdit>
              </ListCell>
              <ListCell>
                <LocalTime
                  date={e.StartTime}
                  format="ddd D MMM YYYY HH:mm"
                  parse="X"
                />
              </ListCell>
              <ListCell>
                <LocalTime
                  date={e.EndTime}
                  format="ddd D MMM YYYY HH:mm"
                  parse="X"
                />
              </ListCell>
              <ListCell>
                <Checkbox
                  checked={e.ShowResults === 1}
                  onChange={() =>
                    editEvent(e.CupIndex, {
                      ShowResults: e.ShowResults ? 0 : 1,
                    })
                  }
                  value="ShowResults"
                />
              </ListCell>
              <ListCell>
                <ClickToEdit
                  value={e.LevelIndex}
                  update={v => editLevelIndex(e.CupIndex, v)}
                >
                  {e.LevelIndex}
                </ClickToEdit>
              </ListCell>
              <ListCell>
                {e.Updated === 0 && e.StartTime < format(new Date(), 't') && (
                  <Button variant="contained" onClick={() => generateEvent(e)}>
                    Generate
                  </Button>
                )}
                <Button variant="contained" onClick={() => deleteEvent(e)}>
                  Delete
                </Button>
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
        close={() => closeUpdated()}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 8px;
`;

export default Admin;
