import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Paper } from 'components/Paper';
import { TextField, Button } from '@material-ui/core';
import { format } from 'date-fns';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';
import Kuski from 'components/Kuski';
import { nickId } from 'utils/nick';

const Standings = props => {
  const { items, addEntry, cup, owner } = props;
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

  const addLinks = text => {
    const re = /(?![^<]*>|[^<>]*<\/)((https?:)\/\/[a-z0-9&#=./\-?_]+)/gi;
    const subst = '<a href="$1">$1</a>';
    return text.replace(re, subst);
  };

  return (
    <Container>
      {owner.length > 0 && owner.indexOf(nickId()) > -1 && (
        <Paper padding>
          <Header h2>Add new blog entry</Header>
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
        </Paper>
      )}
      {items
        .sort((a, b) => b.Written - a.Written)
        .map(i => (
          <Paper padding top>
            <Header h2>{i.Headline}</Header>
            <SubHeadline>
              by <Kuski kuskiData={i.KuskiData} /> at{' '}
              <LocalTime
                date={i.Written}
                format="eee d MMM yyyy HH:mm"
                parse="X"
              />
            </SubHeadline>
            <Text dangerouslySetInnerHTML={{ __html: addLinks(i.Text) }} />
          </Paper>
        ))}
    </Container>
  );
};

const Container = styled.div`
  padding-left: 8px;
  padding-right: 8px;
`;

const SubHeadline = styled.div`
  padding-bottom: 8px;
  color: ${p => p.theme.lightTextColor};
`;

const Text = styled.div`
  white-space: pre-line;
`;

export default Standings;
