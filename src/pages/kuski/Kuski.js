import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@material-ui/core';

import Flag from 'components/Flag';
import ReplaysBy from 'components/ReplaysBy';

import PlayedBattles from './PlayedBattles';
import DesignedBattles from './DesignedBattles';
import KuskiHeader from './KuskiHeader';
import LatestTimes from './LatestTimes';
import Info from './Info';
import s from './Kuski.css';

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
      {tab === 5 && <Info kuskiInfo={kuski} />}
    </div>
  );
};

Kuski.propTypes = {
  name: PropTypes.string.isRequired,
};

export default withStyles(s)(Kuski);
