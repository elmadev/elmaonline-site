import React from 'react';

import Field from 'components/Field';

export default {
  title: 'Input/Field',
  component: Field,
};

const Template = args => <Field {...args} />;

export const Text = Template.bind({});
Text.args = {
  date: false,
  label: 'fieldname',
  error: '',
  value: 'field value',
};

export const TextWithError = Template.bind({});
TextWithError.args = {
  date: false,
  label: 'fieldname',
  error: 'Error message',
  value: 'field value',
};

export const Date = Template.bind({});
Date.args = {
  date: true,
  label: 'fieldname',
  error: '',
  value: 'field value',
};
