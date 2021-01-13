import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@material-ui/core';
import styled from 'styled-components';

import Flag from 'components/Flag';
import ReplaysBy from 'components/ReplaysBy';
import PlayedBattles from './PlayedBattles';
import DesignedBattles from './DesignedBattles';
import KuskiHeader from './KuskiHeader';
import LatestTimes from './LatestTimes';
import Info from './Info';

const Kuski = props => {
  const [tab, setTab] = useState(0);

  const { name } = props;

  const { getKuskiByName } = useStoreActions(state => state.Kuski);
  const { kuski } = useStoreState(state => state.Kuski);

  useEffect(() => {
    getKuskiByName(name);
  }, [name]);

  if (!kuski) return <div>not found</div>;

  return (
    <Container>
      <Head>
        <Picture>
          <img src={`/dl/shirt/${kuski.KuskiIndex}`} alt="shirt" />
        </Picture>
        <Profile>
          <Name>
            <Flag nationality={kuski.Country} />
            {kuski.Kuski}
          </Name>
          <TeamNat>{kuski.TeamData && `Team: ${kuski.TeamData.Team}`}</TeamNat>
        </Profile>
        <KuskiHeader Kuski={kuski.Kuski} KuskiIndex={kuski.KuskiIndex} />
      </Head>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(e, t) => setTab(t)}
      >
        <Tab label="Played Battles" />
        <Tab label="Designed Battles" />
        <Tab label="Latest times" />
        <Tab label="Replays Uploaded" />
        <Tab label="Replays Driven" />
        <Tab label="Info" />
      </Tabs>
      {tab === 0 && (
        <Width100>
          <PlayedBattles KuskiIndex={kuski.KuskiIndex} />
        </Width100>
      )}
      {tab === 1 && (
        <Width100>
          <DesignedBattles KuskiIndex={kuski.KuskiIndex} />
        </Width100>
      )}
      {tab === 2 && <LatestTimes KuskiIndex={kuski.KuskiIndex} />}
      {tab === 3 && (
        <Width100>
          <ReplaysBy type="uploaded" KuskiIndex={kuski.KuskiIndex} />
        </Width100>
      )}
      {tab === 4 && (
        <Width100>
          <ReplaysBy type="driven" KuskiIndex={kuski.KuskiIndex} />
        </Width100>
      )}
      {tab === 5 && <Info kuskiInfo={kuski} />}
    </Container>
  );
};

Kuski.propTypes = {
  name: PropTypes.string.isRequired,
};

const Width100 = styled.div`
  max-width: 100%;
  overflow: auto;
`;

const Container = styled.div`
  min-height: 100%;
  background: #fff;
  padding-bottom: 200px;
`;

const Picture = styled.div`
  height: 150px;
  width: 150px;
  flex: 0 0 150px;
  border-radius: 50%;
  margin: 20px;
  background-color: transparent;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 20px,
    #f1f1f1 0,
    #f1f1f1 50px
  );
  img {
    margin: auto;
    display: block;
    padding: 10px;
  }
  @media (max-width: 940px) {
    margin: 20px auto;
  }
`;

const Profile = styled.div`
  flex-direction: column;
  justify-content: center;
  flex: 0 0 200px;
  @media (max-width: 940px) {
    align-items: center;
    flex: 1;
  }
`;

const Name = styled.div`
  font-weight: 500;
  font-size: 30px;
  span {
    margin-right: 10px;
    font-size: 20px;
  }
`;

const TeamNat = styled.div`
  font-size: 16px;
`;

const Head = styled.div`
  border-bottom: 1px solid #eaeaea;
  display: flex;
  > * {
    display: flex;
  }
  @media (max-width: 940px) {
    flex-direction: column;
    > * {
      margin-bottom: 20px;
    }
  }
`;

export default Kuski;
