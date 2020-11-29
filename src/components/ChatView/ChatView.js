import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Typography, CircularProgress, Tooltip } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import withStyles from 'isomorphic-style-loader/withStyles';

import LocalTime from 'components/LocalTime';
import { CHAT_API_LIMIT } from 'constants/api';

import s from './ChatView.css';

const ChatView = props => {
  const {
    KuskiIds,
    text,
    start = 0,
    end = Math.round(Date.now() / 1000),
    limit = CHAT_API_LIMIT,
    order = 'ASC',
    timestamp = 'HH:mm:ss',
    count = false,
    fullHeight,
    paginated,
    battleEnd,
  } = props;

  const {
    chatLines,
    chatLineCount,
    chatPage,
    prevQuery,
    loading,
  } = useStoreState(state => state.ChatView);
  const { searchChat, setChatPage } = useStoreActions(
    actions => actions.ChatView,
  );

  const [chatLinesWithEvent, setChatLinesWithEvent] = useState([]);

  const opts = {
    KuskiIds,
    text,
    start,
    end,
    limit,
    order,
    count,
    offset: chatPage * limit,
  };

  if (
    KuskiIds === prevQuery.KuskiIds &&
    text === prevQuery.text &&
    start === prevQuery.start &&
    end === prevQuery.end &&
    count === prevQuery.count
  ) {
    opts.count = false; // Avoiding long findAndCountAll if query is the same
    if (chatLines.length && order === prevQuery.order) {
      // preserve ids of first and last chat line, for faster seeking
      opts.firstId = chatLines[0].ChatIndex;
      opts.lastId = chatLines.slice(-1)[0].ChatIndex;
    }
  } else {
    // New query means resetting offset
    opts.offset = 0;
  }

  if (opts.offset < prevQuery.offset) opts.seek = 'backward';

  useEffect(() => {
    searchChat(opts);
  }, [chatPage, KuskiIds, text, start, end, limit, order, count]);

  useEffect(() => {
    // add the battle end event to the chat log
    // currently only used when Battle.js calls ChatView
    if (!chatLines || chatLines.length === 0) return;
    if (battleEnd) {
      const chatLineArray = [...chatLines];
      // add a "chatline" for the battle end event
      const battleEndEvent = {
        BattleEnd: start + battleEnd,
        Event: {
          Type: 'battleEnd',
          Text: 'Battle ended at ',
        },
      };
      if (
        battleEndEvent.BattleEnd >
        parseInt(chatLineArray[chatLineArray.length - 1].Entered, 10)
      ) {
        chatLineArray.push(battleEndEvent);
      } else {
        chatLineArray.splice(
          chatLineArray.findIndex(
            line =>
              parseInt(line.Entered, 10) >
              parseInt(battleEndEvent.BattleEnd, 10),
          ),
          0,
          battleEndEvent,
        );
      }
      setChatLinesWithEvent(chatLineArray);
    } else {
      setChatLinesWithEvent(chatLines);
    }
  }, [battleEnd, chatLines]);

  if (loading) return <CircularProgress />;

  if (!chatLines.length) return <span>No chat recorded during this time.</span>;

  const colorMap = {};

  const colorPool = [
    '#cb52e2',
    '#0075DC',
    '#993F00',
    '#4C005C',
    '#005C31',
    '#2BCE48',
    '#00998F',
    '#740AFF',
    '#FF5005',
    '#ce7a26',
    '#8F7C00',
    '#9DCC00',
    '#C20088',
    '#FFA405',
    '#FFA8BB',
    '#426600',
    '#FF0010',
    '#2ec6c7',
    '#990000',
  ];

  let colorIndex = 0;

  const getColor = kuski => {
    if (!colorMap[kuski]) {
      colorMap[kuski] = colorPool[colorIndex % colorPool.length];
      colorIndex += 1;
    }
    return colorMap[kuski];
  };

  const handlePageChange = (event, value) => {
    setChatPage(value);
  };

  return (
    <div className={s.chat} style={fullHeight && { maxHeight: 'max-content' }}>
      {chatLinesWithEvent.map(l =>
        !l.Event ? (
          <Tooltip
            title={`#${l.ChatIndex}`}
            key={l.ChatIndex}
            placement="left-start"
            arrow
          >
            <div className={s.chatLine}>
              <div className={s.timestamp}>
                <LocalTime date={l.Entered} format={timestamp} parse="X" />
              </div>{' '}
              <div className={s.message}>
                <span className={s.kuski}>
                  &lt;
                  {l.KuskiData ? (
                    <span style={{ color: getColor(l.KuskiData.Kuski) }}>
                      {l.KuskiData.Kuski}
                    </span>
                  ) : (
                    '[No User Data]'
                  )}
                  &gt;
                </span>{' '}
                <span>{l.Text}</span>
              </div>
            </div>
          </Tooltip>
        ) : (
          // add a battle end line if current chatline has Event
          <div className={s.container} key={`${l.Entered}-${l.Event.Type}`}>
            <hr className={s.line} />
            <span className={s.event}>
              <>
                {l.Event.Text}
                {<LocalTime date={l.BattleEnd} format={timestamp} parse="X" />}
              </>
            </span>
            <hr className={s.line} />
          </div>
        ),
      )}

      {paginated && chatLinesWithEvent.length > limit && (
        <div className={s.paginationWrapper}>
          <Typography variant="caption" display="block" gutterBottom>
            {`${opts.offset + 1}-${Math.min(
              chatLineCount,
              limit * (chatPage + 1),
            )} of ${chatLineCount}`}
          </Typography>
          <Pagination
            count={Math.ceil(chatLineCount / CHAT_API_LIMIT)}
            size="small"
            page={chatPage}
            onChange={handlePageChange}
            classes={{ root: s.pagination }}
          />
        </div>
      )}
    </div>
  );
};

export default withStyles(s)(ChatView);
