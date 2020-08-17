import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import withStyles from 'isomorphic-style-loader/withStyles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Link from 'components/Link';
import history from 'utils/history';
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
/*
const GET_LEVELPACK_LEVELS = gql`
  query($id: Int!) {
    getLevelPackLevels(LevelPackIndex: $id) {
      LevelPackLevelIndex
    }
  }
`;
*/
const promote = 'Int';

const Levels = () => {
  return (
    <div className={s.root}>
      <Query query={GET_LEVELPACKS}>
        {({ data, loading, error }) => {
          if (loading) return null;
          if (error) return <div>something went wrong</div>;

          return [...data.getLevelPacks]
            .sort((a, b) => {
              if (a.LevelPackName === promote) return -1;
              if (b.LevelPackName === promote) return 1;
              return a.LevelPackName.toLowerCase().localeCompare(
                b.LevelPackName.toLowerCase(),
              );
            })
            .map(p => (
              <div
                key={p.LevelPackIndex}
                className={`${s.levelPackContainer} ${
                  p.LevelPackName === promote ? s.promote : ''
                }`}
              >
                <Link to={`/levels/packs/${p.LevelPackName}`}>
                  <div className={s.shortName}>{p.LevelPackName}</div>
                  <div className={s.longName}>{p.LevelPackLongName}</div>
                  {/* disabled until can make it faster
                  <div className={s.levelCount}>
                    <Query
                      query={GET_LEVELPACK_LEVELS}
                      variables={{ id: p.LevelPackIndex }}
                    >
                      {({ data, loading }) => {
                        if (loading) return null;
                        return data.getLevelPackLevels.length;
                      }}
                    </Query>{' '}
                    <span>levels</span>
                  </div> */}
                </Link>
              </div>
            ));
        }}
      </Query>
      <FabCon>
        <Fab
          color="primary"
          aria-label="Add"
          onClick={() => history.push(`/levels/add`)}
        >
          <AddIcon />
        </Fab>
      </FabCon>
    </div>
  );
};

const FabCon = styled.div`
  position: fixed;
  right: 30px;
  bottom: 30px;
`;

export default withStyles(s)(Levels);
