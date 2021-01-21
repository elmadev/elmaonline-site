import React from 'react';
import styled from 'styled-components';
import Header from 'components/Header';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

const createRow = (button, action, action2, action3) => {
  return { button, action, action2, action3 };
};

const keyBindingRows = [
  createRow(
    'F1',
    'Show/hide other players',
    'Show/hide yourself from others',
    '-',
  ),
  createRow(
    'F2',
    'Observe next player',
    'Observe previous player',
    'Cancel observing',
  ),
  createRow('F3', 'Show battle queue', 'Lock/Unlock new levels', '-'),
  createRow(
    'F4',
    'Download battle level',
    'Download cup level (currently disabled)',
    'Download any level (type level filename without the .lev extension)',
  ),
  createRow(
    'F5',
    'Show players online',
    'Show best times in current level',
    'Show best multiplayer times in current level',
  ),
  createRow(
    'F6',
    'Show battle standings/results',
    'Show cup standings/results (currently disabled)',
    'Show 24htt standings/results',
  ),
  createRow(
    'F7',
    'Show finished times',
    'Show finished multi times',
    'Clear finished times',
  ),
  createRow(
    'F8',
    'Send/Accept multiplayer invitation',
    'Cancel all multiplayer invitations',
    'Change active cup (currently disabled)',
  ),
  createRow(
    'F9',
    'Type chat line (press up/down or pageup/pagedown to scroll)',
    'Show/hide chat',
    'Show/hide last apple time',
  ),
  createRow(
    'F10',
    'Show/hide battle/cup status line',
    'Show/hide leader and your position',
    'Show/hide speedometer',
  ),
  createRow(
    'F11',
    'Download winning replay of last battle',
    'Download winning replay of last cup (currently disabled)',
    'Show/hide onewheel status',
  ),
  createRow(
    'F12',
    '(Re)connect to server',
    'Disconnect from server',
    'Refresh palette',
  ),
];

const KeyBindings = () => {
  return (
    <Text>
      <Header h2>EOL key bindings</Header>
      <div>
        <RowSpan>
          EOL uses two option keys to fit all keys to the F-keys by default. By
          default, the option keys are:
        </RowSpan>
        <RowSpan>OPT1: Left Shift</RowSpan>
        <RowSpan>OPT2: Left Ctrl</RowSpan>
        <RowSpan>
          To change any of the bindings or to reset them to default, you can do
          it in eolconf.exe in your eol folder.
        </RowSpan>
      </div>
      <TableContainerStyled>
        <Table size="small" className="table">
          <TableHead>
            <TableRow key="table_header">
              <TableCell key="button_header">Button</TableCell>
              <TableCell key="action_header">Action</TableCell>
              <TableCell key="action2_header">OPT1 + Button</TableCell>
              <TableCell key="action3_header">OPT2 + Button</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keyBindingRows &&
              keyBindingRows.map((r, i) => (
                <TableRow key={`${i.toString()}row`}>
                  <TableCell key={`${i.toString()}button`}>
                    {r.button}
                  </TableCell>
                  <TableCell key={`${i.toString()}action`}>
                    {r.action}
                  </TableCell>
                  <TableCell key={`${i.toString()}action2`}>
                    {r.action2}
                  </TableCell>
                  <TableCell key={`${i.toString()}action3`}>
                    {r.action3}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainerStyled>
      <p>
        In addition, there is a special combination of keys to enter a level in
        free camera mode. In level menu, hold F1 and press enter to enter the
        level. You can move your camera using the arrow keys and go faster by
        holding shift while moving.
      </p>
    </Text>
  );
};

const TableContainerStyled = styled(TableContainer)`
  && {
    width: 710px;
  }
  & .table {
    border: 1px solid rgba(224, 224, 224, 1);
  }
`;

const Text = styled.div`
  padding-left: 8px;
`;

const RowSpan = styled.span`
  width: 100%;
  float: left;
  line-height: 1.5;
`;

export default KeyBindings;
