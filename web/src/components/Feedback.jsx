import React, { useState, useEffect } from 'react';
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

const Feedback = ({ open, text, type, close, autoHide = true }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(open);
  }, [open]);
  const colors = {
    success: '#43a047',
    error: '#d32f2f',
    info: '#1976d2',
    warning: '#ffa000',
  };
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={show}
      autoHideDuration={autoHide ? 7000 : null}
      onClose={() => {
        setShow(false);
        if (close) {
          close();
        }
      }}
    >
      <SnackbarContent
        style={{ backgroundColor: colors[type], color: 'white' }}
        aria-describedby="client-snackbar"
        message={<span id="client-snackbar">{text}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => close && close()}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

export default Feedback;
