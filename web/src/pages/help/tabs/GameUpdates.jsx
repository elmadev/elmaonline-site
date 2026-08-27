import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import Header from 'components/Header';
import * as updates from './gameupdates.json';

const Headline = ({ type, date, version, file }) => {
  let text = '';
  if (type === 'both') {
    text = 'Client & server update';
  }
  if (type === 'client') {
    text = 'Client update';
  }
  if (type === 'server') {
    text = 'Server update';
  }
  text = `${text} - ${date}`;
  if (version) {
    text = `${text} (v. ${version})`;
  }
  if (file) {
    return (
      <Header h2 top>
        <a href={file}>{text} - Download</a>
      </Header>
    );
  }
  return (
    <Header h2 top>
      {text}
    </Header>
  );
};

const GameUpdates = () => {
  return (
    <div>
      <Text>
        <Header h2>Game Updates</Header>
        Game updates can be client updates or server updates. The former updates
        the game files on your computer and the latter updates the functionality
        of the server you connect to. They may go hand in hand or be released on
        their own. Both will be able to fix issues and add new features.
        <Header h2>How to update</Header>
        Server updates will happen without any action required on your part, if
        you are online at the time you may notice a smaller or longer downtime.
        Client updates depends on your game version.
        <ul>
          <li>Steam version</li>
          <ul>
            <li>Updates will happen automatically through steam.</li>
          </ul>
          <li>Standalone version</li>
          <ul>
            <li>
              You will need to download the zip file by clicking the headline of
              the latest client update, extract the files and replace the
              existing files in your EOL folder.
            </li>
          </ul>
        </ul>
        {updates.default.map(update => (
          <Fragment key={update.date}>
            <Headline
              type={update.type}
              date={update.date}
              version={update.version}
              file={update.file}
            />
            {update.highlights.map(h => (
              <Highlight key={h}>{h}</Highlight>
            ))}
            <ul>
              {update.changes.map(c => (
                <Fragment key={c.section}>
                  <Header h3 top>
                    {c.section}
                  </Header>
                  {c.changes.map(change => (
                    <li key={change}>{change}</li>
                  ))}
                </Fragment>
              ))}
            </ul>
          </Fragment>
        ))}
      </Text>
    </div>
  );
};

const Highlight = styled.div`
  margin-bottom: 8px;
`;

const Text = styled.div`
  padding-left: 8px;
  max-width: 900px;
`;

export default GameUpdates;
