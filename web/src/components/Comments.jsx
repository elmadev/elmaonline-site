import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import LocalTime from 'components/LocalTime';
import { Column, Row } from 'components/Containers';

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

const sortByEntered = (a, b) => b.Entered - a.Entered;

const Comments = ({ comments = [], loading = false }) => {
  if (loading) return null;
  return (
    <Column>
      {comments.sort(sortByEntered).map(c => (
        <Row key={c.ReplayCommentIndex || c.LGRCommentIndex}>
          <Timestamp>
            <LocalTime date={c.Entered} format="d MMM yyyy" parse="X" />
          </Timestamp>{' '}
          <Kuski>
            &lt;
            <span style={{ color: getColor(c.KuskiIndex) }}>
              {c.KuskiData?.Kuski ? c.KuskiData.Kuski : 'Unknown'}
            </span>
            &gt;
          </Kuski>{' '}
          <ChatText>{c.Text}</ChatText>
        </Row>
      ))}
    </Column>
  );
};

const ChatText = styled.span`
  font-size: ${p => p.theme.smallFont};
`;

const Kuski = styled.span`
  font-weight: 400;
  margin-right: ${p => p.theme.padSmall};
  font-size: ${p => p.theme.smallFont};
`;

const Timestamp = styled.div`
  font-size: ${p => p.theme.smallFont};
  color: #7d7d7d;
  width: 78px;
  float: left;
  white-space: nowrap;
  margin-right: ${p => p.theme.padSmall};
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

export default Comments;
