import React, { useEffect } from 'react';
import { groupBy, mapValues, sumBy, sortBy, filter } from 'lodash';
import Link from 'components/Link';
import Flag from 'components/Flag';
import styled from '@emotion/styled';
import Header from 'components/Header';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import DonationsQR from './DonationsQR.png';
import { useStoreActions, useStoreState } from 'easy-peasy';

const parseDonations = donations => {
  const accountBalance = sumBy(donations, v =>
    v.Processed === 1 ? v.mc_gross - v.mc_fee : 0,
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

const runningCosts = 52.0;

const paymentInfo = balance => {
  const date = new Date(Date.now());
  const now = new Date(date);
  date.setMonth(date.getMonth() + 1 + parseInt(balance / runningCosts, 10));
  now.setMonth(now.getMonth() + 1);
  now.setDate(1);
  return {
    date: date.toDateString(),
    nextPayment: now.toDateString(),
    percentage: (balance / runningCosts) * 100.0,
  };
};

const Donate = ({ cached = false, small = false }) => {
  const {
    donate: { donations },
  } = useStoreState(state => state.Help);
  const {
    donate: { getDonations },
  } = useStoreActions(actions => actions.Help);

  useEffect(() => {
    getDonations({ cached });
  }, [cached]);

  if (!donations) return <span>loading...</span>;

  const donators = parseDonations(donations);
  const paymentDates = paymentInfo(donators.accountBalance);

  return (
    <Text>
      {small ? null : (
        <div className="header">
          <Header h2>Donate</Header>
        </div>
      )}
      <div className="main">
        <RightContainer small={small}>
          {small ? null : (
            <>
              <Header h3>Donate</Header>
              <p>
                Read the QR code or click the button underneath to donate via
                paypal.
              </p>
            </>
          )}
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
          {small ? null : (
            <>
              <p>
                It is completely free to play EOL, however it costs a little sum
                to keep the server running, which is what donations goes
                towards.
              </p>
              <p>
                Donations are paid to a dedicated EOL paypal account, which is
                only used for paying the server bill, and competition prizes.
                Remember to add your nick in the comment field if you want your
                donation attributed here. You can pay without a paypal account,
                just select credit card payment.
              </p>
              <p>
                Server costs are ${runningCosts} a month, paid forward on the
                1st of every month. It should be noted that donating does not
                guarantee any sort of uptime, service or support.
              </p>
              <Header h3>Payment status</Header>
            </>
          )}
          <p>
            <BoldText>{paymentDates.percentage.toFixed(2)}%</BoldText> of the
            next payment is paid.
          </p>
          <p>
            Next payment: <BoldText>{paymentDates.nextPayment}</BoldText>.
          </p>
          <p>
            Paid until: <BoldText>{paymentDates.date}</BoldText>.
          </p>
        </RightContainer>
        {small ? null : (
          <div className="left">
            <Header h3>Donator toplist</Header>
            <Table size="small">
              <TableBody>
                {donators.donators &&
                  donators.donators.map((r, i) => {
                    return (
                      <TableRow key={`${i.toString()}r`}>
                        <TableCell key={`${i.toString()}p`}>
                          <Flag nationality={r.Country} />{' '}
                          <Link to={`/kuskis/${r.Kuski}`}>{r.Kuski}</Link>{' '}
                          {r.Team && (
                            <Link to={`/team/${r.Team}`}> [{r.Team}]</Link>
                          )}
                        </TableCell>
                        <TableCell
                          align="right"
                          key={`${i.toString()}a`}
                        >{`$${r.Amount.toFixed(2)}`}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Text>
  );
};

const RightContainer = styled.div`
  width: ${p => (p.small ? '100%' : '50%')};
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
