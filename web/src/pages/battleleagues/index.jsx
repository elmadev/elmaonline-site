import React, { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import Loading from 'components/Loading';
import Header from 'components/Header';
import LinkWithDesc from 'components/LinkWithDesc';
import { Grid } from '@material-ui/core';
import Button from 'components/Buttons';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Paper } from 'components/Paper';
import useFormal from '@kevinwolf/formal-web';
import * as yup from 'yup';
import Field from 'components/Field';
import { Dropdown } from 'components/Inputs';
import { nickId } from 'utils/nick';
import Link from 'components/Link';

const schema = yup.object().shape({
  LeagueName: yup.string().required().max(255),
  LeagueDescription: yup.string().required().max(65535),
  ShortName: yup.string().required().min(2).max(10),
  Skips: yup.number().min(0).max(9),
  Events: yup.number().min(1).max(99),
});

const BattleLeagues = () => {
  const [ps, setPs] = useState('0');
  const { data, loading, response } = useStoreState(
    state => state.BattleLeagues,
  );
  const { fetch, create } = useStoreActions(actions => actions.BattleLeagues);

  const formal = useFormal(
    {},
    {
      schema,
      onSubmit: values => create({ ...values, PointSystem: ps }),
    },
  );

  useEffect(() => {
    fetch();
  }, []);

  if (loading) {
    return (
      <Layout t="Battle Leagues">
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout t="Battle Leagues">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <Paper padding>
            <Header h1>Battle Leagues</Header>
            {data?.length > 0 &&
              data.map(c => (
                <LinkWithDesc
                  key={c.ShortName}
                  link={`/battleleagues/${c.ShortName}`}
                  name={c.LeagueName}
                  desc={c.LeagueDescription}
                />
              ))}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Paper padding>
            <Header h1>Create new battle league</Header>
            {!response ? (
              <>
                {nickId() > 0 ? (
                  <form {...formal.getFormProps()}>
                    <Field
                      label="League Name *"
                      {...formal.getFieldProps('LeagueName')}
                    />
                    <Field
                      label="Description *"
                      {...formal.getFieldProps('LeagueDescription')}
                    />
                    <Field
                      label="Short Name *"
                      {...formal.getFieldProps('ShortName')}
                    />
                    <Field label="Skips" {...formal.getFieldProps('Skips')} />
                    <Field label="Events" {...formal.getFieldProps('Events')} />
                    <Dropdown
                      name="Point system"
                      options={[
                        {
                          id: '0',
                          name: 'Mopo battle points (100, 80, 60, 50, 45, ...)',
                        },
                        {
                          id: '1',
                          name: 'Cup points (100, 85, 75, 70, 65, ...)',
                        },
                        {
                          id: '2',
                          name: 'Top 20 points (25, 20, 18, 17, 16, ...)',
                        },
                        {
                          id: '3',
                          name: 'Beer battle (beat count +1)',
                        },
                      ]}
                      selected={ps}
                      update={v => setPs(v)}
                    />
                    <Button margin="12px 0" onClick={() => formal.submit()}>
                      Create
                    </Button>
                  </form>
                ) : (
                  <div>Log in to create a battle league.</div>
                )}
                <Header h2 top>
                  Help
                </Header>
                <ul>
                  <li>Short Name is used for the url.</li>
                  <li>Skips are per season.</li>
                  <li>
                    Events are per season and only relevant if you use skips.
                  </li>
                </ul>
              </>
            ) : (
              <div>
                Battle league{' '}
                <Link to={`/battleleagues/${response.ShortName}`}>
                  {response.LeagueName}
                </Link>{' '}
                successfully.
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default BattleLeagues;
