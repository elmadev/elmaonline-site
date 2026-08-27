import React from 'react';

import { TextField } from 'components/Inputs';

export default {
  title: 'Input/TextField',
  component: TextField,
};

const Template = args => <TextField {...args} />;

export const Text = Template.bind({});
Text.args = {
  name: 'Name',
  error: '',
  value: 'Input value',
  onChange: null,
};

export const TextWithError = Template.bind({});
TextWithError.args = {
  name: 'Name',
  error: 'Error message',
  value: 'Input value',
  onChange: null,
};

export const Date = Template.bind({});
Date.args = {
  name: 'Date input',
  date: true,
  onChange: null,
};
