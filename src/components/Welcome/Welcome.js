import React from 'react';
import styled from 'styled-components';
import Link from 'components/Link';
import { Grid } from '@material-ui/core';

const Welcome = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <Text>
          Welcome to the Elasto Mania online website. Elma online is a patch for
          the game Elasto Mania which enables online play, such as battles,
          multiplay and watching others. To get started:
          <List>
            <li>
              <a href="https://store.steampowered.com/app/1290220/Elasto_Mania/">
                Buy Elasto Mania on steam
              </a>
            </li>
            <li>
              <a href="https://steamcommunity.com/workshop/filedetails/?id=2094059600">
                Install the Elma Online mod on steam workshop
              </a>
            </li>
            <li>Register on this site</li>
            <RedLi>New IP May 2020: 161.35.35.82</RedLi>
          </List>
          For additional information check out the <Link to="/help">Help</Link>{' '}
          section.
        </Text>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Trailer>
          <iframe
            title="trailer"
            width="358"
            height="201"
            src="https://www.youtube.com/embed/yvy1gGcywC0"
            frameBorder="0"
            allowFullScreen
          />
        </Trailer>
      </Grid>
    </Grid>
  );
};

const Text = styled.div`
  padding-left: 8px;
`;

const List = styled.ol`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const RedLi = styled.li`
  color: red;
`;

const Trailer = styled.div`
  justify-content: flex-end;
  display: flex;
  padding-right: 4px;
`;

export default Welcome;
