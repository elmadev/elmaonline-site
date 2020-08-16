import React from 'react';
import styled from 'styled-components';
import Time from 'components/Time';
import DerpTable from 'components/Table/DerpTable';
import DerpTableCell from 'components/Table/DerpTableCell';
import TableRow from '@material-ui/core/TableRow';
import { zeroPad } from 'utils/time';

const CupResults = props => {
  const { results, ShortName, eventNo } = props;

  return (
    <Container>
      <DerpTable
        headers={['#', 'Player', 'Time/Rec', 'Points']}
        length={results.length}
      >
        {results.map((r, no) => (
          <TableRow hover key={r.KuskiIndex}>
            <DerpTableCell>{no + 1}.</DerpTableCell>
            <DerpTableCell>{r.KuskiData.Kuski}</DerpTableCell>
            <DerpTableCell>
              {r.Replay ? (
                <a
                  href={`/dl/cupreplay/${r.CupTimeIndex}/${ShortName}${zeroPad(
                    eventNo,
                    2,
                  )}${r.KuskiData.Kuski.substring(0, 6)}`}
                >
                  <Time time={r.Time} apples={-1} />
                </a>
              ) : (
                <Time time={r.Time} apples={-1} />
              )}
            </DerpTableCell>
            <DerpTableCell right>
              {r.Points} point{r.Points > 1 ? 's' : ''}
            </DerpTableCell>
          </TableRow>
        ))}
      </DerpTable>
    </Container>
  );
};

const Container = styled.div``;

export default CupResults;
