/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Grid, Button } from '@material-ui/core';
import useFormal from '@kevinwolf/formal-web';
import * as yup from 'yup';
import Field from 'components/Field';
import Header from 'components/Header';
import Link from 'components/Link';
import { nickId } from 'utils/nick';

const schema = yup.object().shape({
  LevelPackName: yup
    .string()
    .required()
    .min(2)
    .max(16),
  LevelPackLongName: yup
    .string()
    .required()
    .min(2)
    .max(30),
  LevelPackDesc: yup
    .string()
    .required()
    .max(255),
});

const LevelsAdd = () => {
  const { addSuccess } = useStoreState(state => state.LevelsAdd);
  const { addLevelPack } = useStoreActions(actions => actions.LevelsAdd);
  const formal = useFormal(
    {},
    {
      schema,
      onSubmit: values => addLevelPack({ ...values }),
    },
  );
  return (
    <Container>
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
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

export default LevelsAdd;
