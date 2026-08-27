import React from 'react';

import Button from 'components/Buttons';

export default {
  title: 'Input/Button',
  component: Button,
};

const Template = args => <Button {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Button',
  onClick: null,
  margin: '',
  disabled: false,
  secondary: false,
  naked: false,
  little: false,
  to: '',
};
