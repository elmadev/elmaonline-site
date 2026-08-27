import React from 'react';
import CupWidget from 'components/CupWidget';
import { useStoreActions } from 'easy-peasy';

export default function FeedCard() {
  const {
    cards: { setHidden },
  } = useStoreActions(actions => actions.Page);
  return <CupWidget onCross={() => setHidden('events')} />;
}
