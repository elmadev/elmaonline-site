import React from 'react';

import FieldAutoComplete from 'components/FieldAutoComplete';

export default {
  title: 'Input/FieldAutoComplete',
  component: FieldAutoComplete,
};

const Template = args => <FieldAutoComplete {...args} />;

export const Field = Template.bind({});
Field.args = {
  label: 'fieldname',
  error: '',
  list: [
    { name: 'Name', value: 'value' },
    { name: 'Other name', value: 'othervalue' },
    { name: 'Third Name', value: 'thirdvalue' },
    { name: 'Abdomen', value: 'Abdomen' },
  ],
  getOptions: null,
  valueSelected: null,
};

export const FieldWithError = Template.bind({});
Field.args = {
  label: 'fieldname',
  error: 'Error message',
  list: [
    { name: 'Name', value: 'value' },
    { name: 'Other name', value: 'othervalue' },
    { name: 'Third Name', value: 'thirdvalue' },
    { name: 'Abdomen', value: 'Abdomen' },
  ],
  getOptions: null,
  valueSelected: null,
};
