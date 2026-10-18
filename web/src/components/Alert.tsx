import Link from 'components/Link';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type AlertProps = {
  title: string;
  open: boolean;
  text: string;
  options: string[];
  onClose: (optionIndex?: number) => void;
  link?: string;
};

const Alert = ({ open, text, options, title, onClose, link }: AlertProps) => (
  <Dialog
    open={open}
    onClose={() => onClose()}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {text}
        {link && (
          <Link to={link}>
            <div>{link}</div>
          </Link>
        )}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      {options.map((o, i) => (
        <Button key={o} onClick={() => onClose(i)} color="primary">
          {o}
        </Button>
      ))}
    </DialogActions>
  </Dialog>
);

export default Alert;
