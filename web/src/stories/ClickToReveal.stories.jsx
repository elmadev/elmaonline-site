import React from 'react';

import ClickToReveal from 'components/ClickToReveal';

export default {
  title: 'Data/ClickToReveal',
  component: ClickToReveal,
};

const Template = args => <ClickToReveal {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Revealed data',
  value: 'Title',
  outsideClick: null,
};
