import React from 'react';
import styled from '@emotion/styled';
import Link from 'components/Link';
import Popularity from 'components/Popularity';
import FavStar from './FavStar';
import PreviewButton from './PreviewButton';

export default function LevelpackCard({
  pack,
  stats = {},
  onPreview,
  loggedIn,
  addFav,
  removeFav,
}) {
  const avg = (stats.AvgKuskiPerLevel || 0).toFixed(1);
  return (
    <Card>
      <Name>
        <Link to={`/levels/packs/${pack.LevelPackName}`}>
          {pack.LevelPackName}
        </Link>
        <Count> ({stats.LevelCountAll || 0} levels)</Count>
        <PreviewButton pack={pack} onPreview={onPreview} />
      </Name>
      <LongName>{pack.LevelPackLongName}</LongName>
      <PopularityBar
        title={`Avg. number of kuskis played per level: ${avg}`}
        widthPct={(stats.NormalizedPopularity || 0) * 100}
        after={<span>{avg}</span>}
      />
      <Star>
        <FavStar pack={pack} {...{ loggedIn, addFav, removeFav }} />
      </Star>
    </Card>
  );
}

const Card = styled.div`
  position: relative;
  height: 99px;
  margin: 1px 0 0 1px;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  background: ${p => p.theme.paperBackground};
  &:hover {
    background: ${p => p.theme.hoverColor};
    .pop-bar-1 {
      background: ${p => p.theme.paperBackground};
    }
  }
  &:hover .pack-preview,
  &:focus-within .pack-preview {
    opacity: 1;
    pointer-events: auto;
  }
  button {
    position: relative;
    z-index: 1;
  }
`;

const Name = styled.div`
  font-weight: 500;
  color: ${p => p.theme.linkColor};
  a::after {
    content: '';
    position: absolute;
    inset: 0;
  }
`;
const Count = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${p => p.theme.headerColor};
`;
const LongName = styled.div`
  font-size: 13px;
`;
const PopularityBar = styled(Popularity)`
  margin-top: 20px;
  width: 100%;
  max-width: 320px;
  .pop-after {
    min-width: 24px;
    span {
      font-size: 12px;
    }
  }
`;
const Star = styled.div`
  cursor: pointer;
  position: absolute;
  top: 11px;
  right: 13px;
`;
