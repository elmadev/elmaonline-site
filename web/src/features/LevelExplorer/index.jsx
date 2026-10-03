import React, { useEffect, useId, useRef, useState } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import styled from '@emotion/styled';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import CloseIcon from '@material-ui/icons/Close';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import Link from 'components/Link';
import LevelDetails from './LevelDetails';
import { PAGE_SIZES } from './store';
import { levelPreviewUrl, useExplorerLevels, useExplorerTopTimes } from './api';

const LevelPreview = ({ level, number, onSelect, scrollRoot }) => {
  const [status, setStatus] = useState('loading');
  const [nearViewport, setNearViewport] = useState(false);
  const cardRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { root: scrollRoot.current, rootMargin: '200px' },
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [scrollRoot]);
  const name = level.LevelName
    ? `${level.LevelName}.lev`
    : `Level ${level.LevelIndex}`;

  return (
    <Card
      ref={cardRef}
      type="button"
      onClick={event => onSelect(level, event.currentTarget)}
      aria-label={`View top 10 for ${name}`}
    >
      <Preview>
        {status === 'loading' && <Placeholder>Loading preview…</Placeholder>}
        {status === 'error' ? (
          <Placeholder>Preview unavailable</Placeholder>
        ) : nearViewport ? (
          <img
            src={levelPreviewUrl(level.LevelIndex)}
            alt={`Map of ${name}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setStatus('ready')}
            onError={() => setStatus('error')}
          />
        ) : null}
        <NumberBadge>{number}</NumberBadge>
      </Preview>
      <Caption>
        <strong>{name}</strong>
        <span>{level.LongName || 'View top 10 →'}</span>
      </Caption>
    </Card>
  );
};

const ExplorerContent = ({
  levelIds,
  levelPack,
  levels: providedLevels,
  onClose,
  titleId,
  title,
  contextLink,
}) => {
  const { levels, isPending, isError, refetch } = useExplorerLevels(
    levelIds,
    levelPack,
    providedLevels,
  );
  const [page, setPage] = useState(1);
  const pageSize = useStoreState(
    state => state.LevelExplorer.settings.pageSize,
  );
  const setPageSize = useStoreActions(
    actions => actions.LevelExplorer.setPageSize,
  );
  const [selectedLevel, setSelectedLevel] = useState(null);
  const selectedIndex = selectedLevel
    ? levels.findIndex(level => level.LevelIndex === selectedLevel.LevelIndex)
    : -1;
  const topTimes = useExplorerTopTimes(selectedLevel?.LevelIndex);
  const selectedCardRef = useRef(null);
  const headingRef = useRef(null);
  useEffect(() => {
    if (selectedLevel) headingRef.current?.focus();
    else if (selectedCardRef.current?.isConnected)
      selectedCardRef.current.focus({ preventScroll: true });
    else headingRef.current?.focus({ preventScroll: true });
  }, [selectedLevel]);
  const contentRef = useRef(null);
  const pageCount = Math.max(1, Math.ceil(levels.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const offset = (currentPage - 1) * pageSize;
  const changePage = nextPage => {
    setPage(nextPage);
    headingRef.current?.focus({ preventScroll: true });
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape' && selectedLevel) {
        event.preventDefault();
        event.stopPropagation();
        setSelectedLevel(null);
        return;
      }
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.target.closest(
          'input, select, textarea, [contenteditable="true"]',
        ) ||
        !['ArrowLeft', 'ArrowRight'].includes(event.key)
      )
        return;

      event.preventDefault();
      event.stopPropagation();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      if (selectedLevel) {
        const nextIndex = selectedIndex + direction;
        if (nextIndex >= 0 && nextIndex < levels.length)
          setSelectedLevel(levels[nextIndex]);
      } else if (!isPending && !isError && levels.length) {
        const nextPage = currentPage + direction;
        if (nextPage >= 1 && nextPage <= pageCount) changePage(nextPage);
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [
    selectedLevel,
    selectedIndex,
    levels,
    currentPage,
    pageCount,
    isPending,
    isError,
  ]);

  return (
    <ExplorerBody>
      <Heading>
        <div>
          <h2 id={titleId} ref={headingRef} tabIndex={-1}>
            {selectedLevel
              ? selectedLevel.LevelName
                ? `${selectedLevel.LevelName}.lev`
                : `Level ${selectedLevel.LevelIndex}`
              : title || levelPack || 'Explore levels'}
          </h2>
          {selectedLevel && (
            <Subtitle>{selectedLevel.LongName || 'Level details'}</Subtitle>
          )}
          {!selectedLevel && (
            <Subtitle role="status" aria-live="polite">
              {levels.length
                ? `${offset + 1}–${Math.min(offset + pageSize, levels.length)} of ${levels.length} levels`
                : '0 levels'}
            </Subtitle>
          )}
          {contextLink && !selectedLevel && (
            <Link to={contextLink.to} onClick={onClose}>
              {contextLink.label}
            </Link>
          )}
        </div>
        <IconButton aria-label="Close level explorer" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Heading>
      {selectedLevel && (
        <Content dividers key={selectedLevel.LevelIndex}>
          <LevelDetails
            level={selectedLevel}
            previewUrl={levelPreviewUrl(selectedLevel.LevelIndex)}
            times={topTimes.data}
            isPending={topTimes.isPending}
            isError={topTimes.isError}
            onRetry={() => topTimes.refetch()}
            onBack={() => setSelectedLevel(null)}
            onNavigate={onClose}
            position={selectedIndex + 1}
            total={levels.length}
            onPrevious={() =>
              selectedIndex > 0 && setSelectedLevel(levels[selectedIndex - 1])
            }
            onNext={() =>
              selectedIndex < levels.length - 1 &&
              setSelectedLevel(levels[selectedIndex + 1])
            }
          />
        </Content>
      )}
      <Content
        ref={contentRef}
        dividers
        style={{ display: selectedLevel ? 'none' : undefined }}
      >
        {isPending ? (
          <Message role="status">
            <CircularProgress size={28} />
            <p>Loading levels…</p>
          </Message>
        ) : isError ? (
          <Message role="alert">
            <p>Couldn’t load these levels.</p>
            <Button onClick={() => refetch()} color="primary">
              Try again
            </Button>
          </Message>
        ) : levels.length === 0 ? (
          <Message>No levels to explore yet.</Message>
        ) : (
          <Grid>
            {levels.slice(offset, offset + pageSize).map((level, index) => (
              <LevelPreview
                key={level.LevelIndex}
                level={level}
                number={offset + index + 1}
                onSelect={(level, card) => {
                  selectedCardRef.current = card;
                  setSelectedLevel(level);
                }}
                scrollRoot={contentRef}
              />
            ))}
          </Grid>
        )}
      </Content>
      <Footer style={{ display: selectedLevel ? 'none' : undefined }}>
        <PageSizeLabel>
          Levels per page
          <select
            value={pageSize}
            onChange={event => {
              const size = Number(event.target.value);
              setPageSize(size);
              setPage(Math.floor(offset / size) + 1);
              if (contentRef.current) contentRef.current.scrollTop = 0;
            }}
          >
            {PAGE_SIZES.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </PageSizeLabel>
        <Pagination
          count={pageCount}
          page={currentPage}
          disabled={isPending || isError || !levels.length}
          onChange={(_, nextPage) => changePage(nextPage)}
          color="primary"
          size="small"
          siblingCount={pageCount}
        />
      </Footer>
    </ExplorerBody>
  );
};

// Controlled dialog for custom launchers. Supply levelIds OR levelPack.
export const LevelExplorerDialog = ({
  open,
  onClose,
  levelIds,
  levels,
  levelPack,
  title,
  contextLink,
}) => {
  const titleId = useId();
  return (
    <ExplorerDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      aria-labelledby={titleId}
    >
      {open && (
        <ExplorerContent
          key={JSON.stringify([levelPack, levelIds, levels])}
          {...{
            onClose,
            levelIds,
            levels,
            levelPack,
            title,
            titleId,
            contextLink,
          }}
        />
      )}
    </ExplorerDialog>
  );
};

// Drop this launcher anywhere; no page store or route parameters are needed.
export default function LevelExplorer({ children = 'Preview', ...props }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Launcher
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <ImageOutlinedIcon fontSize="small" />
        {children}
      </Launcher>
      <LevelExplorerDialog
        {...props}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const ExplorerBody = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

const Launcher = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 7px;
  margin: 4px 8px 4px 12px;
  border: 1px solid ${p => p.theme.primaryAlpha3};
  border-radius: 4px;
  background: transparent;
  color: ${p => p.theme.linkColor};
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  vertical-align: middle;
  white-space: nowrap;
  cursor: pointer;
  svg {
    font-size: 16px;
    transform: translateY(1px);
  }
  &:hover {
    border-color: ${p => p.theme.linkColor};
    background: ${p => p.theme.primaryAlpha};
  }
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

const ExplorerDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: ${p => p.theme.paperBackground};
    color: ${p => p.theme.fontColor};
    border-radius: 12px;
    height: min(900px, calc(100% - 48px));
    max-height: calc(100% - 48px);
  }
  @media (min-width: 1400px) {
    .MuiDialog-paper {
      width: calc(100% - 64px);
      max-width: 1600px;
    }
  }
  @media (max-width: 600px) {
    .MuiDialog-paper {
      margin: 8px;
      width: calc(100% - 16px);
      height: calc(100% - 16px);
      max-height: calc(100% - 16px);
    }
  }
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  h2 {
    margin: 0 0 4px;
    font-size: 22px;
    overflow-wrap: anywhere;
  }
`;
const Subtitle = styled.div`
  color: ${p => p.theme.lightTextColor};
  font-size: 13px;
`;
const Content = styled(DialogContent)`
  background: ${p => p.theme.pageBackground};
  padding: 20px;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  @media (min-width: 1400px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  gap: 16px;
  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  @media (max-width: 380px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
const Card = styled.button`
  display: block;
  padding: 0;
  font: inherit;
  text-align: left;
  cursor: pointer;
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${p => p.theme.borderColor};
  border-radius: 8px;
  background: ${p => p.theme.paperBackground};
  color: ${p => p.theme.fontColor};
  text-decoration: none;
  &:hover,
  &:focus-visible {
    border-color: ${p => p.theme.linkColor};
    outline: 2px solid ${p => p.theme.linkColor};
  }
`;
const Preview = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  background: ${p => p.theme.pageBackgroundDark};
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 10px;
    box-sizing: border-box;
  }
`;
const Placeholder = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: ${p => p.theme.lightTextColor};
  font-size: 13px;
`;
const NumberBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${p => p.theme.paperBackground};
  color: ${p => p.theme.fontColor};
  font-size: 11px;
`;
const Caption = styled.div`
  padding: 12px;
  strong,
  span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  strong {
    font-size: 14px;
    color: ${p => p.theme.linkColor};
  }
  span {
    margin-top: 4px;
    font-size: 12px;
    color: ${p => p.theme.lightTextColor};
  }
`;
const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 24px;
  font-size: 13px;
  flex-shrink: 0;
  max-height: 35%;
  overflow-y: auto;
  nav {
    flex: 1 1 260px;
    margin-left: auto;
  }
  .MuiPagination-ul {
    justify-content: flex-end;
    gap: 4px 0;
  }
`;
const PageSizeLabel = styled.label`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  select {
    padding: 6px;
    border: 1px solid ${p => p.theme.borderColor};
    border-radius: 4px;
    background: ${p => p.theme.paperBackground};
    color: inherit;
    font: inherit;
  }
`;
const Message = styled.div`
  padding: 64px 16px;
  text-align: center;
`;
