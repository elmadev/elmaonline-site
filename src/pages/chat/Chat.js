import React, { useState, useEffect, useMemo } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useDebounce } from 'use-debounce';
import queryString from 'query-string';
import withStyles from 'isomorphic-style-loader/withStyles';
import {
  TextField,
  TablePagination,
  Typography,
  Grid,
  Switch,
  CircularProgress,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import ChatView from 'components/ChatView';
import Kuski from 'components/Kuski';
import Header from 'components/Header';
import history from 'utils/history';

import s from './Chat.css';

const Chat = props => {
  const {
    context: { query = {} }, // Search query params
  } = props;

  const queryIds = query.KuskiIds
    ? query.KuskiIds.split(',').map(id => +id)
    : [];

  // Store state
  const { chatLineCount, chatPage } = useStoreState(state => state.ChatView);
  const { setChatPage } = useStoreActions(actions => actions.ChatView);
  const { playerList } = useStoreState(state => state.Kuskis);
  const { getPlayers } = useStoreActions(actions => actions.Kuskis);

  // Local state
  const [KuskiIds, setKuskiIds] = useState(queryIds);
  const [text, setText] = useState(query.text || '');
  const [rowsPerPage, setRowsPerPage] = useState(Number(query.rpp) || 25);
  const [debouncedText] = useDebounce(text, 500);
  const [start, setStart] = useState(
    query.start ||
      new Date(new Date().setDate(new Date().getDate() - 1))
        .toISOString()
        .substr(0, 16),
  ); // default to 24h ago
  const [end, setEnd] = useState(
    query.end || new Date().toISOString().substr(0, 16),
  );
  const [order, setOrder] = useState(query.order !== 'ASC');
  const [kuskiValue, setKuskiValue] = useState(
    playerList.filter(player => queryIds.includes(player.KuskiIndex)),
  );

  // Populate Kuski select
  useEffect(() => {
    getPlayers();
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
      'rpp',
      'page',
    ];

    history.replace({
      search: queryString.stringify(
        {
          ...query,
          ...keys,
        },
        {
          arrayFormat: 'comma',
          skipNull: true,
          skipEmptyString: true,
          sort: (a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b),
        },
      ),
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
    <div className={s.chat}>
      <Header h2>Chat Log Filter</Header>
      <Grid container className={s.chatFilters} spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} lg={3}>
          {playerList.length > 0 ? (
            <Autocomplete
              id="filter-kuski"
              options={playerList}
              multiple
              filterSelectedOptions
              getOptionLabel={option => option.Kuski}
              getOptionSelected={(option, value) =>
                option.KuskiIndex === value.KuskiIndex
              }
              onChange={(event, newValue) => {
                const ids = newValue.map(value => value.KuskiIndex);
                setKuskiIds(ids);
                setKuskiValue(newValue);
                urlSync({ KuskiIds: ids });
              }}
              renderInput={params => (
                <TextField
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...params}
                  label="Kuski"
                  placeholder="Name(s)"
                  variant="outlined"
                />
              )}
              renderOption={option => (
                <Kuski kuskiData={option} flag team noLink />
              )}
              value={kuskiValue}
            />
          ) : (
            <CircularProgress />
          )}
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
          <Typography component="div" classes={{ root: s.switch }}>
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
      </Grid>

      <ChatView
        KuskiIds={KuskiIds}
        text={debouncedText}
        start={Math.floor(new Date(start).getTime() / 1000)}
        end={Math.floor(new Date(end).getTime() / 1000)}
        limit={rowsPerPage}
        order={order ? 'DESC' : 'ASC'}
        timestamp="YYYY-MM-DD HH:mm:ss"
        fullHeight
      />

      <TablePagination
        component="div"
        count={chatLineCount}
        page={chatPage}
        onChangePage={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100, 250, 1000]}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        classes={{
          root: s.paginationRoot,
          spacer: s.paginationSpacer,
          toolbar: s.paginationToolbar,
        }}
      />
    </div>
  );
};

export default withStyles(s)(Chat);
