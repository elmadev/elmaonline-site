import React from 'react';

import { Dropdown } from 'components/Inputs';

export default {
  title: 'Input/Dropdown',
  component: Dropdown,
};

const Template = args => <Dropdown {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  name: 'Name',
  options: ['Option 1', 'Option 2', 'Something else'],
  selected: 'Option 2',
  update: null,
};
