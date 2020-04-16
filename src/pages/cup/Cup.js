import React, { useState, useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { nickId } from 'utils/nick';
import Events from './Events';
import Standings from './Standings';
import RulesInfo from './RulesInfo';
import Blog from './Blog';

const Cups = props => {
  const { ShortName } = props;
  const [tab, setTab] = useState(0);
  const { cup, lastCupShortName, events } = useStoreState(state => state.Cup);
  const { getCup, update, addNewBlog } = useStoreActions(
    actions => actions.Cup,
  );

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
        {nickId() === cup.KuskiIndex && <Tab label="Admin" />}
      </Tabs>
      <CupName>{cup.CupName}</CupName>
      {tab === 1 && <Events events={events} />}
      {tab === 2 && <Standings events={events} />}
      {tab === 3 && (
        <RulesInfo
          description={cup.Description}
          owner={cup.KuskiIndex}
          updateDesc={newDesc => {
            update({
              CupGroupIndex: cup.CupGroupIndex,
              shortName: cup.ShortName,
              data: { Description: newDesc },
            });
          }}
        />
      )}
      {tab === 4 && (
        <Blog
          cup={cup}
          items={cup.CupBlog}
          addEntry={newBlog => {
            addNewBlog({ data: newBlog, shortName: cup.ShortName });
          }}
        />
      )}
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
