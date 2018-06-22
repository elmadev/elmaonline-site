import React from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
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
    const { data: { getChatLines, loading } } = this.props;

    if (loading) return <span>Loading chat</span>;

    if (!getChatLines) return null;

    return (
      <div className={s.chat}>
        {getChatLines.map(l => (
          <div className={s.chatLine} key={l.ChatIndex}>
            <span className={s.kuski}>{l.KuskiData.Kuski}:</span>{' '}
            <span>{l.Text}</span>
            <div className={s.timestamp}>{l.Entered}</div>
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
        start: new Date(ownProps.start * 1000),
        end: new Date(ownProps.end * 1000),
      },
    }),
  }),
)(Chat);
