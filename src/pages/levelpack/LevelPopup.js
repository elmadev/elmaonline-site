import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from 'isomorphic-style-loader/withStyles';
import styled from 'styled-components';

import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Link from 'components/Link';

// eslint-disable-next-line css-modules/no-unused-class
import s from './LevelPack.css';

const GET_LEVEL = gql`
  query($LevelIndex: Int!) {
    getBestTimes(LevelIndex: $LevelIndex, Limit: 10) {
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
    getLevel(LevelIndex: $LevelIndex) {
      LevelName
      LongName
    }
  }
`;

const LevelPopup = ({ levelId, close, highlight }) => {
  return (
    <div className={s.levelPopup}>
      <Query query={GET_LEVEL} variables={{ LevelIndex: levelId }}>
        {({ data: { getBestTimes, getLevel }, loading }) => {
          if (loading) return null;

          return (
            <>
              <div className={s.levelTimesContainer}>
                <div className={s.title}>
                  {getLevel.LevelName}.lev
                  <br />
                  {getLevel.LongName}
                  <div
                    tabIndex="0"
                    role="button"
                    className={s.closePopup}
                    onClick={close}
                    onKeyPress={close}
                  >
                    &times;
                  </div>
                </div>
                <h2>Top-10 times</h2>
                <div className={s.levelTimes}>
                  <div className={s.tableHead}>
                    <span>#</span>
                    <span>Kuski</span>
                    <span>Time</span>
                  </div>
                  {getBestTimes.map((t, i) => {
                    return (
                      <div key={t.TimeIndex}>
                        <span>{i + 1}.</span>
                        <span>
                          <Kuski kuskiData={t.KuskiData} team flag />
                        </span>
                        <TimeSpan highlight={t.TimeIndex > highlight}>
                          <Time time={t.Time} />
                        </TimeSpan>
                      </div>
                    );
                  })}
                </div>
                <div className={s.showMore}>
                  <Link to={`/levels/${levelId}`}>Go to level page</Link>
                </div>
              </div>
            </>
          );
        }}
      </Query>
    </div>
  );
};

const TimeSpan = styled.span`
  background: ${p => (p.highlight ? '#dddddd' : 'transparent')};
`;

export default withStyles(s)(LevelPopup);
