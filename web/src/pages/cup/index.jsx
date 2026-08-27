import React, { useEffect } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { useNavigate, useParams } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import Header from 'components/Header';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { nickId } from 'utils/nick';
import Layout from 'components/Layout';
import Loading from 'components/Loading';
import { admins } from 'utils/cups';
import Events from './Events';
import Standings from './Standings';
import RulesInfo from './RulesInfo';
import Blog from './Blog';
import Admin from './Admin';
import Dashboard from './Dashboard';
import Personal from './Personal';
import Team from './Team';
import PlayStats from './PlayStats';

const Cups = () => {
  const { ShortName, tab, eventNumber, eventTab } = useParams({
    strict: false,
  });

  const cupTab = tab || '';

  const { cup, lastCupShortName, events } = useStoreState(state => state.Cup);
  const { getCup, update, addNewBlog } = useStoreActions(
    actions => actions.Cup,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (lastCupShortName !== ShortName) {
      getCup(ShortName);
    }
  }, []);

  const isCupAdmin =
    admins(cup).length > 0 && admins(cup).indexOf(nickId()) > -1;

  if (!cup) {
    return null;
  }

  return (
    <Layout edge t={`Cup - ${cup ? cup.CupName : ShortName}`}>
      {!cup ? (
        <Loading />
      ) : (
        <>
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            value={cupTab}
            onChange={(e, value) =>
              // value can be empty string
              navigate({
                to: ['/cup', ShortName, value].filter(Boolean).join('/'),
              })
            }
          >
            <Tab label="Dashboard" value="" />
            <Tab label="Events" value="events" />
            <Tab label="Standings" value="standings" />
            <Tab label="Rules & Info" value="rules" />
            <Tab label="Play Stats" value="play-stats" />
            <Tab label="Blog" value="blog" />
            {nickId() > 0 && <Tab label="Personal" value="personal" />}
            {nickId() > 0 && <Tab label="Team" value="team" />}
            {isCupAdmin && <Tab label="Admin" value="admin" />}
          </Tabs>
          <CupCover cup={cup} />
          {!tab ? <Dashboard cup={cup} events={events} /> : null}
          {tab === 'events' ? (
            <div>
              {!eventNumber ? (
                <Events
                  eventNumber={1}
                  eventTab="results"
                  cup={cup}
                  events={events}
                />
              ) : null}
              {eventNumber && !eventTab ? (
                <Events
                  eventTab="results"
                  cup={cup}
                  events={events}
                  eventNumber={eventNumber}
                />
              ) : null}
              {eventNumber && eventTab ? (
                <Events
                  cup={cup}
                  events={events}
                  eventNumber={eventNumber}
                  eventTab={eventTab}
                />
              ) : null}
            </div>
          ) : null}
          {tab === 'standings' ? <Standings cup={cup} events={events} /> : null}
          {tab === 'rules' ? (
            <RulesInfo
              description={cup.Description}
              owner={admins(cup)}
              cup={cup}
              updateDesc={newDesc => {
                update({
                  CupGroupIndex: cup.CupGroupIndex,
                  shortName: cup.ShortName,
                  data: { Description: newDesc },
                });
              }}
            />
          ) : null}
          {tab === 'blog' ? (
            <Blog
              cup={cup}
              owner={admins(cup)}
              items={cup.CupBlog}
              addEntry={newBlog => {
                addNewBlog({ data: newBlog, shortName: cup.ShortName });
              }}
            />
          ) : null}
          {tab === 'personal' ? <Personal /> : null}
          {tab === 'team' ? <Team /> : null}
          {tab === 'admin' && isCupAdmin ? <Admin /> : null}
          {tab === 'play-stats' ? (
            <PlayStats path="play-stats" cup={cup} events={events} />
          ) : null}
        </>
      )}
    </Layout>
  );
};

export const CupCover = ({ cup, noBottomMargin = false }) => {
  const theme = useTheme();
  const cover = cup.Cover ? cup.Cover : null;
  let bgColor = null;
  let textColor = null;
  let hideHeadline = false;
  if (cover) {
    if (theme.type === 'dark' && cover.split('-')[2]) {
      bgColor = `#${cover.split('-')[2].split('.')[0]}`;
      if (cover.split('-')[4]) {
        textColor = `#${cover.split('-')[4].split('.')[0]}`;
      }
    } else if (cover.split('-')[1]) {
      bgColor = `#${cover.split('-')[1].split('.')[0]}`;
      if (cover.split('-')[3]) {
        textColor = `#${cover.split('-')[3].split('.')[0]}`;
      }
    }
    if (cover.split('-')[5]?.split('.')[0] === 'hide') {
      hideHeadline = true;
    }
  }
  return (
    <CupName noBottomMargin={noBottomMargin} bgColor={bgColor}>
      <CoverCon>
        <CoverHeadline>
          {cover ? <Img src={cover} alt="" /> : null}
          {hideHeadline ? null : <Header h1>{cup.CupName}</Header>}
        </CoverHeadline>
        <Description
          dangerouslySetInnerHTML={{ __html: cup.Description }}
          textColor={textColor}
        />
      </CoverCon>
    </CupName>
  );
};

const CupName = styled.div`
  padding: 8px;
  background-color: ${p => (p.bgColor ? p.bgColor : 'transparent')};
  ${p =>
    p.bgColor && !p.noBottomMargin ? `margin-bottom: ${p.theme.padSmall};` : ''}
  ${p => p.link && 'cursor: pointer;'}
  border: 1px solid black;
  h1 {
    margin: 0;
    margin-right: ${p => p.theme.padLarge};
    white-space: nowrap;
  }
`;

const Description = styled.div`
  padding-bottom: 8px;
  padding-top: 8px;
  ${p => (p.textColor ? `color: ${p.textColor};` : '')}
`;

const Img = styled.img`
  height: 100px;
  margin-right: ${p => p.theme.padLarge};
`;

const CoverCon = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const CoverHeadline = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 400px) {
    flex-direction: column;
  }
`;

export default Cups;
