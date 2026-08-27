import React from 'react';

import Video from 'components/Video';

export default {
  title: 'Data/Video',
  component: Video,
};

const Template = args => <Video {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  width: '358',
  height: '201',
  poster: 'trailer-poster.jpg',
  video: 'trailer.mp4',
  formats: ['mp4'],
};
