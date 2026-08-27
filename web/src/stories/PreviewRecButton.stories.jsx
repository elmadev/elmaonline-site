import React from 'react';

import PreviewRecButton from 'components/PreviewRecButton';

export default {
  title: 'Input/PreviewRecButton',
  component: PreviewRecButton,
};

const Template = args => <PreviewRecButton {...args} />;

export const Play = Template.bind({});
Play.args = {
  isPlaying: false,
  setPreviewRecIndex: null,
  CupTimeIndex: 1,
};

export const Stop = Template.bind({});
Stop.args = {
  isPlaying: true,
  setPreviewRecIndex: null,
  CupTimeIndex: 1,
};
