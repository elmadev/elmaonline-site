import styled from '@emotion/styled';
import { Add as AddIcon } from '@mui/icons-material';
import { Fab as MuiFab } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';

type FabProps = {
  url: string;
};

const Fab = ({ url }: FabProps) => {
  const navigate = useNavigate();
  return (
    <FabCon>
      <MuiFab
        color="primary"
        aria-label="Add"
        onClick={() => navigate({ to: url })}
      >
        <AddIcon />
      </MuiFab>
    </FabCon>
  );
};

const FabCon = styled.div`
  position: fixed;
  right: 30px;
  bottom: 30px;
`;

export default Fab;
