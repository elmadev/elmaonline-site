import React from 'react';
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

const Feedback = props => {
  const { open, text, type, close } = props;
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
      open={open}
      autoHideDuration={3000}
    >
      <SnackbarContent
        style={{ backgroundColor: colors[type] }}
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
