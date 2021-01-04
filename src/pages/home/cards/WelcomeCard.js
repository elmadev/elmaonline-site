import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Welcome from 'components/Welcome';

export default function WelcomeCard() {
  return (
    <Card>
      <CardHeader title="Welcome" />
      <CardContent>
        <Welcome />
      </CardContent>
    </Card>
  );
}
