import React from 'react';

import Alert from 'components/Alert';

export default {
  title: 'Layout/Alert',
  component: Alert,
};

const Template = args => <Alert {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  open: true,
  text: 'Alert text',
  options: ['Yes', 'No'],
  title: 'Title',
  onClose: null,
};
