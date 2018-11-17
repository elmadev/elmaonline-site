import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import moment from 'moment';
import history from '../../history';
import BattleList from '../../components/BattleList';
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
    this.setState(
      state => {
        const date = state.start.clone();
        date.add(1, 'days');
        return {
          start: date,
          end: date.clone().add(1, 'days'),
        };
      },
      () => {
        history.push(`/battles?date=${this.state.start.format('YYYY-MM-DD')}`);
      },
    );
  };
  previous = () => {
    this.setState(
      state => {
        const date = state.start.clone();
        date.subtract(1, 'days');
        return {
          start: date,
          end: date.clone().add(1, 'days'),
        };
      },
      () => {
        history.push(`/battles?date=${this.state.start.format('YYYY-MM-DD')}`);
      },
    );
  };
  render() {
    return (
      <div className={s.battles}>
        <div className={s.datepicker}>
          <button onClick={this.previous}>&lt;</button>
          <span className={s.selectedDate}>
            {this.state.start.format('YYYY-MM-DD')}
          </span>
          <button onClick={this.next}>&gt;</button>
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
