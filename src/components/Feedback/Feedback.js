import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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
            onClick={() => close()}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

export default Feedback;
