import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Welcome from 'components/Welcome';
import Header from 'components/Header';

export default function WelcomeCard() {
  return (
    <Card>
      <CardContent>
        <Header h2>Welcome</Header>
        <Welcome />
      </CardContent>
    </Card>
  );
}
