import styled from '@emotion/styled';
import { StarBorder } from '@mui/icons-material';
import Rating from '@mui/material/Rating';

type StarsProps = {
  voted: number;
  average: number;
  vote: (value: number | null) => void;
  clickable: boolean;
  amount?: number;
};

const Stars = ({ voted, average, vote, clickable, amount = 0 }: StarsProps) => (
  <Container>
    <Rating
      name="replay-rating"
      value={voted}
      onChange={(_event, newValue) => {
        vote(newValue);
      }}
      emptyIcon={<StarBorder fontSize="inherit" />}
      readOnly={!clickable}
      max={10}
    />
    <AverageRating title="Vote average">
      {Number(average).toFixed(2)}
    </AverageRating>
    {amount !== 0 && (
      <AverageRating title="Amount of votes">({amount})</AverageRating>
    )}
  </Container>
);

const Container = styled.div`
  font-size: 16px;
  height: 19px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const AverageRating = styled.div`
  margin-left: 0.35em;
  font-weight: bold;
`;

export default Stars;
