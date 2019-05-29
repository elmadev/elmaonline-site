import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import s from './Alert.css';

class Alert extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    const { open, text, options, title, onClose } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
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
  }
}

export default withStyles(s)(Alert);
