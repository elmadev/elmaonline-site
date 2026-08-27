import React from 'react';
import Recplayer from 'components/Recplayer';
import { useLocation } from '@tanstack/react-router';

const ReplayStandalone = () => {
  const location = useLocation();
  const { levUrl, recUrl } = location.search;

  if (!levUrl || !recUrl) {
    return <>Missing required query parameters.</>;
  }

  return <Recplayer rec={recUrl} lev={levUrl} controls />;
};

export default ReplayStandalone;
