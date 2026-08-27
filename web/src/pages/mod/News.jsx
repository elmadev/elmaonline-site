import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Grid } from '@material-ui/core';
import { TextField } from 'components/Inputs';
import { Paper, Content } from 'components/Paper';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Header from 'components/Header';
import { Parser } from 'react-tiny-bbcode';
import LocalTime from 'components/LocalTime';
import Button from 'components/Buttons';
import { Row } from 'components/Containers';
import Feedback from 'components/Feedback';

const News = () => {
  const { postNewsStatus } = useStoreState(state => state.Mod);
  const { postNews, setPostNewsStatus } = useStoreActions(
    actions => actions.Mod,
  );
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (postNewsStatus === 'News posted!') {
      setHeadline('');
      setBody('');
    }
  }, [postNewsStatus]);

  const tryPostNews = (h, t) => {
    if (h.length > 2 && t.length > 2) {
      postNews({ Headline: headline, News: body });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Paper>
          <Content>
            <Header h2>News entry</Header>
            <TextField
              name="Headline"
              value={headline}
              onChange={e => setHeadline(e)}
              multiline
            />
            <TextField
              name="Text"
              value={body}
              onChange={e => setBody(e)}
              multiline
            />
            <Row jc="space-between">
              <a href="https://en.wikipedia.org/wiki/BBCode">
                Text supports bbcode.
              </a>
              <Row>
                <Button
                  onClick={() => {
                    setBody('');
                    setHeadline('');
                  }}
                  secondary
                  right
                >
                  Reset
                </Button>
                <Button onClick={() => tryPostNews(headline, body)}>Add</Button>
              </Row>
            </Row>
          </Content>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper>
          <Content>
            <Header h2>Preview</Header>
            <Headline selected>
              {headline}{' '}
              <Written>
                <LocalTime
                  date={Math.round(new Date().getTime() / 1000)}
                  format="eee d MMM yyyy"
                  parse="X"
                />
              </Written>
            </Headline>
            <div>
              <Parser bbcode={body} />
            </div>
          </Content>
        </Paper>
      </Grid>
      <Feedback
        open={postNewsStatus !== ''}
        text={postNewsStatus}
        type="success"
        close={() => setPostNewsStatus('')}
      />
    </Grid>
  );
};

const Headline = styled.div`
  font-weight: ${p => (p.selected ? 'bold' : 'normal')};
`;

const Written = styled.span`
  color: ${p => p.theme.lightTextColor};
`;

export default News;
