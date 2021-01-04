import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CupWidget from 'components/CupWidget';

export default function FeedCard() {
  return (
    <Card>
      <CardHeader title="Feed" />
      <CardContent>
        <CupWidget ShortName="CPC" />
      </CardContent>
    </Card>
  );
}
