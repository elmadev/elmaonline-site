import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const Cups = () => {
  const { cupList } = useStoreState(state => state.Cups);
  const { getCups } = useStoreActions(actions => actions.Cups);

  useEffect(() => {
    getCups();
  }, []);

  if (!cupList) {
    return null;
  }

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Ongoing Cups
      </Typography>
      {cupList
        .filter(c => c.Finished === 0)
        .map(c => (
          <>
            <CupName>{c.CupName}</CupName>
            <Description dangerouslySetInnerHTML={{ __html: c.Description }} />
          </>
        ))}
      <Typography variant="h3" gutterBottom>
        Finished Cups
      </Typography>
      {cupList
        .filter(c => c.Finished === 1)
        .map(c => (
          <>
            <CupName>{c.CupName}</CupName>
            <Description dangerouslySetInnerHTML={{ __html: c.Description }} />
          </>
        ))}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const CupName = styled.div`
  font-weight: 500;
  color: #219653;
`;

const Description = styled.div`
  font-size: 13px;
  padding-bottom: 12px;
`;

export default Cups;
