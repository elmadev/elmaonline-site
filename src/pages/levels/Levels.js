import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Fab } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import Link from 'components/Link';
import history from 'utils/history';

const promote = 'Int';

const Levels = () => {
  const { levelpacks } = useStoreState(state => state.Levels);
  const { getLevelpacks } = useStoreActions(actions => actions.Levels);
  useEffect(() => {
    getLevelpacks();
  }, []);
  return (
    <Container>
      {levelpacks.length > 0 &&
        levelpacks
          .sort((a, b) => {
            if (a.LevelPackName === promote) return -1;
            if (b.LevelPackName === promote) return 1;
            return a.LevelPackName.toLowerCase().localeCompare(
              b.LevelPackName.toLowerCase(),
            );
          })
          .map(p => (
            <LevelPackContainer
              promote={p.LevelPackName === promote}
              key={p.LevelPackIndex}
            >
              <Link to={`/levels/packs/${p.LevelPackName}`}>
                <ShortName>{p.LevelPackName}</ShortName>
                <LongName>{p.LevelPackLongName}</LongName>
              </Link>
            </LevelPackContainer>
          ))}
      <FabCon>
        <Fab
          color="primary"
          aria-label="Add"
          onClick={() => history.push(`/levels/add`)}
        >
          <AddIcon />
        </Fab>
      </FabCon>
    </Container>
  );
};

const FabCon = styled.div`
  position: fixed;
  right: 30px;
  bottom: 30px;
`;

const Container = styled.div`
  padding-bottom: 50px;
  overflow: hidden;
`;

const LevelPackContainer = styled.div`
  float: left;
  width: ${p => (p.promote ? '40%' : '20%')};
  height: ${p => (p.promote ? '200px' : '100px')};
  padding-left: 1px;
  padding-top: 1px;
  box-sizing: border-box;
  > a {
    display: block;
    background: #fff;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    color: inherit;
    overflow: hidden;
    position: relative;
    :hover {
      background: #f9f9f9;
    }
  }
  @media (max-width: 1350px) {
    width: ${p => (p.promote ? '50%' : '25%')};
  }
  @media (max-width: 1160px) {
    width: calc(100% / 3);
  }
  @media (max-width: 730px) {
    width: 50%;
  }
  @media (max-width: 480px) {
    width: 100%;
    height: unset;
  }
`;

const ShortName = styled.div`
  font-weight: 500;
  color: #219653;
`;

const LongName = styled.div`
  font-size: 13px;
`;

export default Levels;
