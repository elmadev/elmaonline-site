import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';

import Link from 'components/Link';

import s from './LevelPack.css';

const GET_LEVELPACK = gql`
  query($name: String!) {
    getLevelPack(LevelPackName: $name) {
      LevelPackLongName
      LevelPackName
      LevelPackDesc
      KuskiData {
        Kuski
      }
      Levels {
        LevelIndex
        LevelPackLevelIndex
        Level {
          LevelName
          LongName
        }
      }
    }
  }
`;

const LevelPack = ({ name }) => {
  return (
    <div className={s.root}>
      <Query query={GET_LEVELPACK} variables={{ name }}>
        {({ data: { getLevelPack }, loading, error }) => {
          if (loading) return null;
          if (error) return <div>something went wrong</div>;
          return (
            <React.Fragment>
              <div className={s.levelPackName}>
                <span className={s.shortName}>
                  {getLevelPack.LevelPackName}
                </span>{' '}
                <span className={s.longName}>
                  {getLevelPack.LevelPackLongName}
                </span>
              </div>
              <div className={s.description}>{getLevelPack.LevelPackDesc}</div>
              <h2>Levels</h2>
              <div className={s.levels}>
                <div className={s.tableHead}>
                  <span>Filename</span>
                  <span>Level name</span>
                </div>
                {getLevelPack.Levels.map(l => {
                  return (
                    <Link to={`/levels/${l.LevelIndex}`} key={l.LevelIndex}>
                      <span>{l.Level.LevelName}</span>
                      <span>{l.Level.LongName}</span>
                    </Link>
                  );
                })}
              </div>
            </React.Fragment>
          );
        }}
      </Query>
    </div>
  );
};

LevelPack.propTypes = {
  name: PropTypes.string.isRequired,
};

export default withStyles(s)(LevelPack);
