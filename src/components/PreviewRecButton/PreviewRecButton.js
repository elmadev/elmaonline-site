/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';

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
          <PlayArrowIcon />
        </Button>
      )}
      {isPlaying && (
        <Button onClick={handleButtonClick}>
          <StopIcon />
        </Button>
      )}
    </>
  );
}
