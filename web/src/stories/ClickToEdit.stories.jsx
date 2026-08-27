import React from 'react';

import ClickToEdit from 'components/ClickToEdit';

export default {
  title: 'Input/ClickToEdit',
  component: ClickToEdit,
};

const Template = args => <ClickToEdit {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Input',
  value: 'Input',
  update: null,
};
