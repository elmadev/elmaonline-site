import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Typography, CircularProgress, Tooltip } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import styled from '@emotion/styled';
import LocalTime from 'components/LocalTime';
import { CHAT_API_LIMIT } from 'constants/api';
import { colorPool } from 'utils/misc';

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

  const { chatLines, chatLineCount, chatPage, prevQuery, loading } =
    useStoreState(state => state.ChatView);
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
    if (battleEnd && new Date().getTime() / 1000 > start + battleEnd) {
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
    <Container style={fullHeight && { maxHeight: 'max-content' }}>
      {chatLinesWithEvent.map(l =>
        !l.Event ? (
          <Tooltip
            title={`#${l.ChatIndex}`}
            key={l.ChatIndex}
            placement="left-start"
            arrow
          >
            <ChatLine>
              <Timestamp>
                <LocalTime date={l.Entered} format={timestamp} parse="X" />
              </Timestamp>{' '}
              <Message>
                <Kuski>
                  &lt;
                  {l.KuskiData ? (
                    <span style={{ color: getColor(l.KuskiData.Kuski) }}>
                      {l.KuskiData.Kuski}
                    </span>
                  ) : (
                    '[No User Data]'
                  )}
                  &gt;
                </Kuski>{' '}
                <span>{l.Text}</span>
              </Message>
            </ChatLine>
          </Tooltip>
        ) : (
          // add a battle end line if current chatline has Event
          <EndContainer key={`${l.Entered}-${l.Event.Type}`}>
            <Line />
            <Event>
              <>
                {l.Event.Text}
                {<LocalTime date={l.BattleEnd} format={timestamp} parse="X" />}
              </>
            </Event>
            <Line />
          </EndContainer>
        ),
      )}

      {paginated && chatLinesWithEvent.length > limit && (
        <PaginationWrapper>
          <Typography variant="caption" display="block" gutterBottom>
            {`${opts.offset + 1}-${Math.min(
              chatLineCount,
              limit * (chatPage + 1),
            )} of ${chatLineCount}`}
          </Typography>
          <PaginationInline
            count={Math.ceil(chatLineCount / CHAT_API_LIMIT)}
            size="small"
            page={chatPage}
            onChange={handlePageChange}
          />
        </PaginationWrapper>
      )}
    </Container>
  );
};

const PaginationInline = styled(Pagination)`
  display: inline-block;
`;

const Container = styled.div`
  margin: 0;
  max-height: 400px;
  width: 100%;
  overflow: auto;
`;

const ChatLine = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
  position: relative;
`;

const Message = styled.div`
  margin-left: 60px;
`;

const Kuski = styled.span`
  font-weight: 400;
`;

const EndContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Line = styled.hr`
  margin: 7px;
  border-color: #7d7d7d;
  width: 100%;
`;

const Event = styled.span`
  position: relative;
  color: #7d7d7d;
  font-size: 10px;
  white-space: nowrap;
`;

const Timestamp = styled.div`
  color: #7d7d7d;
  min-width: 50px;
  float: left;
  margin-right: 5px;
`;

const PaginationWrapper = styled.div`
  text-align: center;
`;

export default ChatView;
