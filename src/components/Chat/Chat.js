import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import withStyles from 'isomorphic-style-loader/withStyles';
// import moment from 'moment';

import LocalTime from 'components/LocalTime';

import s from './Chat.css';

const Chat = props => {
  const {
    KuskiIndex = 'all', // 'all' will not filter by KuskiIndex
    start = 0,
    end = new Date().getSeconds(),
  } = props;
  const { chatLines } = useStoreState(state => state.Chat);
  const { getChatLinesInRange } = useStoreActions(actions => actions.Chat);

  useEffect(() => {
    getChatLinesInRange({
      KuskiIndex,
      from: start, // moment(start, 'X').utc().format(),
      to: end, // moment(end, 'X').utc().format()
    });
  }, []);

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

  if (!chatLines) return <span>No chat recorded</span>;

  return (
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
    </div>
  );
};

export default withStyles(s)(Chat);
