import React from 'react';

import FormResponse from 'components/FormResponse';

export default {
  title: 'Layout/FormResponse',
  component: FormResponse,
};

const Template = args => <FormResponse {...args} />;

export const Success = Template.bind({});
Success.args = {
  msgs: ['Success'],
  isError: false,
};

export const Error = Template.bind({});
Error.args = {
  msgs: ['Error occured'],
  isError: true,
};
