import React from 'react';
import { Button } from '@material-ui/core';
import { PlayArrow, Stop } from '@material-ui/icons';

export default function PreviewRecButton({
  isPlaying,
  setPreviewRecIndex,
  CupTimeIndex,
}) {
  const handleButtonClick = () => {
    const previewRecIndex = isPlaying ? null : CupTimeIndex;
    setPreviewRecIndex(previewRecIndex);
  };

  return (
    <>
      {!isPlaying && (
        <Button onClick={handleButtonClick}>
          <PlayArrow />
        </Button>
      )}
      {isPlaying && (
        <Button onClick={handleButtonClick}>
          <Stop />
        </Button>
      )}
    </>
  );
}
