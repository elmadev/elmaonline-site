import React from 'react';
import styled from 'styled-components';
import Header from 'components/Header';

const Rules = () => {
  return (
    <Text>
      <Header h2>Rules</Header>
      Disobeying the rules will get you a warning or ban in that particular
      category. This means you can have multiple warnings at once in two
      different categories. Some minor offenses might be overlooked the first
      couple of times, but serious offenses will give immediate bans without
      warnings. The banning tiers are as follows. The 2 week ban is repeatable
      which means that minor offenses won&#39;t make you jump to the 1 year tier
      of ban. Website offenses will result in playing bans.
      <ul>
        <li>1st time: Warning</li>
        <li>2nd time: 1 week ban</li>
        <li>3rd time: 2 week ban (repeatable)</li>
        <li>4th time: 1 year ban</li>
      </ul>
      <Header h2>Not allowed</Header>
      <List>
        <li>
          <Header h3>Playing</Header>
        </li>
        <ol>
          <li>Cheating in any way</li>
          <li>
            Dis-/reconnecting to play battles before the countdown is over
          </li>
          <li>Repeatedly reconnecting (F12 spam)</li>
          <li>Exploiting bugs</li>
        </ol>
        <li>
          <Header h3>Chat</Header>
        </li>
        <ol>
          <li>Spamming</li>
          <li>
            Writing in other languages than English (Exceptions: very briefly or
            in private)
          </li>
        </ol>
        <li>
          <Header h3>Starting battles</Header>
        </li>
        <ol>
          <li>
            Starting a battle on a level that has been battled or otherwise
            released before
          </li>
          <li>Starting a battle in a level created by someone else</li>
          <li>
            Starting battles on offensive, buggy or otherwise unsuitable levels
          </li>
          <li>Starting a battle in internals</li>
          <li>
            Playing your own battles (Exception: Flag Tags). See Etiquette
          </li>
          <li>Giving tips or otherwise helping people with your battle</li>
        </ol>
        <li>
          <Header h3>Website</Header>
        </li>
        <ol>
          <li>Vandalizing the wiki</li>
          <li>
            In any way trying to hack or harm the server or the website (*)
          </li>
          <li>Creating more than one user</li>
          <li>Joining a team you&#39;re not officially a member of</li>
          <li>Senseless nick/team changing</li>
        </ol>
      </List>
    </Text>
  );
};

const Text = styled.div`
  padding-left: 8px;
`;

const List = styled.ol`
  margin-top: 8px;
  margin-bottom: 8px;
`;

export default Rules;
