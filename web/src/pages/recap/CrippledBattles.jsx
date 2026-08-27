import React from 'react';
import { TextSmall } from './index';

const CrippledBattles = ({ data }) => {
  let t = '';
  const types = [
    data.Multi,
    data.HiddenTimes,
    data.SeeOthers,
    data.NoTurn,
    data.OneTurn,
    data.NoBrake,
    data.NoThrottle,
    data.AlwaysThrottle,
    data.OneWheel,
  ];
  const texts = [
    'multi',
    'hidden times',
    'shown',
    'no turn',
    'one turn',
    'no brake',
    'no throttle',
    'always throttle',
    'one wheel',
  ];
  types.forEach((type, index) => {
    if (type > 0) {
      t = `${t} ${parseInt(type)} ${texts[index]}, `;
    }
  });
  if (t.length > 0) {
    t = `also ${t.substring(0, t.length - 2)}`;
  }
  return <TextSmall white>{t}</TextSmall>;
};

export default CrippledBattles;
