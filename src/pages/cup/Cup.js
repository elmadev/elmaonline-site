import React, { useState, useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Events from './Events';

const Cups = props => {
  const { ShortName } = props;
  const [tab, setTab] = useState(0);
  const { cup, lastCupShortName, events } = useStoreState(state => state.Cup);
  const { getCup } = useStoreActions(actions => actions.Cup);

  useEffect(() => {
    if (lastCupShortName !== ShortName) {
      getCup(ShortName);
    }
  }, []);

  if (!cup) {
    return null;
  }

  return (
    <>
      <Tabs value={tab} onChange={(e, value) => setTab(value)}>
        <Tab label="Dashboard" />
        <Tab label="Events" />
        <Tab label="Standings" />
        <Tab label="Rules & Info" />
        <Tab label="Blog" />
        <Tab label="Interviews" />
      </Tabs>
      <CupName>{cup.CupName}</CupName>
      {tab === 1 && <Events events={events} />}
    </>
  );
};

const CupName = styled.div`
  font-weight: 500;
  color: #219653;
  font-size: 22px;
  padding: 8px;
`;

export default Cups;
