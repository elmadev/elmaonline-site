import { Button } from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';

type PreviewRecButtonProps = {
  isPlaying: boolean;
  setPreviewRecIndex: (index: number | null) => void;
  CupTimeIndex: number;
};

export default function PreviewRecButton({
  isPlaying,
  setPreviewRecIndex,
  CupTimeIndex,
}: PreviewRecButtonProps) {
  const handleButtonClick = () => {
    const previewRecIndex = isPlaying ? null : CupTimeIndex;
    setPreviewRecIndex(previewRecIndex);
  };

  return (
    <Button onClick={handleButtonClick}>
      {isPlaying ? <Stop /> : <PlayArrow />}
    </Button>
  );
}
