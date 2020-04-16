import React, { useState } from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { format } from 'date-fns';
import LocalTime from 'components/LocalTime';
import Kuski from 'components/Kuski';
import { nickId } from 'utils/nick';

const Standings = props => {
  const { items, addEntry, cup } = props;
  const [newBlog, setNewBlog] = useState('');
  const [newHeadline, setNewHeadline] = useState('');

  if (!items) {
    return null;
  }

  const save = () => {
    addEntry({
      Text: newBlog,
      Headline: newHeadline,
      Written: format(new Date(), 't'),
      CupGroupIndex: cup.CupGroupIndex,
    });
    setNewBlog('');
    setNewHeadline('');
  };

  return (
    <Container>
      {nickId() === cup.KuskiIndex && (
        <>
          <Headline>Add new blog entry</Headline>
          <TextField
            id="outlined-name"
            label="Headline"
            value={newHeadline}
            onChange={e => setNewHeadline(e.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <TextField
            id="outlined-name"
            label="Text"
            value={newBlog}
            onChange={e => setNewBlog(e.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
            multiline
          />
          <Button variant="contained" color="primary" onClick={() => save()}>
            Save
          </Button>
        </>
      )}
      {items
        .sort((a, b) => b.Written - a.Written)
        .map(i => (
          <>
            <Headline>{i.Headline}</Headline>
            <SubHeadline>
              by <Kuski kuskiData={i.KuskiData} /> at{' '}
              <LocalTime
                date={i.Written}
                format="ddd D MMM YYYY HH:mm"
                parse="X"
              />
            </SubHeadline>
            <Paper>
              <Text>{i.Text}</Text>
            </Paper>
          </>
        ))}
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
  padding-bottom: 0;
`;

const SubHeadline = styled.div`
  padding-left: 8px;
  padding-bottom: 8px;
`;

const Text = styled.div`
  padding: 8px;
`;

export default Standings;
