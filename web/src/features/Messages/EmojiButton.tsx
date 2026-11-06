import { lazy, Suspense, useState } from 'react';
import styled from '@emotion/styled';
import { IconButton, Popover } from '@mui/material';
import { SentimentSatisfiedAltOutlined } from '@mui/icons-material';
import Loading from 'components/Loading';

// frimousse and the emoji data load the first time the picker is opened
const EmojiPickerPanel = lazy(() => import('./EmojiPickerPanel'));

const EmojiButton = ({ onSelect }: { onSelect: (emoji: string) => void }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <IconButton
        aria-label="emoji"
        title="Emoji"
        onClick={e => setAnchorEl(e.currentTarget)}
      >
        <SentimentSatisfiedAltOutlined />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <PanelSize>
          <Suspense fallback={<Loading />}>
            <EmojiPickerPanel
              onSelect={emoji => {
                onSelect(emoji);
                setAnchorEl(null);
              }}
            />
          </Suspense>
        </PanelSize>
      </Popover>
    </>
  );
};

const PanelSize = styled.div`
  width: 304px;
  height: 360px;
  max-width: calc(100vw - 32px);
`;

export default EmojiButton;
