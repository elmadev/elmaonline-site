import React, { useState } from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { nickId } from 'utils/nick';

const Interviews = props => {
  const { event } = props;
  const [designerEdit, openDesigner] = useState(false);
  const [designer, setDesigner] = useState('');

  const saveDesigner = () => {
    openDesigner(false);
  };

  return (
    <Container>
      {event.CupTimes.length > 0 && (
        <>
          <Headline>First place: {event.CupTimes[0].KuskiData.Kuski}</Headline>
          <Paper>
            <Text>{event.FirstPlaceInterview}</Text>
          </Paper>
        </>
      )}
      {event.CupTimes.length > 1 && (
        <>
          <Headline>Second place: {event.CupTimes[1].KuskiData.Kuski}</Headline>
          <Paper>
            <Text>{event.SecondPlaceInterview}</Text>
          </Paper>
        </>
      )}
      {event.CupTimes.length > 2 && (
        <>
          <Headline>Third place: {event.CupTimes[2].KuskiData.Kuski}</Headline>
          <Paper>
            <Text>{event.ThirdPlaceInterview}</Text>
          </Paper>
        </>
      )}
      <Headline>Designer: {event.KuskiData.Kuski}</Headline>
      <Paper>
        <Text>{event.DesignerInterview}</Text>
        {nickId() === event.Designer && (
          <>
            <Button
              variant="contained"
              onClick={() => {
                openDesigner(!designerEdit);
                setDesigner(event.DesignerInterview);
              }}
            >
              Submit Interview
            </Button>
            {designerEdit && (
              <>
                <TextField
                  id="outlined-name"
                  label="Write Interview"
                  value={designer}
                  onChange={e => setDesigner(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  multiline
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => saveDesigner()}
                >
                  Save
                </Button>
              </>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

const Container = styled.div`
  padding-left: 8px;
  padding-right: 8px;
`;

const Headline = styled.div`
  font-weight: bold;
  padding: 8px;
`;

const Text = styled.div`
  padding: 8px;
`;

export default Interviews;
