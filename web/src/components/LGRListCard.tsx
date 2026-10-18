import React, { useState } from 'react';
import { formatDistanceStrict } from 'date-fns';
import styled from '@emotion/styled';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Link from 'components/Link';
import Tags from 'components/Tags';
import { getLgrPreviewLink } from 'utils/link';
import config from 'config';

const LGRListCard = ({ lgr }) => {
  const [raised, setRaised] = useState(false);

  const download = event => {
    event.stopPropagation();
  };

  return (
    <Link to={`../lgr/${lgr.LGRName}`}>
      <LGRCard
        raised={raised}
        onMouseOver={() => setRaised(true)}
        onMouseLeave={() => setRaised(false)}
      >
        <CardHeader
          title={lgr.LGRName}
          subheader={formatDistanceStrict(lgr.Added * 1000, Date.now(), {
            addSuffix: true,
          })}
          action={
            <a href={`${config.api}lgr/get/${lgr.LGRName}?dl`}>
              <IconButton aria-label="Download LGR" onClick={download}>
                <GetAppIcon />
              </IconButton>
            </a>
          }
        />
        <LGRPreviewCard>
          <LGRPreviewImg src={getLgrPreviewLink(lgr)} />
          <DownloadsContainer>{lgr.Downloads}</DownloadsContainer>
        </LGRPreviewCard>
        <CardContent>
          <TagsContainer>
            <Tags tags={lgr.Tags.map(tag => tag.Name)} />
          </TagsContainer>
        </CardContent>
        <CardContent>
          <Desc
            variant="body2"
            color="textSecondary"
            component="p"
            title={lgr.LGRDesc}
          >
            {lgr.LGRDesc}
          </Desc>
        </CardContent>
      </LGRCard>
    </Link>
  );
};

const LGRCard = styled(Card)`
  :hover {
    cursor: pointer;
  }
  height: 380px;
`;

const Desc = styled(Typography)`
  white-space: pre-line;
`;

const LGRPreviewCard = styled(CardMedia)`
  background-size: contain;
  position: relative;
`;

const LGRPreviewImg = styled.img`
  background-size: contain;
  height: 160px;
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const DownloadsContainer = styled.span`
  background: #fff;
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  padding: 2px 3px;
  background: yellow;
  color: #222;
`;

const TagsContainer = styled.span`
  float: right;
`;

export default LGRListCard;
