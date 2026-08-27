import { Star, StarBorder } from '@material-ui/icons';
import React from 'react';
import styled from '@emotion/styled';

const FavStar = ({ loggedIn, pack, removeFav, addFav }) => {
  if (!loggedIn) {
    return null;
  }

  return (
    <>
      {pack.Fav && (
        <IconWrapper
          title="Remove favourite"
          selected
          onClick={() => removeFav({ LevelPackIndex: pack.LevelPackIndex })}
        >
          <Star />
        </IconWrapper>
      )}

      {!pack.Fav && (
        <IconWrapper
          title="Add as favourite"
          onClick={() => addFav({ LevelPackIndex: pack.LevelPackIndex })}
        >
          <StarBorder />
        </IconWrapper>
      )}
    </>
  );
};

const IconWrapper = styled.span`
  svg {
    color: ${p => (p.selected ? '#e4bb24' : '#e6e6e6')};
    &:hover {
      color: ${p => (p.selected ? '#e6e6e6' : '#e4bb24')};
    }
  }
`;

export default FavStar;
