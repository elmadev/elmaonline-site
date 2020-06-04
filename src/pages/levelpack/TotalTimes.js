import React from 'react';
import DerpTable from 'components/Table/DerpTable';
import DerpTableCell from 'components/Table/DerpTableCell';
import TableRow from '@material-ui/core/TableRow';

import Time from 'components/Time';

const TotalTimes = ({ totals, highlight, highlightWeeks }) => {
  return (
    <>
      <h2>Total Times</h2>
      <DerpTable headers={['#', 'Player', 'Total Time']} length={totals.length}>
        {totals
          .sort((a, b) => a.tt - b.tt)
          .map((r, no) => (
            <TableRow hover key={r.KuskiIndex}>
              <DerpTableCell width="50px">{no + 1}.</DerpTableCell>
              <DerpTableCell width="150px">{r.KuskiData.Kuski}</DerpTableCell>
              <DerpTableCell
                highlight={r.TimeIndex >= highlight[highlightWeeks]}
              >
                <Time time={r.tt} />
              </DerpTableCell>
            </TableRow>
          ))}
      </DerpTable>
    </>
  );
};

export default TotalTimes;
