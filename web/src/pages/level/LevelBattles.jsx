import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Kuski from 'components/Kuski';
import React from 'react';
import styled from '@emotion/styled';
import { sortResults, battleStatus, battleStatusBgColor } from 'utils/battle';
import { useTheme } from '@emotion/react';
import Link from 'components/Link';
import LocalTime from 'components/LocalTime';
import { useNavigate } from '@tanstack/react-router';

const LevelBattles = ({ battles, loading }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const goToBattle = async battleIndex => {
    if (!Number.isNaN(battleIndex)) {
      await navigate({ to: `/battles/${battleIndex}` });
    }
  };

  return (
    <BattlesContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Started</TableCell>
            <TableCell>Designer</TableCell>
            <TableCell>Winner</TableCell>
            <TableCell>Battle ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading &&
            battles.map(i => {
              const sorted = [...i.Results].sort(sortResults(i.BattleType));
              return (
                <BattleRow
                  bg={battleStatusBgColor(i, theme)}
                  hover
                  key={i.BattleIndex}
                  onClick={() => {
                    goToBattle(i.BattleIndex);
                  }}
                >
                  <TableCell>
                    <Link to={`/battles/${i.BattleIndex}`}>
                      <LocalTime
                        date={i.Started}
                        format="dd MMM yyyy HH:mm:ss"
                        parse="X"
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Kuski kuskiData={i.KuskiData} team flag />
                  </TableCell>
                  <TableCell>
                    {i.Finished === 1 && sorted.length > 0 ? (
                      <Kuski kuskiData={sorted[0].KuskiData} team flag />
                    ) : (
                      battleStatus(i)
                    )}
                  </TableCell>
                  <TableCell>{i.BattleIndex}</TableCell>
                </BattleRow>
              );
            })}
        </TableBody>
      </Table>
    </BattlesContainer>
  );
};

const BattlesContainer = styled.div`
  width: 100%;
`;

const BattleRow = styled(TableRow)`
  && {
    cursor: pointer;
    background-color: ${p => p.bg};
  }
`;

export default LevelBattles;
