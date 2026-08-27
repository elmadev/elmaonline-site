import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Tabs, Tab } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import styled from '@emotion/styled';
import Layout from 'components/Layout';
import Loading from 'components/Loading';
import Flag from 'components/Flag';
import Avatar from 'components/Avatar';
import ReplayList from 'features/ReplayList';
import Notifications from 'features/Notifications';
import PlayedBattles from './PlayedBattles';
import DesignedBattles from './DesignedBattles';
import KuskiHeader from './KuskiHeader';
import TimesReplays from './TimesReplays';
import Info from './Info';
import Records from './Records';
import Files from './Files';
import { isEmpty } from 'lodash';
import LevelList from '../../features/LevelList';

const Kuski = () => {
  const { name, tab, recordSort } = useParams({ strict: false });
  const { getKuskiByName, setCollapse } = useStoreActions(state => state.Kuski);
  const {
    kuski,
    kuskiLoading,
    settings: { collapse },
  } = useStoreState(state => state.Kuski);
  const { username } = useStoreState(state => state.Login);
  const navigate = useNavigate();

  useEffect(() => {
    getKuskiByName(name);
  }, [name]);

  return (
    <Layout edge t={`Kuski - ${name}`}>
      {!kuski ? (
        <>{kuskiLoading ? <Loading /> : <div>not found</div>}</>
      ) : (
        <Container chin={tab !== 'times' && tab !== 'files'}>
          <Head>
            <Avatar kuski={kuski} collapse={collapse} />
            <Profile>
              <Name>
                <Flag nationality={kuski.Country} />
                {kuski.Kuski}
              </Name>
              <TeamNat>
                {kuski.TeamData && `Team: ${kuski.TeamData.Team}`}
              </TeamNat>
            </Profile>
            <KuskiHeader KuskiIndex={kuski.KuskiIndex} Kuski={kuski.Kuski} />
            <Expand>
              {collapse ? (
                <ExpandMore onClick={() => setCollapse(false)} />
              ) : (
                <ExpandLess onClick={() => setCollapse(true)} />
              )}
            </Expand>
          </Head>
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            value={tab || ''}
            onChange={(e, t) =>
              navigate({ to: ['/kuskis', name, t].filter(Boolean).join('/') })
            }
          >
            <Tab label="Played Battles" value="" />
            <Tab label="Designed Battles" value="designed-battles" />
            <Tab label="Records" value="records" />
            <Tab label="Times" value="times" />
            <Tab label="Levels Added" value="levels-added" />
            <Tab label="Replays Uploaded" value="replays-uploaded" />
            <Tab label="Replays Driven" value="replays-driven" />
            <Tab label="Info" value="info" />
            {username === name && (
              <Tab label="Notifications" value="notifications" />
            )}
            {username === name && <Tab label="Files" value="files" />}
          </Tabs>
          {!tab && (
            <Width100>
              <PlayedBattles KuskiIndex={kuski.KuskiIndex} />
            </Width100>
          )}
          {tab === 'designed-battles' && (
            <Width100>
              <DesignedBattles KuskiIndex={kuski.KuskiIndex} />
            </Width100>
          )}
          {tab === 'times' && (
            <TimesReplays KuskiIndex={kuski.KuskiIndex} collapse={collapse} />
          )}
          {tab === 'records' && !isEmpty(kuski) && (
            <Records kuski={kuski} sort={recordSort} />
          )}
          {tab === 'levels-added' && !isEmpty(kuski) && (
            <Width100>
              <LevelList nonsticky defaultAddedBy={kuski.KuskiIndex} />
            </Width100>
          )}
          {tab === 'replays-uploaded' && (
            <Width100>
              <ReplayList
                persist={`kuski-uploaded-${kuski.KuskiIndex}`}
                nonsticky
                uploadedBy={kuski.KuskiIndex}
              />
            </Width100>
          )}
          {tab === 'replays-driven' && (
            <Width100>
              <ReplayList
                persist={`kuski-driven-${kuski.KuskiIndex}`}
                nonsticky
                drivenBy={kuski.KuskiIndex}
              />
            </Width100>
          )}
          {tab === 'info' && <Info kuskiInfo={kuski} />}
          {tab === 'notifications' && username === name && <Notifications />}
          {tab === 'files' && username === name && (
            <Files collapse={collapse} />
          )}
        </Container>
      )}
    </Layout>
  );
};

const Width100 = styled.div`
  max-width: 100%;
  overflow: auto;
`;

const Container = styled.div`
  min-height: 100%;
  background: ${p => p.theme.paperBackground};
  padding-bottom: ${p => (p.chin ? '200px' : '0')};
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
  position: relative;
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

const Expand = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Kuski;
