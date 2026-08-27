import React from 'react';
import styled from '@emotion/styled';
import CardContent from '@material-ui/core/CardContent';
import { Tabs, Tab } from '@material-ui/core';
import { Install } from 'components/Welcome';
import Links from 'pages/help/tabs/Links';
import Programs from 'pages/help/tabs/Programs';
import Donate from 'pages/help/tabs/Donate';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Card, Cross } from '../';

export default function ExtrasCard() {
  const {
    extras: { setExtrasTab },
    cards: { setHidden },
  } = useStoreActions(actions => actions.Page);
  const {
    extras: { extrasTab },
  } = useStoreState(state => state.Page);
  return (
    <Card>
      <span title="Hide section">
        <Cross onClick={() => setHidden('extras')} />
      </span>
      <CardContent>
        <Tabs
          variant="fullWidth"
          scrollButtons="auto"
          value={extrasTab}
          onChange={(e, value) => {
            setExtrasTab(value);
          }}
        >
          <FixedTab label="Donate" value="donate" />
          <FixedTab label="Install" value="install" />
          <FixedTab label="Links" value="links" />
          <FixedTab label="Programs" value="programs" />
        </Tabs>
        {extrasTab === 'donate' && (
          <Con>
            <Donate small cached />
          </Con>
        )}
        {extrasTab === 'install' && (
          <Con>
            <Install />
          </Con>
        )}
        {extrasTab === 'links' && (
          <Con>
            <Links hideHeader />
          </Con>
        )}
        {extrasTab === 'programs' && (
          <ProgramsCon>
            <Programs hideHeader />
          </ProgramsCon>
        )}
      </CardContent>
    </Card>
  );
}

const FixedTab = styled(Tab)`
  && {
    min-width: 72px;
  }
`;

const Con = styled.div`
  padding-top: ${p => p.theme.padMedium};
`;

const ProgramsCon = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;
