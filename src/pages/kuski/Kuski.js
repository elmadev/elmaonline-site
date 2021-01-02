import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@material-ui/core';
import styled from 'styled-components';

import Flag from 'components/Flag';
import ReplaysBy from 'components/ReplaysBy';
import AchievementsCups from 'components/AchievementsCups';
import AchievementsHacktober from 'components/AchievementsHacktober';
import Header from 'components/Header';

import PlayedBattles from './PlayedBattles';
import DesignedBattles from './DesignedBattles';
import KuskiHeader from './KuskiHeader';
import LatestTimes from './LatestTimes';
import s from './Kuski.css';

import RPlay from '../../images/rights/RPlay.png';
import RStartBattle from '../../images/rights/RStartBattle.png';
import RSpecialBattle from '../../images/rights/RSpecialBattle.png';
import RStartCup from '../../images/rights/RStartCup.png';
import RStart24htt from '../../images/rights/RStart24htt.png';
import RStop from '../../images/rights/RStop.png';
import RMultiPlay from '../../images/rights/RMultiPlay.png';
import RChat from '../../images/rights/RChat.png';
import RBan from '../../images/rights/RBan.png';
import RMod from '../../images/rights/RMod.png';
import RAdmin from '../../images/rights/RAdmin.png';

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
    <div className={s.kuski}>
      <div className={s.head}>
        <div className={s.picture}>
          <img
            src={`http://elmaonline.net/images/shirt/${kuski.KuskiIndex}`}
            alt="shirt"
          />
        </div>
        <div className={s.profile}>
          <div className={s.name}>
            <Flag nationality={name} />
            {kuski.Kuski}
          </div>
          <div className={s.teamNat}>
            {kuski.TeamData && `Team: ${kuski.TeamData.Team}`}
          </div>
        </div>
        <KuskiHeader Kuski={kuski.Kuski} KuskiIndex={kuski.KuskiIndex} />
      </div>
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
        <div style={{ maxWidth: '100%', overflow: 'auto' }}>
          <div className={s.recentBattles}>
            <PlayedBattles KuskiIndex={kuski.KuskiIndex} />
          </div>
        </div>
      )}
      {tab === 1 && (
        <div style={{ maxWidth: '100%', overflow: 'auto' }}>
          <div className={s.recentBattles}>
            <DesignedBattles KuskiIndex={kuski.KuskiIndex} />
          </div>
        </div>
      )}
      {tab === 2 && <LatestTimes KuskiIndex={kuski.KuskiIndex} />}
      {tab === 3 && (
        <div style={{ maxWidth: '100%', overflow: 'auto' }}>
          <div className={s.recentBattles}>
            <ReplaysBy type="uploaded" KuskiIndex={kuski.KuskiIndex} />
          </div>
        </div>
      )}
      {tab === 4 && (
        <div style={{ maxWidth: '100%', overflow: 'auto' }}>
          <div className={s.recentBattles}>
            <ReplaysBy type="driven" KuskiIndex={kuski.KuskiIndex} />
          </div>
        </div>
      )}
      {tab === 5 && (
        <SubContainer>
          <Header h3>Rights</Header>
          <Rights>
            {kuski.RPlay === 1 && <img src={RPlay} alt="RPlay" title="Play" />}
            {kuski.RMultiPlay === 1 && (
              <img src={RMultiPlay} alt="RMultiPlay" title="Multiplay" />
            )}
            {kuski.RChat === 1 && <img src={RChat} alt="RChat" title="Chat" />}
            {kuski.RStartBattle === 1 && (
              <img src={RStartBattle} alt="RStartBattle" title="Start battle" />
            )}
            {kuski.RSpecialBattle === 1 && (
              <img
                src={RSpecialBattle}
                alt="RSpecialBattle"
                title="Start special battle"
              />
            )}
            {kuski.RStart24htt === 1 && (
              <img
                src={RStart24htt}
                alt="RStart24htt"
                title="Start 24 hour TT"
              />
            )}
            {kuski.RStartCup === 1 && (
              <img src={RStartCup} alt="RStartCup" title="Start cup" />
            )}
            {kuski.RStop === 1 && (
              <img src={RStop} alt="RStop" title="Abort/Stop battle" />
            )}
            {kuski.RBan === 1 && <img src={RBan} alt="RBan" title="Ban" />}
            {kuski.RMod === 1 && <img src={RMod} alt="RMod" title="Mod" />}
            {kuski.RAdmin === 1 && (
              <img src={RAdmin} alt="RAdmin" title="Admin" />
            )}
          </Rights>
          <AchievementsCups KuskiIndex={kuski.KuskiIndex} />
          <AchievementsHacktober KuskiIndex={kuski.KuskiIndex} />
        </SubContainer>
      )}
    </div>
  );
};

const Rights = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  img {
    padding: 8px;
  }
`;

const SubContainer = styled.div`
  margin-left: 8px;
`;

Kuski.propTypes = {
  name: PropTypes.string.isRequired,
};

export default withStyles(s)(Kuski);
