import React, { useState, useEffect, useMemo } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useDebounce } from 'use-debounce';
import Layout from 'components/Layout';
import queryString from 'query-string';
import {
  TextField,
  TablePagination,
  Typography,
  Grid,
  Switch,
} from '@material-ui/core';
import styled from '@emotion/styled';
import { useLocation, useNavigate } from '@tanstack/react-router';
import ChatView from 'features/ChatView';
import Header from 'components/Header';
import { Paper } from 'components/Paper';
import { format, addDays } from 'date-fns';
import { KuskiAutoComplete } from 'components/AutoComplete';

const ChatLog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.search;

  const queryIds = query.KuskiIds
    ? query.KuskiIds.toString()
        .split(',')
        .map(id => +id)
    : [];

  // Store state
  const { chatLineCount, chatPage, chatLines } = useStoreState(
    state => state.ChatView,
  );
  const { setChatPage } = useStoreActions(actions => actions.ChatView);
  const { playerList } = useStoreState(state => state.Kuskis);
  const { getPlayers } = useStoreActions(actions => actions.Kuskis);

  // Local state
  const [KuskiIds, setKuskiIds] = useState(queryIds);
  const [text, setText] = useState(query.text || '');
  const [rowsPerPage, setRowsPerPage] = useState(Number(query.rpp) || 25);

  const now = new Date();

  const [start, setStart] = useState(
    query.start || format(addDays(now, -1), `yyyy-MM-dd'T'HH:mm`),
  ); // default to 24h ago
  const [end, setEnd] = useState(
    query.end || format(now, `yyyy-MM-dd'T'HH:mm`),
  );

  const [order, setOrder] = useState(query.order !== 'ASC');
  const [kuskiValue, setKuskiValue] = useState(
    playerList.filter(player => queryIds.includes(player.KuskiIndex)),
  );

  // Debounce values that can change rapidly
  const [debouncedText] = useDebounce(text, 500);
  const [debouncedStart] = useDebounce(start, 500);
  const [debouncedEnd] = useDebounce(end, 500);

  // Populate Kuski select
  useEffect(() => {
    getPlayers();
    if (query.page && !chatPage) setChatPage(Number(query.page));
  }, []);

  useMemo(
    () =>
      setKuskiValue(
        playerList.filter(player => queryIds.includes(player.KuskiIndex)),
      ),
    [playerList],
  );

  const urlSync = keys => {
    const sortOrder = [
      'KuskiIds',
      'text',
      'start',
      'end',
      'order',
      'count',
      'rpp',
      'page',
    ];
    navigate({
      to: `/chatlog?${queryString.stringify(
        {
          ...query,
          ...keys,
        },
        {
          arrayFormat: 'comma',
          skipEmptyString: true,
          sort: (a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b),
        },
      )}`,
    });
  };

  const handleChangePage = (event, newPage) => {
    setChatPage(newPage);
    urlSync({ page: newPage });
  };

  const handleChangeRowsPerPage = event => {
    const rpp = parseInt(event.target.value, 10);
    setRowsPerPage(rpp);
    setChatPage(0);
    urlSync({
      rpp,
      page: 0,
    });
  };

  return (
    <Layout t="Chat Log">
      <Paper padding>
        <Header h2>Chat Log Filter</Header>
        <ChatFilter container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} lg={3}>
            <KuskiAutoComplete
              list={playerList}
              selected={kuskiValue}
              onChange={(ids, newValue) => {
                setKuskiIds(ids);
                setKuskiValue(newValue);
                urlSync({ KuskiIds: ids });
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <TextField
              id="filter-text"
              label="Text"
              value={text}
              onChange={({ target: { value = '' } }) => {
                setText(value);
                urlSync({ text: value });
              }}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs>
            <TextField
              id="datetime-start"
              label="Start"
              type="datetime-local"
              defaultValue={start}
              onChange={({ target: { value = 0 } }) => {
                setStart(value);
                urlSync({ start: value });
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs>
            <TextField
              id="datetime-end"
              label="End"
              type="datetime-local"
              defaultValue={end}
              onChange={({ target: { value = 0 } }) => {
                setEnd(value);
                urlSync({ end: value });
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs>
            <Typography component="div">
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>ASC</Grid>
                <Grid item>
                  <Switch
                    checked={order}
                    onChange={(e, value) => {
                      setOrder(value);
                      urlSync({ order: value ? 'DESC' : 'ASC' });
                    }}
                    name="order"
                    size="small"
                    color="primary"
                  />
                </Grid>
                <Grid item>DESC</Grid>
              </Grid>
            </Typography>
          </Grid>
        </ChatFilter>
      </Paper>

      <Paper padding top>
        <ChatView
          KuskiIds={KuskiIds}
          text={debouncedText}
          start={Math.floor(new Date(debouncedStart).getTime() / 1000)}
          end={Math.floor(new Date(debouncedEnd).getTime() / 1000)}
          limit={rowsPerPage}
          order={order ? 'DESC' : 'ASC'}
          count={false}
          timestamp="yyyy-MM-dd HH:mm:ss"
          fullHeight
        />

        {chatLines && (
          <PaginationStyled
            component="div"
            count={chatLineCount}
            page={chatPage}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100, 250, 1000]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </Layout>
  );
};

const ChatFilter = styled(Grid)`
  padding-bottom: 10px;
`;

const PaginationStyled = styled(TablePagination)`
  flex-wrap: wrap;
  .MuiTablePagination-spacer {
    display: none;
  }
  .MuiTablePagination-toolbar {
    justify-content: center;
  }
`;

export default ChatLog;
