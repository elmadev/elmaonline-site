import React, { useEffect } from 'react';
import CupCurrent from 'components/CupCurrent';
import Header from 'components/Header';
import { CardContent, Grid } from '@material-ui/core';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useNavigate } from '@tanstack/react-router';
import { isEmpty } from 'lodash';
import { Card, Cross } from 'pages/home';

const CupWidget = ({ onCross = null }) => {
  const navigate = useNavigate();
  const [status, cups] = useStoreState(state => state.Cup.onGoingCups);
  const { getOnGoingCups } = useStoreActions(actions => actions.Cup);

  useEffect(() => {
    if (status === 'default') {
      getOnGoingCups();
    }
  }, [status]);

  if (isEmpty(cups)) {
    return null;
  }

  return (
    <Grid item xs={12}>
      <Card>
        {onCross ? (
          <span title="Hide section">
            <Cross onClick={() => onCross()} />
          </span>
        ) : null}
        <CardContent>
          <Header h2>Events</Header>
          {cups.map(cup => {
            const events = cup.SiteCupData;
            return (
              <CupRoot key={cup.CupGroupIndex}>
                <Header
                  onClick={() => navigate({ to: `/cup/${cup.ShortName}` })}
                  h2
                >
                  {cup.CupName}
                </Header>
                <CupCurrent events={events} ShortName={cup.ShortName} />
              </CupRoot>
            );
          })}
        </CardContent>
      </Card>
    </Grid>
  );
};

const CupRoot = styled.div`
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export default CupWidget;
