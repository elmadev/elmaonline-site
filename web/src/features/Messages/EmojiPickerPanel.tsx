import styled from '@emotion/styled';
import { EmojiPicker } from 'frimousse';
import type {
  EmojiPickerListCategoryHeaderProps,
  EmojiPickerListEmojiProps,
  EmojiPickerListRowProps,
} from 'frimousse';
import { useStoreState, useStoreActions } from './storeHooks';

// loaded lazily by EmojiButton
const emojibaseUrl: string = import.meta.env.VITE_EMOJIBASE_URL;

const columns = 8;

const CategoryHeader = ({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) => (
  <Category {...props}>{category.label}</Category>
);

const Row = ({ children, ...props }: EmojiPickerListRowProps) => (
  <RowCon {...props}>{children}</RowCon>
);

const Emoji = ({ emoji, ...props }: EmojiPickerListEmojiProps) => (
  <EmojiCell {...props} active={emoji.isActive} title={emoji.label}>
    {emoji.emoji}
  </EmojiCell>
);

const EmojiPickerPanel = ({
  onSelect,
}: {
  onSelect: (emoji: string) => void;
}) => {
  const { recent, skinTone } = useStoreState(state => state.Messages.emoji);
  const { setSkinTone } = useStoreActions(actions => actions.Messages);

  return (
    <Root
      columns={columns}
      emojibaseUrl={emojibaseUrl}
      skinTone={skinTone}
      onEmojiSelect={({ emoji }) => onSelect(emoji)}
    >
      <Top>
        <Search placeholder="Search emoji" autoFocus />
        <EmojiPicker.SkinTone>
          {({
            skinTone: current,
            setSkinTone: setCurrent,
            skinToneVariations,
          }) => {
            const index = skinToneVariations.findIndex(
              v => v.skinTone === current,
            );
            const next =
              skinToneVariations[(index + 1) % skinToneVariations.length];
            return (
              <SkinToneButton
                type="button"
                aria-label="change skin tone"
                title="Change skin tone"
                onClick={() => {
                  setCurrent(next.skinTone);
                  setSkinTone(next.skinTone);
                }}
              >
                {skinToneVariations[index]?.emoji || '✋'}
              </SkinToneButton>
            );
          }}
        </EmojiPicker.SkinTone>
      </Top>
      {recent.length > 0 && (
        <>
          <Category>Recently used</Category>
          <RecentRow>
            {recent.slice(0, columns).map(emoji => (
              <EmojiCell
                key={emoji}
                type="button"
                active={false}
                onClick={() => onSelect(emoji)}
              >
                {emoji}
              </EmojiCell>
            ))}
          </RecentRow>
        </>
      )}
      <Viewport>
        <Status>
          <EmojiPicker.Loading>Loading…</EmojiPicker.Loading>
          <EmojiPicker.Empty>No emoji found.</EmojiPicker.Empty>
        </Status>
        <EmojiPicker.List components={{ CategoryHeader, Row, Emoji }} />
      </Viewport>
    </Root>
  );
};

const cellSize = 36;

const Root = styled(EmojiPicker.Root)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${p => p.theme.paperBackground};
  color: ${p => p.theme.fontColor};
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => p.theme.padXSmall};
  padding: ${p => p.theme.padSmall};
`;

const Search = styled(EmojiPicker.Search)`
  flex: 1;
  min-width: 0;
  padding: 6px 10px;
  border: 1px solid ${p => p.theme.borderColor};
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
  &:focus {
    outline: none;
    border-color: ${p => p.theme.primary};
  }
`;

const SkinToneButton = styled.button`
  width: ${cellSize}px;
  height: ${cellSize}px;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  &:hover {
    background: ${p => p.theme.hoverColor};
  }
`;

const Viewport = styled(EmojiPicker.Viewport)`
  position: relative;
  flex: 1;
  outline: none;
`;

const Status = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: ${p => p.theme.lightTextColor};
  font-size: ${p => p.theme.smallFont};
`;

// frimousse measures the header and then sets that as its height, so the
// padding has to be inside the height or the header covers the first row
const Category = styled.div`
  box-sizing: border-box;
  padding: 6px ${p => p.theme.padSmall} 2px;
  background: ${p => p.theme.paperBackground};
  color: ${p => p.theme.lightTextColor};
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
`;

const RowCon = styled.div`
  padding: 0 ${p => p.theme.padSmall};
`;

const RecentRow = styled(RowCon)`
  display: flex;
  border-bottom: 1px solid ${p => p.theme.borderColor};
  padding-bottom: ${p => p.theme.padXSmall};
`;

const EmojiCell = styled.button<{ active: boolean }>`
  width: ${cellSize}px;
  height: ${cellSize}px;
  border: none;
  border-radius: 4px;
  background: ${p => (p.active ? p.theme.hoverColor : 'transparent')};
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  &:hover {
    background: ${p => p.theme.hoverColor};
  }
`;

export default EmojiPickerPanel;
