import React from 'react';
import { groupBy, mapValues, sumBy, sortBy, filter } from 'lodash';
import Link from 'components/Link';
import Flag from 'components/Flag';
import styled from 'styled-components';
import Header from 'components/Header';
import { Grid, Table, TableCell, TableRow } from '@material-ui/core';
import DonationsQR from './DonationsQR.png';

const parseDonations = donations => {
  const accountBalance = sumBy(donations, v =>
    v.Processed === 1 ? v.mc_gross : 0,
  );
  const donos = filter(donations, r => r.KuskiIndex !== 0 && r.Processed === 1);
  const a = groupBy(donos, 'KuskiIndex');
  const b = mapValues(a, (value, key) => {
    return {
      KuskiIndex: key,
      Amount: sumBy(value, 'mc_gross'),
      Team: value[0].KuskiData.TeamData ? value[0].KuskiData.TeamData.Team : '',
      Country: value[0].KuskiData.Country,
      Kuski: value[0].KuskiData.Kuski,
    };
  });
  const donators = sortBy(b, 'Amount').reverse();
  return { donators, accountBalance };
};

const paymentInfo = balance => {
  const date = new Date(Date.now());
  const now = new Date(date);
  date.setMonth(date.getMonth() + parseInt(balance / 26.0, 10));
  if (now.getDate() <= 27) now.setDate(27);
  else {
    now.setMonth(now.getMonth() + 1).setDate(27);
  }
  return {
    date: date.toDateString(),
    nextPayment: now.toDateString(),
    percentage: (balance / 26.0) * 100.0,
  };
};

const Donate = ({ donations }) => {
  const donators = parseDonations(donations);
  const paymentDates = paymentInfo(donators.accountBalance);
  return (
    <Text>
      <div className="header">
        <Header h2>Donate</Header>
      </div>
      <div className="main">
        <RightContainer>
          <Header h3>Donate</Header>
          <Grid container spacing={1} direction="column">
            <Grid item xs={12}>
              Read the QR code or click the button underneath to donate via
              paypal.
            </Grid>
            <Grid item xs={12}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  width: '80%',
                }}
              >
                <img src={DonationsQR} alt="qr" />
                <div style={{ alignSelf: 'center' }}>
                  <form
                    action="https://www.paypal.com/donate"
                    method="post"
                    target="_top"
                  >
                    <input
                      type="hidden"
                      name="hosted_button_id"
                      value="526TTPQT9BUEN"
                    />
                    <input
                      type="image"
                      src="https://www.paypalobjects.com/en_US/DK/i/btn/btn_donateCC_LG.gif"
                      border="0"
                      name="submit"
                      title="PayPal - The safer, easier way to pay online!"
                      alt="Donate with PayPal button"
                    />
                    <img
                      alt=""
                      border="0"
                      src="https://www.paypal.com/en_DK/i/scr/pixel.gif"
                      width="1"
                      height="1"
                    />
                  </form>
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              It is completely free to play EOL, however it costs a little sum
              to keep the server running, which is what donations goes towards.
            </Grid>
            <Grid item xs={12}>
              Donations are paid to a dedicated EOL paypal account, which is
              only used for paying the server bill. Remember to let it redirect
              you back here, otherwise we can&#39;t track your payment, it will
              still be recieved however, only the payment status won&#39;t
              update. No paypal account is needed.
            </Grid>
            <Grid item xs={12}>
              Server costs are 26$ a month, paid the 27th every month. It should
              be noted that donating does not guarantee any sort of uptime,
              service or support.
            </Grid>
            <Grid item xs={12}>
              <Header h3>Payment status</Header>
              <Grid container spacing={1} direction="column">
                <Grid item>
                  <BoldText>{paymentDates.percentage.toFixed(2)}%</BoldText> of
                  the next payment is paid.
                </Grid>
                <Grid item>
                  Next payment: <BoldText>{paymentDates.date}</BoldText>.
                </Grid>
                <Grid item>
                  Paid until: <BoldText>{paymentDates.nextPayment}</BoldText>.
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </RightContainer>
        <div className="left">
          <Grid item xs={12}>
            <Header h3>Donator toplist</Header>
            <Table size="small">
              {donators.donators &&
                donators.donators.map(r => {
                  return (
                    <TableRow>
                      <TableCell>
                        <Flag nationality={r.Country} />{' '}
                        <Link to={`/kuskis/${r.Kuski}`}>{r.Kuski}</Link>{' '}
                        {r.Team && (
                          <Link to={`/team/${r.Team}`}> [{r.Team}]</Link>
                        )}
                      </TableCell>
                      <TableCell align="right">{`${r.Amount.toFixed(
                        2,
                      )}$`}</TableCell>
                    </TableRow>
                  );
                })}
            </Table>
          </Grid>
        </div>
      </div>
    </Text>
  );
};

const RightContainer = styled.div`
  width: 50%;
  padding: 4px;
`;

const BoldText = styled.span`
  font-weight: 500;
`;

const Text = styled.div`
  padding-left: 8px;
  .header {
    width: 100%;
    padding-left: 4px;
  }
  .main {
    display: flex;
  }
`;

export default Donate;
