import React from 'react';
import styled from '@emotion/styled';
import { Button, IconButton } from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Link from 'components/Link';
import Kuski from 'components/Kuski';
import Time from 'components/Time';

// Presentation only: the explorer owns selection and all query state.
export default function LevelDetails({
  level,
  previewUrl,
  times = [],
  isPending = false,
  isError = false,
  onRetry,
  onBack,
  onNavigate,
  onPrevious,
  onNext,
  position,
  total,
}) {
  const name = level.LevelName
    ? `${level.LevelName}.lev`
    : `Level ${level.LevelIndex}`;
  return (
    <>
      <Actions>
        <Button onClick={onBack} startIcon={<ArrowBack />}>
          Back to levels
        </Button>
        <Navigation aria-label="Level navigation">
          <IconButton
            aria-label="Previous level"
            disabled={position <= 1}
            onClick={onPrevious}
          >
            <ChevronLeft />
          </IconButton>
          <span role="status" aria-live="polite">
            {position} of {total}
          </span>
          <IconButton
            aria-label="Next level"
            disabled={position >= total}
            onClick={onNext}
          >
            <ChevronRight />
          </IconButton>
        </Navigation>
        <Link to={`/levels/${level.LevelIndex}`} onClick={onNavigate}>
          Open level page →
        </Link>
      </Actions>
      <DetailsBody>
        <Link
          to={`/levels/${level.LevelIndex}`}
          onClick={onNavigate}
          aria-label={`Open level page for ${name}`}
        >
          <Map src={previewUrl} alt={`Map of ${name}`} loading="lazy" />
        </Link>
        <div>
          <h3>Top 10</h3>
          {isPending ? (
            <p role="status">Loading times…</p>
          ) : isError ? (
            <div role="alert">
              <p>Couldn’t load times.</p>
              <Button onClick={onRetry}>Try again</Button>
            </div>
          ) : times.length === 0 ? (
            <p>No finishes recorded yet.</p>
          ) : (
            <Times>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Kuski</th>
                  <th scope="col">Time</th>
                </tr>
              </thead>
              <tbody>
                {times.map((time, index) => (
                  <tr
                    key={
                      time.BestTimeIndex || time.LegacyBesttimeIndex || index
                    }
                  >
                    <td>{index + 1}</td>
                    <td>
                      <Kuski kuskiData={time.KuskiData} flag team />
                    </td>
                    <td>
                      <Time time={time.Time} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Times>
          )}
        </div>
      </DetailsBody>
    </>
  );
}

const Map = styled.img`
  display: block;
  width: 100%;
  height: 420px;
  object-fit: contain;
  background: ${p => p.theme.pageBackgroundDark};
  @media (max-width: 700px) {
    height: 240px;
  }
`;
const DetailsBody = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 24px;
  h3 {
    margin-top: 0;
  }
  @media (max-width: 850px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Times = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid ${p => p.theme.borderColor};
  }
  th:last-child,
  td:last-child {
    text-align: right;
  }
`;
const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 24px;
  a {
    color: ${p => p.theme.linkColor};
  }
`;
