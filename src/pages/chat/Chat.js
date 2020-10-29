import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useDebounce } from 'use-debounce';
import withStyles from 'isomorphic-style-loader/withStyles';
import {
  TextField,
  TablePagination,
  Typography,
  Grid,
  Switch,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import ChatView from 'components/ChatView';
import Kuski from 'components/Kuski';
import Header from 'components/Header';

import s from './Chat.css';

const Chat = () => {
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [KuskiIndex, setKuskiIndex] = useState(0);
  const [text, setText] = useState('');
  const [debouncedText] = useDebounce(text, 500);
  const [start, setStart] = useState(
    new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .substr(0, 16),
  ); // 24h ago
  const [end, setEnd] = useState(new Date().toISOString().substr(0, 16));
  const [order, setOrder] = useState(true);
  const { chatLineCount, chatPage } = useStoreState(state => state.ChatView);
  const { setChatPage } = useStoreActions(actions => actions.ChatView);
  const { playerList } = useStoreState(state => state.Kuskis);
  const { getPlayers } = useStoreActions(actions => actions.Kuskis);

  useEffect(() => {
    getPlayers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setChatPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setChatPage(0);
  };

  return (
    <div className={s.chat}>
      <Header h2>Chat Log Filter</Header>
      <Grid container className={s.chatFilters} spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} lg={3}>
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
              if (newValue.length === 1) setKuskiIndex(newValue[0].KuskiIndex);
              else if (newValue.length === 0) setKuskiIndex(0);
              else setKuskiIndex(newValue.map(value => value.KuskiIndex));
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
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <TextField
            id="filter-text"
            label="Text"
            value={text}
            onChange={e => {
              setText(e.target.value);
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
            onChange={e => {
              setStart(e.target.value);
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
            onChange={e => {
              setEnd(e.target.value);
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
        KuskiIndex={KuskiIndex}
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
