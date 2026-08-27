import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Kuski from 'components/Kuski';
import Time from 'components/Time';
import LevelMap from 'features/LevelMap';
import Header from 'components/Header';
import Link from 'components/Link';
import LegacyIcon from 'components/LegacyIcon';
import LocalTime from 'components/LocalTime';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';
import { FixedSizeList as List } from 'react-window';
import useElementSize from 'utils/useWindowSize';
import { Column, Row } from 'components/Containers';

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
    team,
    country,
  } = useStoreState(state => state.LevelPack);
  const { getPersonalAllFinished, getLevelBesttimes, getLevelMultiBesttimes } =
    useStoreActions(actions => actions.LevelPack);
  const [timesLimit, setTimesLimit] = useState(10);

  // calculate height for react-window
  const HeaderConRef = useRef(null);
  const LevelPopUpConSize = useElementSize();
  const listHeight =
    LevelPopUpConSize.height - 50 - HeaderConRef?.current?.clientHeight - 40;

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
          filter: team ? 'team' : country ? 'country' : null,
          filterValue: team ? team : country ? country : null,
        });
      }
    }
  }, [levelId, timesLimit]);

  const times = multi ? levelMultiBesttimes : levelBesttimes;

  return (
    <LevelPopUpCon>
      <LevelTimesContainer>
        <HeaderCon ref={HeaderConRef}>
          <Row jc="space-between" r="XLarge">
            <Column jc="space-between">
              <Title>
                <Link to={`/levels/${levelId}`}>{levelName}.lev</Link>
                <br />
                {longName}
              </Title>
              <Header h2 mLeft>
                Top-{timesLimit.toLocaleString()} times
              </Header>
            </Column>
            <LevelMap LevelIndex={levelId} width="50%" />
            <ClosePopUp
              tabIndex="0"
              role="button"
              onClick={close}
              onKeyPress={close}
            >
              &times;
            </ClosePopUp>
          </Row>
          <ListContainer>
            <ListHeader>
              <ListCell width={40}>#</ListCell>
              {!KuskiIndex && !multi && <ListCell width={220}>Kuski</ListCell>}
              {multi && (
                <>
                  <ListCell width={176}>Kuski</ListCell>
                  <ListCell width={176}>Kuski</ListCell>
                </>
              )}
              <ListCell width={!multi ? 140 : undefined}>Time</ListCell>
              {!multi && <ListCell>Driven</ListCell>}
              {times.length > 0 && times[0].Source !== undefined && (
                <ListCell />
              )}
              {personalAllFinished.length > 0 &&
                personalAllFinished[0].Source !== undefined && <ListCell />}
            </ListHeader>
          </ListContainer>
        </HeaderCon>
        <ListContainer flex>
          {!KuskiIndex ? (
            <>
              <List
                height={!isNaN(listHeight) ? listHeight : 0}
                itemCount={times.length}
                itemSize={40}
              >
                {({ index, style }) => {
                  const t = times[index];
                  return (
                    <div
                      style={style}
                      key={multi ? t.BestMultiTimeIndex : t.BestTimeIndex}
                    >
                      <ListRow>
                        <ListCell width={40}>{index + 1}.</ListCell>
                        {multi ? (
                          <>
                            <ListCell width={176}>
                              <Kuski kuskiData={t.Kuski1Data} team flag />
                            </ListCell>
                            <ListCell width={176}>
                              <Kuski kuskiData={t.Kuski2Data} team flag />
                            </ListCell>
                            <ListCell
                              highlight={
                                multi
                                  ? t.MultiTimeIndex >= highlight
                                  : t.TimeIndex >= highlight
                              }
                            >
                              <Time time={t.Time} />
                            </ListCell>
                          </>
                        ) : (
                          <>
                            <ListCell width={220}>
                              <Kuski kuskiData={t.KuskiData} team flag />
                            </ListCell>
                            <ListCell
                              highlight={t.TimeIndex >= highlight}
                              width={140}
                            >
                              <Time time={t.Time} />
                            </ListCell>
                            <ListCell width={110}>
                              <LocalTime
                                date={t.Driven}
                                format="d MMM yyyy"
                                parse="X"
                              />
                            </ListCell>
                            {t.Source !== undefined && (
                              <ListCell right>
                                <LegacyIcon
                                  source={t.Source}
                                  show={showLegacyIcon}
                                />
                              </ListCell>
                            )}
                          </>
                        )}
                      </ListRow>
                    </div>
                  );
                }}
              </List>
            </>
          ) : (
            <>
              <List
                height={!isNaN(listHeight) ? listHeight : 0}
                itemCount={personalAllFinished.length}
                itemSize={40}
              >
                {({ index, style }) => {
                  const t = personalAllFinished[index];
                  return (
                    <div style={style} key={`${t.TimeIndex}${t.Time}`}>
                      <ListRow>
                        <ListCell width={40}>{index + 1}.</ListCell>
                        <ListCell
                          highlight={t.TimeIndex >= highlight}
                          width={140}
                        >
                          <Time time={t.Time} />
                        </ListCell>
                        <ListCell width={110}>
                          <LocalTime
                            date={t.Driven}
                            format="d MMM yyyy"
                            parse="X"
                          />
                        </ListCell>
                        {t.Source !== undefined && (
                          <ListCell right>
                            <LegacyIcon
                              source={t.Source}
                              show={showLegacyIcon}
                            />
                          </ListCell>
                        )}
                      </ListRow>
                    </div>
                  );
                }}
              </List>
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

const HeaderCon = styled.div`
  display: flex;
  flex-direction: column;
`;

const ShowMore = styled.span`
  color: ${p => p.theme.linkColor};
  cursor: pointer;
`;

const ShowMoreCon = styled.div`
  padding: 10px;
  font-size: 14px;
`;

const LevelPopUpCon = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 1050px;
  height: 100vh;
  background: ${p => p.theme.paperBackground};
  box-sizing: border-box;
  padding-top: 50px;
  border-left: 1px solid #eaeaea;
  @media (max-width: 1400px) {
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
  overflow: hidden;
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
  margin-top: 50px;
`;

export default LevelPopup;
