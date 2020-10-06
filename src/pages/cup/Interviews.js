import React, { useState } from 'react';
import styled from 'styled-components';
import { Paper } from 'styles/Paper';
import { Button, TextField } from '@material-ui/core';
import { useStoreActions } from 'easy-peasy';
import { nickId } from 'utils/nick';

const defaultPlayer = `What was your first impression of the level, and did that change over time when you played it?

Tell us about the style finding and höyling process.

Were you surprised by your own and/or other's results?

What are your expectations and goals for the rest of the cup?
`;

const defaultDesigner = `What was the idea of this level?

Were you surprised by the winning replay and style?

Tell us about the designing process.
`;

const Interviews = props => {
  const { sendInterview } = useStoreActions(actions => actions.Cup);
  const { event, cup } = props;
  const [designerEdit, openDesigner] = useState(false);
  const [designer, setDesigner] = useState('');
  const [firstPlaceEdit, openFirstPlace] = useState(false);
  const [firstPlace, setFirstPlace] = useState('');
  const [secondPlaceEdit, openSecondPlace] = useState(false);
  const [secondPlace, setSecondPlace] = useState('');
  const [thirdPlaceEdit, openThirdPlace] = useState(false);
  const [thirdPlace, setThirdPlace] = useState('');

  const saveDesigner = () => {
    sendInterview({
      type: 'Designer',
      text: designer,
      CupGroupIndex: cup.CupGroupIndex,
      CupIndex: event.CupIndex,
      ShortName: cup.ShortName,
    });
    openDesigner(false);
  };

  const saveFirstPlace = () => {
    sendInterview({
      type: 'FirstPlace',
      text: firstPlace,
      CupGroupIndex: cup.CupGroupIndex,
      CupIndex: event.CupIndex,
      ShortName: cup.ShortName,
    });
    openFirstPlace(false);
  };

  const saveSecondPlace = () => {
    sendInterview({
      type: 'SecondPlace',
      text: secondPlace,
      CupGroupIndex: cup.CupGroupIndex,
      CupIndex: event.CupIndex,
      ShortName: cup.ShortName,
    });
    openSecondPlace(false);
  };

  const saveThirdPlace = () => {
    sendInterview({
      type: 'ThirdPlace',
      text: thirdPlace,
      CupGroupIndex: cup.CupGroupIndex,
      CupIndex: event.CupIndex,
      ShortName: cup.ShortName,
    });
    openThirdPlace(false);
  };

  return (
    <Container>
      {event.CupTimes.length > 0 && (
        <>
          <Headline>First place: {event.CupTimes[0].KuskiData.Kuski}</Headline>
          <Paper>
            <Text>{event.FirstPlaceInterview}</Text>
            {nickId() === event.CupTimes[0].KuskiIndex && (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    openFirstPlace(!firstPlaceEdit);
                    setFirstPlace(event.FirstPlaceInterview);
                  }}
                >
                  Submit Interview
                </Button>
                {firstPlaceEdit && (
                  <>
                    <TextField
                      id="outlined-name"
                      label="Write Interview"
                      value={firstPlace || defaultPlayer}
                      onChange={e => setFirstPlace(e.target.value)}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      multiline
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => saveFirstPlace()}
                    >
                      Save
                    </Button>
                  </>
                )}
              </>
            )}
          </Paper>
        </>
      )}
      {event.CupTimes.length > 1 && (
        <>
          <Headline>Second place: {event.CupTimes[1].KuskiData.Kuski}</Headline>
          <Paper>
            <Text>{event.SecondPlaceInterview}</Text>
            {nickId() === event.CupTimes[1].KuskiIndex && (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    openSecondPlace(!secondPlaceEdit);
                    setSecondPlace(event.SecondPlaceInterview);
                  }}
                >
                  Submit Interview
                </Button>
                {secondPlaceEdit && (
                  <>
                    <TextField
                      id="outlined-name"
                      label="Write Interview"
                      value={secondPlace || defaultPlayer}
                      onChange={e => setSecondPlace(e.target.value)}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      multiline
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => saveSecondPlace()}
                    >
                      Save
                    </Button>
                  </>
                )}
              </>
            )}
          </Paper>
        </>
      )}
      {event.CupTimes.length > 2 && (
        <>
          <Headline>Third place: {event.CupTimes[2].KuskiData.Kuski}</Headline>
          <Paper>
            <Text>{event.ThirdPlaceInterview}</Text>
            {nickId() === event.CupTimes[2].KuskiIndex && (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    openThirdPlace(!thirdPlaceEdit);
                    setThirdPlace(event.ThirdPlaceInterview);
                  }}
                >
                  Submit Interview
                </Button>
                {thirdPlaceEdit && (
                  <>
                    <TextField
                      id="outlined-name"
                      label="Write Interview"
                      value={thirdPlace || defaultPlayer}
                      onChange={e => setThirdPlace(e.target.value)}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      multiline
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => saveThirdPlace()}
                    >
                      Save
                    </Button>
                  </>
                )}
              </>
            )}
          </Paper>
        </>
      )}
      {event.KuskiData && (
        <>
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
                      value={designer || defaultDesigner}
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
        </>
      )}
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
  white-space: pre-wrap;
`;

export default Interviews;
