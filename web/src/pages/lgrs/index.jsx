import { useNavigate, useParams } from '@tanstack/react-router';
import Layout from 'components/Layout';
import styled from '@emotion/styled';
import { Tab, Tabs } from '@material-ui/core';
import LGRGuide from 'features/LGRGuide';
import LGRUpload from 'features/LGRUpload';
import LGRList from 'features/LGRList';
import { nick } from 'utils/nick';

const LGRs = () => {
  const navigate = useNavigate();
  const { tab } = useParams({ strict: false });

  return (
    <Layout edge t="LGRs">
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab || ''}
        onChange={(_e, value) =>
          navigate({ to: ['/lgrs', value].filter(Boolean).join('/') })
        }
      >
        <Tab label="Repository" value="" />
        {nick() && <Tab label="Upload" value="upload" />}
        <Tab label="Development Guide" value="guide" />
      </Tabs>
      <Container>
        {!tab && <LGRList />}
        {tab === 'upload' && <LGRUpload />}
        {tab === 'guide' && <LGRGuide />}
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  min-height: 100%;
  box-sizing: border-box;
  font-size: 14px;
`;

export default LGRs;
