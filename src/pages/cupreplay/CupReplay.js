import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Recplayer from 'components/Recplayer';
import Header from 'components/Header';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import { Level } from 'components/Names';
import Link from 'components/Link';
import { Paper } from 'styles/Paper';
import { ListCell, ListContainer, ListHeader, ListRow } from 'styles/List';
import historyRefresh from 'utils/historyRefresh';
import Loading from 'components/Loading';
/* import { Level } from 'components/Names';
import RecList from 'components/RecList';
import ReplayComments from 'components/ReplayComments';
import ReplayRating from 'components/ReplayRating';
import AddComment from 'components/AddComment'; */

const goToReplay = (index, filename) => {
  historyRefresh.push(`/r/cup/${index}/${filename}`);
};

const CupReplays = ({ ReplayIndex, Filename }) => {
  const { replay, replayLoaded, otherReplays } = useStoreState(
    state => state.Replay,
  );
  const { getReplay, getOtherReplays } = useStoreActions(
    actions => actions.Replay,
  );
  const { sideBarVisible } = useStoreState(state => state.Page);
  const { hideSideBar, showSideBar } = useStoreActions(actions => actions.Page);
  const [lastSideBar] = useState(sideBarVisible);

  useEffect(() => {
    hideSideBar();
    return function cleanup() {
      if (lastSideBar) {
        showSideBar();
      }
    };
  }, []);

  useEffect(() => {
    getReplay(ReplayIndex);
  }, [ReplayIndex]);

  useEffect(() => {
    if (replayLoaded) {
      if (replay.CupData) {
        getOtherReplays({
          cupGroupIndex: replay.CupData.CupGroupIndex,
          cupIndex: replay.CupIndex,
        });
      }
    }
  }, [replay, replayLoaded, ReplayIndex]);

  if (!replayLoaded) return <Loading />;
  if (!replay.CupData) return <div>Unable to load replay</div>;

  let others = [];
  if (otherReplays.length > 0) {
    if (otherReplays[0].CupTimes.length > 0) {
      others = otherReplays[0].CupTimes.filter(t => t.Replay);
    }
  }
  let recName = '';
  if (replay.KuskiData) {
    recName = Filename.replace(replay.KuskiData.Kuski.substring(0, 6), '');
  }

  return (
    <Container>
      <RecBackground>
        <RecContainer>
          <Recplayer
            rec={`/dl/cupreplay/${ReplayIndex}/${Filename}`}
            lev={`/dl/level/${replay.CupData.LevelIndex}`}
            controls
          />
        </RecContainer>
      </RecBackground>
      <PaperCon>
        <Paper style={{ width: '100%' }}>
          <Info>
            <Half>
              <Header h1>{Filename}.rec</Header>
              <Header h3>
                <Kuski kuskiData={replay.KuskiData} team flag />
              </Header>
            </Half>
            <Half>
              <Header h1 right>
                <a href={`/dl/cupreplay/${ReplayIndex}/${Filename}`}>
                  <Time time={replay.Time} />
                </a>
              </Header>
              <Header h3 right>
                <Link to={`/levels/${replay.CupData.LevelIndex}`}>
                  <Level LevelData={replay.CupData.Level} />
                  .lev
                </Link>
              </Header>
            </Half>
            {/* <ReplayRating ReplayIndex={getReplayByUuid.ReplayIndex} /> */}
          </Info>
        </Paper>
      </PaperCon>
      <PaperCon>
        <Left>
          <Paper>
            <ListContainer>
              <ListHeader>
                <ListCell>Filename</ListCell>
                <ListCell>Player</ListCell>
                <ListCell>Time</ListCell>
              </ListHeader>
              {others.length > 0 && (
                <>
                  {others.map(t => (
                    <ListRow
                      key={t.CupTimeIndex}
                      selected={t.CupTimeIndex === replay.CupTimeIndex}
                      onClick={() =>
                        goToReplay(
                          t.CupTimeIndex,
                          `${recName}${t.KuskiData.Kuski.substring(0, 6)}`,
                        )
                      }
                    >
                      <ListCell>
                        {recName}
                        {t.KuskiData.Kuski.substring(0, 6)}
                      </ListCell>
                      <ListCell>
                        <Kuski kuskiData={t.KuskiData} />
                      </ListCell>
                      <ListCell>
                        <Time apples={-1} time={t.Time} />
                      </ListCell>
                    </ListRow>
                  ))}
                </>
              )}
            </ListContainer>
          </Paper>
        </Left>
        <Right />
      </PaperCon>
      <Paper>
        {/* <AddComment
          add={() => {}}
          type="replay"
          index={getReplayByUuid.ReplayIndex}
        />
        <ReplayComments ReplayIndex={getReplayByUuid.ReplayIndex} /> */}
      </Paper>
    </Container>
  );
};

const Left = styled.div`
  flex: 2;
  padding-right: 8px;
`;

const Right = styled.div`
  flex: 1;
  padding-left: 8px;
`;

const Half = styled.div`
  flex: 1;
`;

const PaperCon = styled.div`
  max-width: 1246px;
  width: 100%;
  padding-top: 16px;
  flex-direction: row;
  display: flex;
`;

const Info = styled.div`
  padding: 8px;
  padding-top: 0;
  display: flex;
  flex-direction: row;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const RecContainer = styled.div`
  max-height: 623px;
  max-width: 1246px;
  width: 100%;
  height: 623px;
`;

const RecBackground = styled.div`
  width: 100%;
  height: 623px;
  background-image: linear-gradient(#000000, #192638);
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export default CupReplays;
