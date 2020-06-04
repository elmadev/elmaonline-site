import React, { useState } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from 'isomorphic-style-loader/withStyles';
import styled from 'styled-components';

import Link from 'components/Link';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import LevelPopup from './LevelPopup';

// eslint-disable-next-line css-modules/no-unused-class
import s from './LevelPack.css';

const GET_BEST_TIME = gql`
  query($LevelIndex: Int!) {
    getBestTimes(LevelIndex: $LevelIndex, Limit: 1) {
      TimeIndex
      KuskiIndex
      Time
      KuskiData {
        Kuski
        Country
        TeamData {
          Team
        }
      }
    }
  }
`;

const Records = ({ getLevelPack, highlight, highlightWeeks }) => {
  const [level, selectLevel] = useState(-1);

  return (
    <>
      <h2>Levels</h2>
      <div className={s.levels}>
        <div className={s.tableHead}>
          <span>Filename</span>
          <span>Level name</span>
          <span>Kuski</span>
          <span>Time</span>
        </div>
        {getLevelPack.Levels.map(l => {
          return (
            <TimeRow
              to={`/levels/${l.LevelIndex}`}
              key={l.LevelIndex}
              onClick={e => {
                e.preventDefault();
                selectLevel(level === l.LevelIndex ? -1 : l.LevelIndex);
              }}
              selected={level === l.LevelIndex}
            >
              <span>{l.Level.LevelName}</span>
              <span>{l.Level.LongName}</span>
              <Query
                query={GET_BEST_TIME}
                variables={{ LevelIndex: l.LevelIndex }}
              >
                {({ data: { getBestTimes } }) => {
                  if (!getBestTimes || getBestTimes.length < 1)
                    return (
                      <>
                        <span />
                        <span />
                      </>
                    );

                  return getBestTimes.map(t => {
                    return (
                      <React.Fragment key={t.TimeIndex}>
                        <span>
                          <Kuski kuskiData={t.KuskiData} team flag />
                        </span>
                        <TimeSpan
                          highlight={t.TimeIndex >= highlight[highlightWeeks]}
                        >
                          <Time time={t.Time} />
                        </TimeSpan>
                      </React.Fragment>
                    );
                  });
                }}
              </Query>
            </TimeRow>
          );
        })}
      </div>
      {level !== -1 && (
        <LevelPopup
          highlight={highlight[highlightWeeks]}
          levelId={level}
          close={() => {
            selectLevel(-1);
          }}
        />
      )}
    </>
  );
};

const TimeRow = styled(Link)`
  background: ${p => (p.selected ? '#219653' : 'transparent')};
  color: ${p => (p.selected ? '#fff' : 'inherit')};
  :hover {
    background: ${p => (p.selected ? '#219653' : '#f9f9f9')};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
`;

const TimeSpan = styled.span`
  background: ${p => (p.highlight ? '#dddddd' : 'transparent')};
`;

export default withStyles(s)(Records);
