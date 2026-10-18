import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
