import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from '@emotion/styled';
import { CropLandscape, Crop75 } from '@mui/icons-material';
import { Row } from 'components/Containers';

const ReplaySettings = () => {
  const {
    settings: { theater },
  } = useStoreState(state => state.ReplaySettings);
  const { toggleSetting } = useStoreActions(actions => actions.ReplaySettings);

  return (
    <Row jc="flex-end" ai="center">
      <IconTheater onClick={() => toggleSetting('theater')}>
        {theater ? <Crop75 /> : <CropLandscape />}
      </IconTheater>
    </Row>
  );
};

const IconTheater = styled.div`
  padding: ${p => p.theme.padXSmall};
  cursor: pointer;
  @media (max-width: 1100px) {
    display: none;
  }
`;

export default ReplaySettings;
