import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LevelMap from 'features/LevelMap';
import Kuski from 'components/Kuski';
import { formatDistanceStrict, isValid } from 'date-fns';
import config from 'config';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { Row } from 'components/Containers';

export default function LevelCard({ level, tags }) {
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
          picExists ? (
            <img
              src={`${config.dlUrl}shirt/${level.KuskiData?.KuskiIndex}`}
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
          isValid(level.Added * 1000)
            ? formatDistanceStrict(level.Added * 1000, Date.now(), {
                addSuffix: true,
              })
            : 'Unknown date'
        }
      />
      <LevelCardMedia title={level.LevelName} height="160">
        <LevelMap
          LevelIndex={level.LevelIndex}
          interaction={false}
          tags={tags}
        />
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
