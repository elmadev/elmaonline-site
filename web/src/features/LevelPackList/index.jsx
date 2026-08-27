import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Grid } from '@material-ui/core';
import styled from '@emotion/styled';
import Link from 'components/Link';

const LevelPackList = ({ amount = 4, height = 0 }) => {
  const { data } = useStoreState(state => state.LevelPackList);
  const { fetch } = useStoreActions(actions => actions.LevelPackList);

  useEffect(() => {
    fetch(amount);
  }, []);

  return (
    <Scroll height={height}>
      <Grid container spacing={0}>
        {data?.length > 0 &&
          data.map((pack, index) => (
            <Grid key={pack.LevelPackIndex} item xs={6}>
              <Container odd={index % 2} title={pack.LevelPackDesc}>
                <Link to={`/levels/packs/${pack.LevelPackName}`}>
                  <Short>{pack.LevelPackName}</Short>
                  <Long>{pack.LevelPackLongName}</Long>
                  <By>by {pack.KuskiData.Kuski}</By>
                </Link>
              </Container>
            </Grid>
          ))}
      </Grid>
    </Scroll>
  );
};

const Scroll = styled.div`
  ${p => (p.height ? `max-height: ${p.height}px;` : '')}
  overflow-y: auto;
`;

const Container = styled.div`
  border-radius: 4px;
  border: 1px solid ${p => p.theme.borderColor};
  margin-top: 16px;
  margin-left: ${p => (p.odd ? '20px' : '24px')};
  margin-right: ${p => (p.odd ? '24px' : '20px')};
  :hover {
    background-color: ${p => p.theme.hoverColor};
    cursor: pointer;
  }
`;

const Text = styled.div`
  font-size: 14px;
  text-align: center;
`;

const Short = styled(Text)`
  font-weight: bold;
  margin-top: 8px;
`;

const Long = styled(Text)``;

const By = styled(Text)`
  margin-bottom: 16px;
  color: ${p => p.theme.lightTextColor};
`;

export default LevelPackList;
