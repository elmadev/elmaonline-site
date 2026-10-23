import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import LevelMap from 'features/LevelMap';
import { Level } from 'components/Names';
import Kuski from 'components/Kuski';
import { formatDistanceStrict } from 'date-fns';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { Row } from 'components/Containers';
import { stripRecExt, shirtUrl } from 'utils/misc';
import type { ReplayData } from 'contract/replay.ts';

type ReplayCardProps = {
  replay: ReplayData;
  onPreviewClick: () => void;
};

export default function ReplayCard({
  replay,
  onPreviewClick,
}: ReplayCardProps) {
  const [picExists, setPicExists] = useState(true);
  const [raised, setRaised] = useState(false);
  const navigate = useNavigate();

  const handleOpenReplay = () => {
    navigate({
      to: `/r/${replay.UUID}/${stripRecExt(replay.RecFileName || '')}`,
    });
  };

  const handlePreviewClick = (event: React.MouseEvent) => {
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
              src={shirtUrl(replay.DrivenByData.KuskiIndex) ?? undefined}
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
            size="large"
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
      <ReplayCardMedia title={replay.RecFileName ?? undefined}>
        <LevelMap
          LevelIndex={replay.LevelIndex}
          interaction={false}
          time={replay.ReplayTime}
          rating={replay.ratingAvg}
        />
      </ReplayCardMedia>
      <CardContent title={replay.Comment ?? undefined}>
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
