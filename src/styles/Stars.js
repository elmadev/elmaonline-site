import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';

const ten = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Stars = props => {
  const { voted, average, vote } = props;
  return (
    <Container>
      <StarContainer>
        {ten.map(t => (
          <StarColor onClick={() => vote(t)} key={t}>
            {t <= voted ? <Star /> : <StarBorder />}
          </StarColor>
        ))}
      </StarContainer>
      <Rating>{average}</Rating>
    </Container>
  );
};

const Container = styled.div`
  height: 19px;
  display: flex;
  flex-direction: row;
`;

const StarContainer = styled.div`
  margin-right: 2px;
  margin-top: -3px;
`;

const Rating = styled.div`
  font-size: 16px;
  font-weight: bold;
  line-height: 16px;
`;

const StarColor = styled.span`
  cursor: pointer;
  svg {
    color: #e4bb24;
    &:hover {
      color: black;
    }
  }
`;

Stars.propTypes = {
  voted: PropTypes.number.isRequired,
  average: PropTypes.number.isRequired,
  vote: PropTypes.func.isRequired,
};

export default Stars;
