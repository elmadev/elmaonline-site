import { useNavigate } from '@tanstack/react-router';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import React from 'react';
import Popularity from 'components/Popularity';
import styled from '@emotion/styled';
import Switch from 'components/Switch';

const Controls = ({ detailed, sort }) => {
  const navigate = useNavigate();

  return (
    <Grid2
      container
      justifyContent="flex-end"
      alignItems="center"
      detailed={detailed}
    >
      {!detailed && (
        <div
          style={{ marginBottom: -19 }}
          title="Average number of players per level"
        >
          <div style={{ fontSize: 14, marginBottom: 5, textAlign: 'center' }}>
            Avg. Kuski Count
          </div>
          <Popularity style={{ width: 150 }} widthPct={100} />
        </div>
      )}
      {
        <FormControl style={{ minWidth: 170, marginRight: 22 }}>
          <InputLabel id="levelpack-sort">Sort By</InputLabel>
          <Select
            id="levelpack-sort"
            value={sort || 'default'}
            onChange={e => {
              navigate({
                to: [
                  '/levels',
                  detailed && 'detailed',
                  e.target.value &&
                    e.target.value !== 'default' &&
                    `?sort=${e.target.value}`,
                ]
                  .filter(Boolean)
                  .join('/'),
              });
            }}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="alpha">Alphabetical</MenuItem>
            <MenuItem value="created">Created</MenuItem>
            <MenuItem value="attempts"># Attempts</MenuItem>
            <MenuItem value="time">Total Time Spent</MenuItem>
            <MenuItem value="levels"># Levels</MenuItem>
            <MenuItem value="avgKuskiCount">Avg. Kuski Count</MenuItem>
            <MenuItem value="topKuskiPct">Highest Record Holder %</MenuItem>
            <MenuItem value="topKuskiCount">
              Highest Record Holder Count
            </MenuItem>
            <MenuItem value="attemptsPctF">Attempts % (Finished)</MenuItem>
            <MenuItem value="attemptsPctD">Attempts % (Dead)</MenuItem>
            <MenuItem value="attemptsPctE">Attempts % (Escaped)</MenuItem>
            <MenuItem value="timePctF">Time % (Finished)</MenuItem>
            <MenuItem value="timePctD">Time % (Dead)</MenuItem>
            <MenuItem value="timePctE">Time % (Escaped)</MenuItem>
            <MenuItem value="minTime">Min Record Time</MenuItem>
            <MenuItem value="maxTime">Max Record Time</MenuItem>
            <MenuItem value="avgTime">Avg. Record Time</MenuItem>
          </Select>
        </FormControl>
      }
      <SwitchWrapper detailed={detailed}>
        <Switch
          checked={!!detailed}
          onChange={checked => {
            navigate({
              to: [
                '/levels',
                checked && 'detailed',
                sort && sort !== 'default' && `?sort=${sort}`,
              ]
                .filter(Boolean)
                .join('/'),
            });
          }}
        >
          Detailed View
        </Switch>
      </SwitchWrapper>
    </Grid2>
  );
};

const Grid2 = styled(Grid)`
  padding-bottom: ${p => (p.detailed ? '10px' : '25px')};
  > * {
    margin-right: 22px;
    &:last-child {
      margin-right: 10px;
    }
  }
`;

const SwitchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: -31px;
`;

export default Controls;
