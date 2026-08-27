import React from 'react';
import styled from '@emotion/styled';
import Download from 'components/Download';
import Link from 'components/Link';
import Tags from 'components/Tags';
import { pluralize } from 'utils/misc';

const LevelInfo = ({ level, levelpacks, cups }) => {
  if (level.locked) {
    return <LevelDescription>{level.LevelName}.lev</LevelDescription>;
  }

  return (
    <LevelDescription>
      <Download href={`level/${level.LevelIndex}`}>
        {level.LevelName}.lev
      </Download>
      <LevelFullName>{level.LongName}</LevelFullName>
      <br />
      <div>{`Level ID: ${level.LevelIndex}`}</div>
      <div>
        {pluralize(level.Apples, 'apple')}, {pluralize(level.Killers, 'killer')}{' '}
        and {pluralize(level.Flowers, 'flower')}.
      </div>
      {levelpacks.length > 0 && (
        <div>
          {`Level Pack: `}
          {levelpacks.map((pack, index) => [
            index > 0 && ', ',
            <Link to={`/levels/packs/${pack.LevelPackName}`}>
              {pack.LevelPackName}
            </Link>,
          ])}
        </div>
      )}
      {cups?.length > 0 && (
        <div>
          {`Cup: `}
          {cups.map((cup, index) => [
            index > 0 && ', ',
            <Link to={`/cup/${cup.ShortName}/events`}>{cup.CupName}</Link>,
          ])}
        </div>
      )}
      {level.AcceptBugs !== 0 && (
        <div>Apple bugs are allowed in this level.</div>
      )}
      {level.Legacy !== 0 && (
        <div>This level has legacy times imported from a third party site.</div>
      )}
      <br />
      {level.Tags && <Tags tags={level.Tags.map(tag => tag.Name)} />}
    </LevelDescription>
  );
};

const LevelDescription = styled.div`
  font-size: 14px;
`;

const LevelFullName = styled.div`
  color: #7d7d7d;
`;

export default LevelInfo;
