import React from 'react';
import styled from 'styled-components';
import Time from 'components/Time';
import Kuski from 'components/Kuski';
import DerpTable from 'components/Table/DerpTable';
import DerpTableCell from 'components/Table/DerpTableCell';
import TableRow from '@material-ui/core/TableRow';
import { zeroPad } from 'utils/time';
import history from 'utils/history';

const goToReplay = (index, filename) => {
  history.push(`/r/cup/${index}/${filename}`);
};

const CupResults = props => {
  const { results, ShortName, eventNo } = props;

  return (
    <Container>
      <DerpTable
        headers={['#', 'Player', 'Time/Rec', 'Points']}
        length={results.length}
      >
        {results.map((r, no) => (
          <TableRow
            style={{ cursor: 'pointer' }}
            hover
            key={r.KuskiIndex}
            onClick={() => {
              goToReplay(
                r.CupTimeIndex,
                `${ShortName}${zeroPad(
                  eventNo,
                  2,
                )}${r.KuskiData.Kuski.substring(0, 6)}`,
              );
            }}
          >
            <DerpTableCell>{no + 1}.</DerpTableCell>
            <DerpTableCell>
              <Kuski kuskiData={r.KuskiData} team flag />
            </DerpTableCell>
            <DerpTableCell>
              {r.Replay ? (
                <a
                  href={`/dl/cupreplay/${r.CupTimeIndex}/${ShortName}${zeroPad(
                    eventNo,
                    2,
                  )}${r.KuskiData.Kuski.substring(0, 6)}`}
                  onClick={e => e.stopPropagation()}
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
