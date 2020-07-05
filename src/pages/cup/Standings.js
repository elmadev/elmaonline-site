import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DerpTable from 'components/Table/DerpTable';
import DerpTableCell from 'components/Table/DerpTableCell';
import TableRow from '@material-ui/core/TableRow';
import { calculateStandings } from 'utils/cups';

const Standings = props => {
  const { events, cup } = props;
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    setStandings(calculateStandings(events, cup));
  }, []);

  return (
    <Container>
      <DerpTable headers={['#', 'Player', 'Points']} length={standings.length}>
        {standings.map((r, no) => (
          <TableRow hover key={r.KuskiIndex}>
            <DerpTableCell>{no + 1}.</DerpTableCell>
            <DerpTableCell>{r.Kuski}</DerpTableCell>
            <DerpTableCell right>
              {r.Points} point{r.Points > 1 ? 's' : ''}
            </DerpTableCell>
          </TableRow>
        ))}
      </DerpTable>
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  padding-left: 8px;
  padding-right: 8px;
`;

export default Standings;
