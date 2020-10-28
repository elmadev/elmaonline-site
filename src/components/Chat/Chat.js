import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import withStyles from 'isomorphic-style-loader/withStyles';

import LocalTime from 'components/LocalTime';

import s from './Chat.css';

const CHAT_API_LIMIT = 100;

const Chat = props => {
  const {
    KuskiIndex,
    text,
    start = 0,
    end = Math.round(Date.now() / 1000),
    paginated,
    limit = CHAT_API_LIMIT,
  } = props;

  const { chatLines, chatLineCount, chatPage } = useStoreState(
    state => state.Chat,
  );
  const { searchChat, setChatPage } = useStoreActions(actions => actions.Chat);

  const opts = {
    KuskiIndex,
    text,
    start,
    end,
    limit,
    offset: (chatPage - 1) * CHAT_API_LIMIT,
  };

  useEffect(() => {
    searchChat(opts);
  }, [chatPage]);

  if (!chatLineCount) return <span>No chat recorded during this time.</span>;

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
    <>
      <div className={s.chat}>
        {chatLines.map(l => (
          <div className={s.chatLine} key={l.ChatIndex}>
            <div className={s.timestamp}>
              <LocalTime date={l.Entered} format="HH:mm:ss" parse="X" />
            </div>{' '}
            <div className={s.message}>
              <span className={s.kuski}>
                &lt;
                <span style={{ color: getColor(l.KuskiData.Kuski) }}>
                  {l.KuskiData.Kuski}
                </span>
                &gt;
              </span>{' '}
              <span>{l.Text}</span>
            </div>
          </div>
        ))}
        <div className={s.footer}>
          {paginated && chatLineCount > CHAT_API_LIMIT && (
            <Pagination
              count={Math.ceil(chatLineCount / CHAT_API_LIMIT)}
              size="small"
              page={chatPage}
              onChange={handlePageChange}
            />
          )}
          <Typography variant="caption" display="block" gutterBottom>
            {`${opts.offset + 1}-${Math.min(
              chatLineCount,
              CHAT_API_LIMIT * chatPage,
            )} of ${chatLineCount}`}
          </Typography>
        </div>
      </div>
    </>
  );
};

export default withStyles(s)(Chat);
