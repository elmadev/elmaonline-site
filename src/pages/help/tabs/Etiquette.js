import React from 'react';
import styled from 'styled-components';
import Header from 'components/Header';

const Etiquette = () => {
  return (
    <div>
      <Text>
        <Header h2>Etiquette</Header>
        <Header h3>General</Header>
        Elma is a game with a long history and a culture of doing things a
        specific way. Here are some things that may help you along the way:
        <ul>
          <li>
            Some people love to find styles and routes on their own. Giving them
            away is often not desireable unless asked.
          </li>
          <li>
            A lot of people are willing to help with getting better. The in-game
            chat is a great place to do so.{' '}
          </li>
        </ul>
        <Header h3>Level designing</Header>
        When you are designing a level, there are several guidelines to
        remember:
        <ul>
          <li>
            Avoid placing polygons too close to each other if the wheels are
            supposed to fit between them. Wheels getting stuck between too tight
            gaps results in bugs, such as speeding up unrealistically fast. The
            result depends highly on the FPS and thus is most unfair and
            undesirable. Battles that include or depend on such spots will
            usually be aborted.
          </li>
          <li>In general, you should not make invisible polygons.</li>
          <li>
            Try to make your level suitable for the battle type you choose. If
            you aren&#39;t sure, don&#39;t hesitate to ask.
          </li>
          <ul>
            <li>
              Survivor battles should not include parts which allow you to stop
              completely.
            </li>
            <li>
              In slowness battles, you should avoid spots which allow you to
              stop and still finish the level.
            </li>
            <li>
              Flagtag battles need to allow players to move freely in many
              directions. Dead ends that are hard to escape will get the flag
              stuck. Gravity apples are an easy way to allow mobility.
            </li>
          </ul>
          <li>
            Place arrows next to gravity apples to indicate the direction of
            gravity.
          </li>
          <li>
            Many players have strong opinions regarding battle times, although
            there are no strict rules. In general, it&#39;s encouraged to start
            battles for long enough to be able to get a good grasp of the level
            but not too long to get bored with it.
          </li>
          <li>
            Speedloops, i.e. levels mainly consisting of smooth loops with a lot
            of speed, are generally considered boring and unwanted.
          </li>
        </ul>
      </Text>
    </div>
  );
};

const Text = styled.div`
  padding-left: 8px;
  max-width: 900px;
`;

export default Etiquette;
