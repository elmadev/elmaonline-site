import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import LocalTime from 'components/LocalTime';

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

const Comments = props => {
  const { comments, loading } = props;
  if (loading) return null;
  return (
    <Chat>
      {comments.map(c => (
        <Chatline key={c.ReplayCommentIndex}>
          <Timestamp>
            <LocalTime date={c.Entered} format="D MMM YYYY" parse="X" />
          </Timestamp>{' '}
          <Message>
            <Kuski>
              &lt;
              <span style={{ color: getColor(c.KuskiIndex) }}>
                {c.KuskiData.Kuski}
              </span>
              &gt;
            </Kuski>{' '}
            <span>{c.Text}</span>
          </Message>
        </Chatline>
      ))}
    </Chat>
  );
};

const Chat = styled.div`
  margin: 0;
  max-height: 400px;
  width: 100%;
  overflow: auto;
`;

const Chatline = styled.div`
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

const Timestamp = styled.div`
  color: #7d7d7d;
  width: 78px;
  float: left;
`;

Comments.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      KuskiIndex: PropTypes.number,
      Entered: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      Text: PropTypes.string,
    }),
  ),
  loading: PropTypes.bool,
};

Comments.defaultProps = {
  comments: [],
  loading: false,
};

export default Comments;
