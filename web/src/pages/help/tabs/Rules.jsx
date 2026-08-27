import React from 'react';
import styled from '@emotion/styled';
import Header from 'components/Header';

const Rules = () => {
  return (
    <Text>
      <Header h2>Rules</Header>
      Disobeying the rules will get you a warning or ban in that particular
      category. This means you can have multiple warnings at once in different
      categories. Some minor offenses might be overlooked the first couple of
      times, but serious offenses will give immediate bans without warnings. The
      banning tiers are as follows. The 2 week ban is repeatable which means
      that minor offenses won&#39;t make you jump to the 1 year tier of ban.
      Website offenses will result in playing bans.
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
          <li>Cheating in any way (*)</li>
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
          <li>
            Starting a battle in a level created by someone else (unless agreed
            upon)
          </li>
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
      <p>
        <b>(*)</b> In extreme cases these can give an immediate one year or even
        permanent ban.
      </p>
      <Header h2>Elaborations</Header>
      <Header h3>Chat</Header>
      <p>
        A few lines of non english here and there will be allowed. If you are
        bad at english or talking to someone who is, it&#39;s fine to talk in
        another language shortly. But if it turns into a longer conversation
        move it to private or elsewhere.
      </p>
      <Header h3>Starting battles</Header>
      Allowed:
      <ul>
        <li>New levels never played by anyone</li>
        <ul>
          Remixes
          <li>Internal remixes</li>
          <li>Remixes of others&#39; levels</li>
          <li>
            But remember they have to be noticably different, especially when
            it&#39;s internals (changing polygons required). And keep amount of
            remixes to a minimum.
          </li>
        </ul>
      </ul>
      Not allowed:
      <ul>
        <li>Remixes only changing the starting position</li>
        <li>Remixes with very small changes</li>
        <li>Practice(/Train) levels</li>
        <li>Mirrored levels</li>
        <li>Scaled levels</li>
        <li>Using the same level for a different battle type</li>
      </ul>
      <Header h3>Website</Header>
      <p>
        You should always use your &quot;official&quot; nick, as in the nick you
        usually use, and the team you&#39;re a member of if any.
      </p>
      <Header h2>Final word</Header>
      <p>
        The admin group always has the final word, however if you feel
        you&#39;re being treated unjustly, you can send a ban appeal and another
        admin will look at it. Serious cases will always be discussed in the
        admin group.
      </p>
      <Header h2>Starting battles</Header>
      <p>
        When you register you do not have rights to start battles. This is for
        you to learn what a battle is before starting one, and to avoid new
        players accidentally starting one. To get battle rights you currently
        need to contact a mod, the easiest way is using the{' '}
        <a href="https://discord.gg/j5WMFC6">discord</a> and finding someone
        with the eolmod role.
      </p>
      <Header h3>Types</Header>
      <p>
        There are three types of battle starting rights. You can have multiple
        at once.
        <ul>
          <li>
            Normal (Normal, One-life, First Finish, Slowness, Survivor, Last
            Counts, Finish-count, Crippled, 1-60 minutes duration)
          </li>
          <li>
            Special (1 hour TT, Flag Tag, Apple, Speed, Drunk, Apple Bugs,
            Multi)
          </li>
          <li>Long (65-180 minutes duration)</li>
        </ul>
      </p>
      <Header h3>Requirements</Header>
      <p>
        Requirements to obtain battle rights are put in place to make sure you
        understand how to use them. Exceptions can be made if this can be
        verified otherwise.
        <ul>
          <li>Normal: Play five battles, ask a mod.</li>
          <li>Special: Start five battles, ask a mod.</li>
          <li>Long: Start 50 battles, ask a mod.</li>
        </ul>
      </p>
      <Header h3>Guidelines</Header>
      <p>
        Since battles are started serially using a queue, starting a battle
        affects what people can play and how much room there is for others to
        start battles. Don't let that stop you, just keep it in mind when
        starting many battles, especially special and long battles. Long battles
        over 60 minutes are recommended to not be started more than once a week
        and to be preannounced in{' '}
        <a href="https://discord.gg/j5WMFC6">discord</a> or{' '}
        <a href="https://mopolauta.moposite.com/viewtopic.php?f=3&t=7132">
          mopolauta
        </a>
        . Long battles are still new and experimental, rights may be taken away
        so you have to ask again.
      </p>
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

export default Rules;
