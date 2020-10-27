import React from 'react';
import styled from 'styled-components';
import Link from 'components/Link';

const StandingsDetailedPopup = ({ data, events, close }) => {
  return (
    <DetailedPopup>
      <DetailedPopupContainer>
        <Title>
          <Link to={`/kuskis/${data.KuskiData.Kuski}`}>
            {data.KuskiData.Kuski}
          </Link>
          <CloseButton
            tabIndex="0"
            role="button"
            onClick={close}
            onKeyPress={close}
          >
            &times;
          </CloseButton>
        </Title>
        <h2>Detailed results</h2>
        <Results>
          <TableHead>
            <span>Event</span>
            <span>Position</span>
            <span>Points</span>
          </TableHead>
          {events.map((event, index) => {
            const pointsForEvent = data.AllPointsDetailed.find(
              apd => apd.LevelIndex === event.LevelIndex,
            );
            return (
              <TableRow
                key={event.LevelIndex}
                skipped={pointsForEvent && pointsForEvent.Skipped}
              >
                <span>Event {index + 1}</span>
                {pointsForEvent && (
                  <>
                    <span>
                      {pointsForEvent.Position}/{pointsForEvent.TotalPlayers}
                    </span>
                    <span>
                      {pointsForEvent.Points} point
                      {pointsForEvent.Points > 1 ? 's' : ''}
                    </span>
                  </>
                )}
                {!pointsForEvent && (
                  <>
                    <span />
                    <span />
                  </>
                )}
              </TableRow>
            );
          })}
        </Results>
      </DetailedPopupContainer>
    </DetailedPopup>
  );
};

const DetailedPopup = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 800px;
  height: 100vh;
  background: #fff;
  box-sizing: border-box;
  padding-top: var(--top-bar-height);
  border-left: 1px solid #eaeaea;

  @media all and (max-width: 1150px) {
    left: 650px;
  }

  @media all and (max-width: 999px) {
    left: 50%;
  }

  @media all and (max-width: 600px) {
    left: 0;
  }
`;

const DetailedPopupContainer = styled.div`
  max-height: 100%;
  overflow: auto;
`;

const Title = styled.div`
  font-weight: 500;
  padding: 10px;
  position: relative;
`;

const CloseButton = styled.div`
  position: absolute;
  right: 0;
  font-size: 25px;
  top: 0;
  padding: 10px;
  padding-top: 0;
  cursor: pointer;
`;

const Results = styled.div`
  display: table;
  width: 100%;
  font-size: 14px;

  > * {
    display: table-row;
  }

  > * > * {
    display: table-cell;
    padding: 10px;
    border-bottom: 1px solid #eaeaea;
  }
`;

const TableHead = styled.div`
  font-weight: 500;
`;

const TableRow = styled.div`
  text-decoration: ${p => (p.skipped ? 'line-through' : '')};
  color: ${p => (p.skipped ? '#c3c3c3' : '')};
`;

export default StandingsDetailedPopup;
