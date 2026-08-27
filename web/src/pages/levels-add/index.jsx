import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Grid, Button } from '@material-ui/core';
import useFormal from '@kevinwolf/formal-web';
import * as yup from 'yup';
import Field from 'components/Field';
import Header from 'components/Header';
import Link from 'components/Link';
import { nickId } from 'utils/nick';
import Layout from 'components/Layout';
import Feedback from 'components/Feedback';

const schema = yup.object().shape({
  LevelPackName: yup
    .string()
    .required()
    .min(2)
    .max(16)
    .matches(
      /^[A-Za-z0-9-_]+$/,
      'Only letters, numbers, dash and underscore allowed, no spaces',
    ),
  LevelPackLongName: yup.string().required().min(2).max(30),
  LevelPackDesc: yup.string().required().max(255),
});

const LevelsAdd = () => {
  const { addSuccess, error } = useStoreState(state => state.LevelsAdd);
  const { addLevelPack, setError } = useStoreActions(
    actions => actions.LevelsAdd,
  );
  const formal = useFormal(
    {},
    {
      schema,
      onSubmit: values => addLevelPack({ ...values }),
    },
  );
  return (
    <Layout t="Add level pack">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Header h1>Add level pack</Header>
          {addSuccess === '' ? (
            <>
              {nickId() > 0 ? (
                <form {...formal.getFormProps()}>
                  <Field
                    label="Level pack name"
                    {...formal.getFieldProps('LevelPackName')}
                  />
                  <Field
                    label="Level pack long name"
                    {...formal.getFieldProps('LevelPackLongName')}
                  />
                  <Field
                    label="Level pack description"
                    {...formal.getFieldProps('LevelPackDesc')}
                  />
                  <Button variant="contained" onClick={() => formal.submit()}>
                    Create
                  </Button>
                </form>
              ) : (
                <div>Log in to create a level pack.</div>
              )}
            </>
          ) : (
            <>
              <div>
                Level pack{' '}
                <Link to={`/levels/packs/${addSuccess}`}>{addSuccess}</Link> has
                been created successfully.
              </div>
            </>
          )}
        </Grid>
      </Grid>
      <Feedback
        open={error !== ''}
        text={error}
        type="error"
        close={() => setError('')}
      />
    </Layout>
  );
};

export default LevelsAdd;
