import React from 'react';

import Recplayer from 'components/Recplayer';

export default {
  title: 'Data/Recplayer',
  component: Recplayer,
};

const Template = args => <Recplayer {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  rec:
    'https://eol.ams3.digitaloceanspaces.com/replays/vddkmk5d6a/01Kopaka.rec',
  lev: 'https://api.elma.online/dl/level/2',
  zoom: 1,
};
