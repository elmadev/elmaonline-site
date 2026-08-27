import React from 'react';

import Feedback from 'components/Feedback';

export default {
  title: 'Layout/Feedback',
  component: Feedback,
};

const Template = args => <Feedback {...args} />;

export const Success = Template.bind({});
Success.args = {
  open: true,
  text: 'Success message',
  type: 'success',
  close: null,
};

export const Error = Template.bind({});
Error.args = {
  open: true,
  text: 'Error message',
  type: 'error',
  close: null,
};

export const Info = Template.bind({});
Info.args = {
  open: true,
  text: 'Info message',
  type: 'info',
  close: null,
};

export const Warning = Template.bind({});
Warning.args = {
  open: true,
  text: 'Warning message',
  type: 'warning',
  close: null,
};
