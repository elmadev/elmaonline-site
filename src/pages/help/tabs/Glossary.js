import React from 'react';
import styled from 'styled-components';
import Header from 'components/Header';

const Glossary = () => {
  return (
    <div>
      <Text>
        <Header h2>Glossary</Header>
        Along with its over two-decade journey, the community has come up with a
        lot of vocabulary which might be a hard task to understand. Here are
        some of the more commonly used words and phrases you might see:
        <ul>
          <li>Rec: A replay.</li>
          <li>Balle: Battle.</li>
          <li>
            Kuski: Player, comes from the finnish word for &quot;driver&quot;.
          </li>
          <li>Höylä/Höyl:</li>
          <ul>
            <li>
              To repeatedly play a level for miminal cuts in time. Originally
              mainly used for really short and easy levels, later widened to
              describe close to any playing which involves trying to improve
              your time.
            </li>
            <li>
              The word höylä is also used to describe short and easy levels.
            </li>
            <li>
              The origins of the word are once again in Finnish, where höylä
              means &quot;a [wood] slicer&quot;
            </li>
          </ul>
        </ul>
      </Text>
    </div>
  );
};

const Text = styled.div`
  padding-left: 8px;
  max-width: 900px;
`;

export default Glossary;
