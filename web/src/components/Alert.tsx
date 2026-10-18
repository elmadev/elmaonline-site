import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

class Alert extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    const { open, text, options, title, onClose, link } = this.props;
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
  }
}

export default Alert;
