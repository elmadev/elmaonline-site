import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LevelMap from 'features/LevelMap';
import Kuski from 'components/Kuski';
import { formatDistanceStrict, isValid } from 'date-fns';
import { shirtUrl } from 'utils/misc';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { Row } from 'components/Containers';
import type { LevelData } from 'types/level';

type LevelCardProps = {
  level: LevelData;
};

export default function LevelCard({ level }: LevelCardProps) {
  const [picExists, setPicExists] = useState(true);
  const [raised, setRaised] = useState(false);
  const navigate = useNavigate();

  const handleOpenLevel = () => {
    navigate({
      to: `/levels/${level.LevelIndex}`,
    });
  };

  return (
    <LevCard
      raised={raised}
      onMouseOver={() => setRaised(true)}
      onMouseLeave={() => setRaised(false)}
      onClick={handleOpenLevel}
    >
      <CardHeader
        avatar={
          picExists && level.KuskiData?.KuskiIndex ? (
            <img
              src={shirtUrl(level.KuskiData.KuskiIndex) ?? undefined}
              onError={() => setPicExists(false)}
              height="40"
              alt="shirt"
            />
          ) : (
            <Avatar>{level.KuskiData?.Kuski[0] || '?'}</Avatar>
          )
        }
        title={
          level.KuskiData ? (
            <Kuski noLink kuskiData={level.KuskiData} />
          ) : (
            'Unknown'
          )
        }
        subheader={
          level.Added && isValid(level.Added * 1000)
            ? formatDistanceStrict(level.Added * 1000, Date.now(), {
                addSuffix: true,
              })
            : 'Unknown date'
        }
      />
      <LevelCardMedia title={level.LevelName}>
        <LevelMap LevelIndex={level.LevelIndex} interaction={false} />
      </LevelCardMedia>
      <CardContent title={level.LongName}>
        <Typography variant="body2" color="textSecondary" component="p">
          <Row jc="space-between">
            <div>{level.LongName}</div>
            {level.LevelName}.lev
          </Row>
        </Typography>
      </CardContent>
    </LevCard>
  );
}

const LevCard = styled(Card)`
  :hover {
    cursor: pointer;
  }
`;

const LevelCardMedia = styled(CardMedia)`
  &.MuiCardMedia-root {
    height: 160px;
  }
`;
