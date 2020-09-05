import React, { useEffect } from 'react';
import CupCurrent from 'components/CupCurrent';
import Header from 'components/Header';
import { useStoreState, useStoreActions } from 'easy-peasy';

const CupWidget = ({ ShortName }) => {
  const { events, cup, lastCupShortName } = useStoreState(state => state.Cup);
  const { getCup } = useStoreActions(actions => actions.Cup);

  useEffect(() => {
    if (lastCupShortName !== ShortName) {
      getCup(ShortName);
    }
  }, []);

  return (
    <>
      {cup.ShortName === ShortName && (
        <>
          <Header h2>World Cup 8</Header>
          <CupCurrent events={events} />
        </>
      )}
    </>
  );
};

export default CupWidget;
