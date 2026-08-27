import React from 'react';
import styled from '@emotion/styled';
import Header from 'components/Header';
import Link from 'components/Link';

const MoreLevels = () => {
  return (
    <Text>
      <Header h2>More levels</Header>
      Besides playing the current battle you can download thousands of extra
      levels to play.
      <Header h3>Where to put level files</Header>
      Level files should be put inside the lev folder, where this folder is
      depends on how you're running EOL.
      <List>
        <li>
          Steam: If you're opening EOL through steam you should use the lev
          folder inside "[steam-folder]\steamapps\common\elma\player". The
          player folders has your custom files which are merged into merged
          folder on startup.
        </li>
        <li>
          Standalone: If you have EOL standalone you should use the lev folder
          inside wherever you have placed EOL.
        </li>
      </List>
      <Header h3>Finding levels</Header>
      There's a few different ways you can find levels.
      <List>
        <li>
          <Link to="/levels">Level packs</Link>: These are packs of levels
          released together, typically made by the same designer but sometimes
          by a group of people. Each pack can be downloaded as a zip from their
          page.
        </li>
        <li>
          Individual levels: Every level played by someone in EOL can be
          downloaded by anyone else. There's no directory of these, but they can
          be searched by clicking Level in the search bar. They can also be
          downloaded using ctrl+F4 in-game and typing the file name.
        </li>
        <li>
          <Link to="/cups">Cups</Link> and{' '}
          <Link to="/battleleagues">battle leagues</Link>: Old cups and battle
          leagues can be a good source of quality levels with a large amount of
          available replays.
        </li>
      </List>
      <Header h3>Replays</Header>
      Replays can also be found in the above mentioned pages for the levels.
      Replays should be saved in the rec folder you'll find the same place as
      the lev folder. Besides these pages they can also be found on the{' '}
      <Link to="/replays">replays page</Link> and by using the search bar in the
      top of the page.
    </Text>
  );
};

const Text = styled.div`
  padding-left: 8px;
  max-width: 900px;
`;

const List = styled.ol`
  margin-top: 8px;
  margin-bottom: 8px;
`;

export default MoreLevels;
