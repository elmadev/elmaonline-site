import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import moment from 'moment';

import BattleList from 'components/BattleList';
import history from 'utils/history';

import s from './battles.css';

class Battles extends React.Component {
  constructor(props) {
    super(props);
    const date = this.parseDate(props);
    this.state = {
      start: date,
      end: date.clone().add(1, 'days'),
    };
  }

  componentWillReceiveProps(props) {
    const date = this.parseDate(props);
    this.setState({
      start: date,
      end: date.clone().add(1, 'days'),
    });
  }

  parseDate = props =>
    props.context.query.date
      ? moment(props.context.query.date, 'YYYY-MM-DD').startOf('day')
      : moment().startOf('day');

  next = () => {
    history.push(
      `/battles?date=${this.state.start.add(1, 'days').format('YYYY-MM-DD')}`,
    );
  };

  previous = () => {
    history.push(
      `/battles?date=${this.state.start
        .subtract(1, 'days')
        .format('YYYY-MM-DD')}`,
    );
  };

  render() {
    return (
      <div className={s.battles}>
        <div className={s.datepicker}>
          <button onClick={this.previous} type="button">
            &lt;
          </button>
          <span className={s.selectedDate}>
            {this.state.start.format('ddd DD.MM.YYYY')}
          </span>
          <button onClick={this.next} type="button">
            &gt;
          </button>
        </div>
        <BattleList
          start={this.state.start.clone()}
          end={this.state.end.clone()}
        />
      </div>
    );
  }
}

export default withStyles(s)(Battles);
