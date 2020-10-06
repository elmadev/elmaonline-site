import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Star, StarBorder } from '@material-ui/icons';

const ten = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Stars = props => {
  const { voted, average, vote, clickable } = props;
  return (
    <Container>
      <StarContainer>
        {ten.map(t => (
          <StarColor clickable={clickable} onClick={() => vote(t)} key={t}>
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
  cursor: ${props => (props.clickable ? 'pointer' : 'auto')};
  svg {
    color: #e4bb24;
    &:hover {
      color: ${props => (props.clickable ? 'black' : '#e4bb24')};
    }
  }
`;

Stars.propTypes = {
  voted: PropTypes.number.isRequired,
  average: PropTypes.number.isRequired,
  vote: PropTypes.func.isRequired,
  clickable: PropTypes.bool.isRequired,
};

export default Stars;
