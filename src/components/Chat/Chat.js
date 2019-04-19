import React from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import moment from 'moment';
import LocalTime from '../LocalTime';
import chatQuery from './chat.graphql';
import s from './Chat.css';

class Chat extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getChatLines: PropTypes.array,
    }).isRequired,
  };

  render() {
    const {
      data: { getChatLines, loading },
    } = this.props;

    if (loading) return <span>Loading chat</span>;

    if (!getChatLines) return null;
    return (
      <div className={s.chat}>
        {getChatLines.map(l => (
          <div className={s.chatLine} key={l.ChatIndex}>
            <div className={s.timestamp}>
              <LocalTime date={l.Entered} format="HH:mm:ss" parse="X" />
            </div>{' '}
            <div className={s.message}>
              <span className={s.kuski}>&lt;{l.KuskiData.Kuski}&gt;</span>{' '}
              <span>{l.Text}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(chatQuery, {
    options: ownProps => ({
      variables: {
        start: moment(ownProps.start, 'X')
          .utc()
          .format(),
        end: moment(ownProps.end, 'X')
          .utc()
          .format(),
      },
    }),
  }),
)(Chat);
