import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions, useStoreRehydrated } from 'easy-peasy';
import { Tabs, Tab } from '@material-ui/core';
import Layout from 'components/Layout';
import Tags from 'components/Tags';
import { nick, nickId, mod } from 'utils/nick';
import { Row } from 'components/Containers';
import Download from 'components/Download';
import Kuski from 'components/Kuski';
import Loading from 'components/Loading';
import ReplayList from 'features/ReplayList';
import Records from './Records';
import TotalTimes from './TotalTimes';
import Personal from './Personal';
import Kinglist from './Kinglist';
import MultiRecords from './MultiRecords';
import Crippled from './Crippled';
import Admin from './Admin';
import { useQueryAlt, LevelPackLevelStats } from '../../api';
import Menus from './Menus';
import RecordHistory from './RecordHistory';
import PlayStats from './PlayStats';

const LevelPack = () => {
  const { name, tab, subTab } = useParams({ strict: false });
  const isRehydrated = useStoreRehydrated();
  const {
    levelPackInfo,
    highlight,
    multiHighlight,
    personalKuski,
    settings: { highlightWeeks, showLegacy },
  } = useStoreState(state => state.LevelPack);

  const {
    getLevelPackInfo,
    getHighlight,
    getPersonalTimes,
    getStats,
    getRecordsOnly,
  } = useStoreActions(actions => actions.LevelPack);
  const lastShowLegacy = useRef(showLegacy);
  const navigate = useNavigate();

  const { data: levelStats } = useQueryAlt(
    ['LevelPackLevelStats', 1, name],
    async () => LevelPackLevelStats(1, name),
  );

  useEffect(() => {
    if (levelPackInfo.LevelPackName !== name) {
      getLevelPackInfo(name);
      getRecordsOnly({ name, eolOnly: showLegacy ? 0 : 1 });
      getStats({ name, eolOnly: showLegacy ? 0 : 1 });
      getHighlight();
      const PersonalKuskiIndex = nick();
      if (PersonalKuskiIndex !== '') {
        getPersonalTimes({
          PersonalKuskiIndex,
          name,
          eolOnly: showLegacy ? 0 : 1,
        });
      }
    }
  }, [name]);

  useEffect(() => {
    if (lastShowLegacy.current !== showLegacy) {
      lastShowLegacy.current = showLegacy;
      getRecordsOnly({ name, eolOnly: showLegacy ? 0 : 1 });
      getStats({ name, eolOnly: showLegacy ? 0 : 1 });
      if (personalKuski !== '') {
        getPersonalTimes({
          PersonalKuskiIndex: personalKuski,
          name,
          eolOnly: showLegacy ? 0 : 1,
        });
      }
    }
  }, [showLegacy]);

  if (!isRehydrated || !levelPackInfo.LevelPackIndex)
    return (
      <Layout edge t={`Level pack - ${name}`}>
        <Loading />
      </Layout>
    );

  const adminAuth = nickId() === levelPackInfo.KuskiIndex || mod();

  return (
    <Layout edge t={`Level pack - ${levelPackInfo.LevelPackName}`}>
      <RootStyle>
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={tab || ''}
          onChange={(e, value) => {
            if (value === 'crippled') {
              navigate({
                to: ['/levels/packs', name, 'crippled/noVolt'].join('/'),
              });
            } else {
              navigate({
                to: ['/levels/packs', name, value].filter(Boolean).join('/'),
              });
            }
          }}
        >
          <Tab label="Records" value="" />
          <Tab label="Total Times" value="total-times" />
          <Tab label="King list" value="king-list" />
          <Tab label="Personal" value="personal" />
          <Tab label="Multi records" value="multi" />
          <Tab label="Replays" value="replays" />
          <Tab label="Play Stats" value="play-stats" />
          <Tab label="Record History" value="record-history" />
          <Tab label="Crippled" value="crippled" />
          {adminAuth && <Tab label="Admin" value="admin" />}
        </Tabs>
        <Row b="Large">
          <div>
            <LevelPackName>
              <ShortNameStyled>{levelPackInfo.LevelPackName}</ShortNameStyled>{' '}
              <LongNameStyled>{levelPackInfo.LevelPackLongName}</LongNameStyled>
              <Download href={`pack/${levelPackInfo.LevelPackName}`}>
                <DownloadText>Download</DownloadText>
              </Download>
            </LevelPackName>
            <DescriptionStyle>
              {levelPackInfo.LevelPackDesc} - Maintainer:{' '}
              <Kuski kuskiData={levelPackInfo.KuskiData} />
              {levelPackInfo.Tags && (
                <Tags tags={levelPackInfo.Tags.map(tag => tag.Name)} />
              )}
            </DescriptionStyle>
          </div>
          {[
            'record-history',
            'replays',
            'admin',
            'multi',
            'play-stats',
            'crippled',
          ].indexOf(tab) === -1 && (
            <Menus name={name} hideFilter={tab === 'personal'} />
          )}
        </Row>
        {!tab && <Records levelStats={levelStats} />}
        {tab === 'total-times' && (
          <TotalTimes
            highlight={highlight}
            highlightWeeks={highlightWeeks}
            name={name}
          />
        )}
        {tab === 'king-list' && (
          <Kinglist
            highlight={highlight}
            highlightWeeks={highlightWeeks}
            name={name}
          />
        )}
        {tab === 'record-history' && (
          <RecordHistory levelPackInfo={levelPackInfo} />
        )}
        {tab === 'personal' && <Personal name={name} player={subTab} />}
        {tab === 'multi' && (
          <MultiRecords
            name={name}
            highlight={multiHighlight}
            highlightWeeks={highlightWeeks}
          />
        )}
        {tab === 'crippled' && (
          <Crippled
            LevelPack={levelPackInfo}
            crippleType={subTab}
            highlightWeeks={highlightWeeks}
          />
        )}
        {tab === 'replays' && (
          <ReplayList
            persist={`levelpack-${levelPackInfo.LevelPackIndex}`}
            nonsticky
            levelPack={levelPackInfo.LevelPackIndex}
          />
        )}
        {tab === 'play-stats' && <PlayStats LevelPack={levelPackInfo} />}
        {tab === 'admin' && adminAuth && <Admin />}
      </RootStyle>
    </Layout>
  );
};

const RootStyle = styled.div`
  background: ${p => p.theme.paperBackground};
  min-height: 100%;
  box-sizing: border-box;
`;

const LevelPackName = styled.div`
  font-size: 20px;
  padding: 10px;
`;

const ShortNameStyled = styled.span`
  font-weight: 500;
`;

const LongNameStyled = styled.span`
  color: #8c8c8c;
`;

const DescriptionStyle = styled.div`
  margin: 0 10px;
  font-size: 14px;
`;

const DownloadText = styled.span`
  padding-left: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
`;

export default LevelPack;
