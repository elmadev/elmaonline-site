import React from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import moment from 'moment';

import LocalTime from 'components/LocalTime';

import chatQuery from './chat.graphql';
import s from './Chat.css';

class Chat extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getChatLines: PropTypes.array,
    }).isRequired,
  };

  colorMap = {};

  colorPool = [
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

  colorIndex = 0;

  getColor = kuski => {
    if (!this.colorMap[kuski]) {
      this.colorMap[kuski] = this.colorPool[
        this.colorIndex % this.colorPool.length
      ];
      this.colorIndex += 1;
    }
    return this.colorMap[kuski];
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
              <span className={s.kuski}>
                &lt;
                <span style={{ color: this.getColor(l.KuskiData.Kuski) }}>
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
