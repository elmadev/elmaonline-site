import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './loading.css';

const Loading = () => (
  <div className={s.loading}>
    <div className={s.spinner}>
      <div className={s.bounce1} />
      <div className={s.bounce2} />
      <div />
    </div>
  </div>
);

export default withStyles(s)(Loading);
