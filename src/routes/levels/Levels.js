import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from 'isomorphic-style-loader/withStyles';
import Link from '../../components/Link';
import s from './Levels.css';

const GET_LEVELPACKS = gql`
  query {
    getLevelPacks {
      LevelPackIndex
      LevelPackLongName
      LevelPackName
      LevelPackDesc
      Levels {
        LevelIndex
      }
    }
  }
`;

const Levels = () => {
  return (
    <div className={s.root}>
      <Query query={GET_LEVELPACKS}>
        {({ data, loading, error }) => {
          if (loading) return null;
          if (error) return <div>something went wrong</div>;

          return [...data.getLevelPacks]
            .filter(p => p.Levels.length > 0)
            .sort((a, b) => {
              if (a.LevelPackName === 'Int') return -1;
              if (b.LevelPackName === 'Int') return 1;
              return a.LevelPackName.toLowerCase().localeCompare(
                b.LevelPackName.toLowerCase(),
              );
            })
            .map((p, i) => (
              <div
                key={p.LevelPackIndex}
                className={`${s.levelPackContainer} ${
                  i === 0 ? s.internals : ''
                }`}
              >
                <Link to={`/levels/packs/${p.LevelPackName}`}>
                  {i === 0 && <div className={s.internalsTitle}>Internals</div>}
                  <div className={s.shortName}>{p.LevelPackName}</div>
                  <div className={s.longName}>{p.LevelPackLongName}</div>
                  <div className={s.levelCount}>
                    {p.Levels.length} <span>levels</span>
                  </div>
                </Link>
              </div>
            ));
        }}
      </Query>
    </div>
  );
};

export default withStyles(s)(Levels);
