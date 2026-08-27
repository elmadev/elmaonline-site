import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PictureInPictureIcon from '@material-ui/icons/PictureInPicture';
import LevelMap from 'features/LevelMap';
import { Level } from 'components/Names';
import Kuski from 'components/Kuski';
import { formatDistanceStrict } from 'date-fns';
import config from 'config';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { Row } from 'components/Containers';

export default function ReplayCard({ replay, onPreviewClick }) {
  const [picExists, setPicExists] = useState(true);
  const [raised, setRaised] = useState(false);
  const navigate = useNavigate();

  const handleOpenReplay = () => {
    navigate({
      to: `/r/${replay.UUID}/${replay.RecFileName?.split('.')[0] || ''}`,
    });
  };

  const handlePreviewClick = event => {
    event.stopPropagation();
    onPreviewClick();
  };

  return (
    <RecCard
      raised={raised}
      onMouseOver={() => setRaised(true)}
      onMouseLeave={() => setRaised(false)}
      onClick={handleOpenReplay}
    >
      <CardHeader
        avatar={
          replay.DrivenByData?.BmpCRC && picExists ? (
            <img
              src={`${config.dlUrl}shirt/${replay.DrivenByData?.KuskiIndex}`}
              onError={() => setPicExists(false)}
              height="40"
              alt="shirt"
            />
          ) : (
            <Avatar>{replay.DrivenByData?.Kuski[0] || '?'}</Avatar>
          )
        }
        action={
          <IconButton
            aria-label="Open replay view"
            onClick={handlePreviewClick}
          >
            <PictureInPictureIcon />
          </IconButton>
        }
        title={
          replay.DrivenByData ? (
            <Kuski noLink kuskiData={replay.DrivenByData} />
          ) : (
            replay.DrivenByText || 'Unknown'
          )
        }
        subheader={formatDistanceStrict(replay.Uploaded * 1000, Date.now(), {
          addSuffix: true,
        })}
      />
      <ReplayCardMedia title={replay.RecFileName} height="160">
        <LevelMap
          LevelIndex={replay.LevelIndex}
          interaction={false}
          time={replay.ReplayTime}
          rating={replay.ratingAvg}
        />
      </ReplayCardMedia>
      <CardContent title={replay.Comment}>
        <Typography variant="body2" color="textSecondary" component="p">
          <Row jc="space-between">
            <Level LevelData={replay.LevelData} noLink />
            <div>{replay.RecFileName}</div>
          </Row>
        </Typography>
      </CardContent>
    </RecCard>
  );
}

const RecCard = styled(Card)`
  :hover {
    cursor: pointer;
  }
`;

const ReplayCardMedia = styled(CardMedia)`
  &.MuiCardMedia-root {
    height: 160px;
  }
`;
