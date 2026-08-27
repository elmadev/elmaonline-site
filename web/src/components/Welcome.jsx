import React from 'react';
import styled from '@emotion/styled';
import Link from 'components/Link';
import Video from 'components/Video';
import { Grid } from '@material-ui/core';

export const Install = () => {
  return (
    <>
      <List>
        <li>
          <a
            href="https://store.steampowered.com/app/1290220/Elasto_Mania_Remastered/"
            target="_blank"
            rel="noreferrer"
          >
            Buy Elasto Mania on steam
          </a>
        </li>
        <li>
          <a
            href="https://steamcommunity.com/workshop/filedetails/?id=2094059600"
            target="_blank"
            rel="noreferrer"
          >
            Install the Elma Online mod on steam workshop
          </a>
        </li>
        <li>
          <Link to="register">Register on this site</Link>
        </li>
        <li>Hostname: eol.elma.online</li>
      </List>
      <Link to="help/howtoinstall">More</Link>
    </>
  );
};

const Welcome = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <Text>
          Welcome to the Elasto Mania online website. Elma online is a patch for
          the game Elasto Mania which enables online play, such as battles,
          multiplay and watching others. To get started:
          <Install />
          For additional information check out the <Link to="help">
            Help
          </Link>{' '}
          section.
        </Text>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Trailer>
          <Video
            height="201"
            width="358"
            poster="trailer-poster.jpg"
            video="trailer.mp4"
            formats={['mp4']}
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

const Trailer = styled.div`
  justify-content: flex-end;
  display: flex;
  padding-right: 4px;
`;

export default Welcome;
