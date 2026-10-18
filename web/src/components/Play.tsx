import styled from '@emotion/styled';
import { Paper } from 'components/Paper';
import { PlayArrow } from '@mui/icons-material';
import Sky from '../images/sky.png';

type PlayProps = {
  onClick?: () => void;
  type: 'replay' | 'map';
};

const Play = ({ onClick, type }: PlayProps) => {
  return (
    <Paper onClick={() => onClick && onClick()}>
      <Container>
        <Arrow />
        {type === 'replay' && <Text>Click to show replay</Text>}
        {type === 'map' && <Text>Click to show map</Text>}
      </Container>
    </Paper>
  );
};

const Text = styled.div`
  color: white;
`;

const Container = styled.div`
  background-image: url('${Sky}');
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;
  flex-direction: column;
  @media screen and (max-width: 500px) {
    height: 400px;
  }
`;

const Arrow = styled(PlayArrow)`
  & {
    font-size: 10rem !important;
    color: white;
  }
`;

export default Play;
