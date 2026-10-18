import React from 'react';
import styled from '@emotion/styled';
import config from 'config';

const Video = ({ width, height, poster, video, formats = [] }) => {
  return (
    <Container>
      <video
        preload="none"
        poster={`${config.s3Url}video/${poster}`}
        controls
        width={width}
        height={height}
        muted
      >
        {formats.map(format => (
          <source
            key={format}
            src={`${config.s3Url}video/${video}`}
            type={`video/${format}`}
          />
        ))}
      </video>
    </Container>
  );
};

const Container = styled.div`
  cursor: pointer;
`;

export default Video;
