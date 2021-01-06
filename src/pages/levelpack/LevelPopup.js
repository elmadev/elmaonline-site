import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Link from 'components/Link';
import LegacyIcon from 'styles/LegacyIcon';
import { ListCell, ListContainer, ListHeader, ListRow } from 'styles/List';

const LevelPopup = ({
  levelId,
  KuskiIndex,
  close,
  highlight,
  multi,
  showLegacyIcon,
  levelName,
  longName,
}) => {
  const {
    personalAllFinished,
    levelBesttimes,
    levelMultiBesttimes,
    settings: { showLegacy },
  } = useStoreState(state => state.LevelPack);
  const {
    getPersonalAllFinished,
    getLevelBesttimes,
    getLevelMultiBesttimes,
  } = useStoreActions(actions => actions.LevelPack);
  const [timesLimit, setTimesLimit] = useState(10);

  useEffect(() => {
    if (levelId !== -1) {
      if (KuskiIndex) {
        getPersonalAllFinished({
          LevelIndex: levelId,
          KuskiIndex,
          limit: timesLimit,
          eolOnly: showLegacy ? 0 : 1,
        });
      } else if (multi) {
        getLevelMultiBesttimes({ levelId, limit: timesLimit });
      } else {
        getLevelBesttimes({
          levelId,
          limit: timesLimit,
          eolOnly: showLegacy ? 0 : 1,
        });
      }
    }
  }, [levelId, timesLimit]);

  const times = multi ? levelMultiBesttimes : levelBesttimes;

  return (
    <LevelPopUpCon>
      <LevelTimesContainer>
        <Title>
          <Link to={`/levels/${levelId}`}>{levelName}.lev</Link>
          <br />
          {longName}
          <ClosePopUp
            tabIndex="0"
            role="button"
            onClick={close}
            onKeyPress={close}
          >
            &times;
          </ClosePopUp>
        </Title>
        <h2>Top-{timesLimit.toLocaleString()} times</h2>
        <ListContainer>
          <ListHeader>
            <ListCell width={40}>#</ListCell>
            {!KuskiIndex && !multi && <ListCell width={220}>Kuski</ListCell>}
            {multi && (
              <>
                <ListCell width={220}>Kuski</ListCell>
                <ListCell width={220}>Kuski</ListCell>
              </>
            )}
            <ListCell>Time</ListCell>
            {times.length > 0 && times[0].Source !== undefined && <ListCell />}
            {personalAllFinished.length > 0 &&
              personalAllFinished[0].Source !== undefined && <ListCell />}
          </ListHeader>
          {!KuskiIndex ? (
            <>
              {times.map((t, i) => {
                return (
                  <ListRow key={multi ? t.BestMultiTimeIndex : t.BestTimeIndex}>
                    <ListCell width={40}>{i + 1}.</ListCell>
                    {multi ? (
                      <>
                        <ListCell width={220}>
                          <Kuski kuskiData={t.Kuski1Data} team flag />
                        </ListCell>
                        <ListCell width={220}>
                          <Kuski kuskiData={t.Kuski2Data} team flag />
                        </ListCell>
                        <TimeSpan highlight={t.TimeIndex >= highlight}>
                          <Time time={t.Time} />
                        </TimeSpan>
                      </>
                    ) : (
                      <>
                        <ListCell width={220}>
                          <Kuski kuskiData={t.KuskiData} team flag />
                        </ListCell>
                        <TimeSpan highlight={t.TimeIndex >= highlight}>
                          <Time time={t.Time} />
                        </TimeSpan>
                        {t.Source !== undefined && (
                          <LegacyIcon source={t.Source} show={showLegacyIcon} />
                        )}
                      </>
                    )}
                  </ListRow>
                );
              })}
            </>
          ) : (
            <>
              {personalAllFinished.map((t, i) => {
                return (
                  <ListRow key={`${t.TimeIndex}${t.Time}`}>
                    <ListCell width={40}>{i + 1}.</ListCell>
                    <TimeSpan highlight={t.TimeIndex >= highlight}>
                      <Time time={t.Time} />
                    </TimeSpan>
                    {t.Source !== undefined && (
                      <LegacyIcon source={t.Source} show={showLegacyIcon} />
                    )}
                  </ListRow>
                );
              })}
            </>
          )}
        </ListContainer>
        <ShowMoreCon>
          {timesLimit === 10 ? (
            <ShowMore onClick={() => setTimesLimit(10000)}>Show more</ShowMore>
          ) : (
            <ShowMore onClick={() => setTimesLimit(10)}>Show less</ShowMore>
          )}
        </ShowMoreCon>
      </LevelTimesContainer>
    </LevelPopUpCon>
  );
};

const ShowMore = styled.span`
  color: #219653;
  cursor: pointer;
`;

const TimeSpan = styled(ListCell)`
  background: ${p => (p.highlight ? '#dddddd' : 'transparent')};
`;

const ShowMoreCon = styled.div`
  padding: 10px;
  font-size: 14px;
`;

const LevelPopUpCon = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 800px;
  height: 100vh;
  background: #fff;
  box-sizing: border-box;
  padding-top: 50px;
  border-left: 1px solid #eaeaea;
  @media (max-width: 1150px) {
    left: 650px;
  }
  @media (max-width: 999px) {
    left: 50%;
  }
  @media (max-width: 600px) {
    left: 0;
  }
`;

const LevelTimesContainer = styled.div`
  max-height: 100%;
  overflow: auto;
`;

const Title = styled.div`
  font-weight: 500;
  padding: 10px;
  position: relative;
`;

const ClosePopUp = styled.div`
  position: absolute;
  right: 0;
  font-size: 25px;
  top: 0;
  padding: 10px;
  padding-top: 0;
  cursor: pointer;
`;

export default LevelPopup;
