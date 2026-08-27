import React, { useState, useEffect } from 'react';
import { calculateStandings, pts } from 'utils/cups';
import { ListRow, ListCell, ListContainer, ListHeader } from 'components/List';
import Kuski from 'components/Kuski';
import { Position } from './Standings';

const EventStandings = ({ events, cup }) => {
  const [standings, setStandings] = useState({});

  useEffect(() => {
    setStandings(calculateStandings(events, cup, true));
  }, [events, cup]);

  return (
    <>
      {standings.player && (
        <ListContainer>
          <ListHeader>
            <ListCell width={70}>#</ListCell>
            <ListCell>Player</ListCell>
            <ListCell right>Points</ListCell>
          </ListHeader>
          {standings.player.map((r, no) => (
            <ListRow key={r.KuskiIndex}>
              <ListCell width={70}>
                <Position
                  r={r}
                  no={r.FinalPosition ? r.FinalPosition - 1 : no}
                  amountEvents={events.length}
                />
              </ListCell>
              <ListCell>
                <Kuski kuskiData={r.KuskiData} team flag />
              </ListCell>
              <ListCell right>{pts(r.Points)}</ListCell>
            </ListRow>
          ))}
        </ListContainer>
      )}
    </>
  );
};

export default EventStandings;
