import React from 'react';

import Comments from 'components/Comments';

export default {
  title: 'Data/Comments',
  component: Comments,
};

const Template = args => <Comments {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  comments: [
    {
      ReplayCommentIndex: 1,
      Entered: 1617354986,
      KuskiIndex: 1,
      KuskiData: { Kuski: 'Mark' },
      Text: 'This is a comment',
    },
    {
      ReplayCommentIndex: 2,
      Entered: 1617355986,
      KuskiIndex: 2,
      KuskiData: { Kuski: 'Kate' },
      Text: 'I like',
    },
  ],
  loading: false,
};
