import React, { useState, useEffect } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import moment from 'moment';

import BattleList from 'components/BattleList';
import history from 'utils/history';

import s from './battles.css';

const Battles = props => {
  const {
    context: {
      query: { date },
    },
  } = props;

  const [start, setStart] = useState();
  const [end, setEnd] = useState();

  const parseDate = d =>
    d ? moment(d, 'YYYY-MM-DD').startOf('day') : moment().startOf('day');

  useEffect(() => {
    const parsedDate = parseDate(date);
    setStart(parsedDate);
    setEnd(parsedDate.clone().add(1, 'days'));
  }, [date]);

  const next = () => {
    history.push(`/battles?date=${start.add(1, 'days').format('YYYY-MM-DD')}`);
  };

  const previous = () => {
    history.push(
      `/battles?date=${start.subtract(1, 'days').format('YYYY-MM-DD')}`,
    );
  };

  if (!start || !end) return null;

  return (
    <div className={s.battles}>
      <div className={s.datepicker}>
        <button onClick={previous} type="button">
          &lt;
        </button>
        <span className={s.selectedDate}>{start.format('ddd DD.MM.YYYY')}</span>
        <button onClick={next} type="button">
          &gt;
        </button>
      </div>
      <BattleList start={start.clone()} end={end.clone()} />
    </div>
  );
};

export default withStyles(s)(Battles);
