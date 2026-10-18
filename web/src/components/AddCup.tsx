import { useState } from 'react';
import useFormal from '@kevinwolf/formal-web';
import * as yup from 'yup';
import Field from 'components/Field';
import FieldBoolean from 'components/FieldBoolean';
import { Button } from '@mui/material';
import { nickId } from 'utils/nick';

const schema = yup.object().shape({
  CupName: yup.string().required().max(32),
  Description: yup.string().required().max(65535),
  ShortName: yup.string().required().min(2).max(4),
  Skips: yup.number().required().min(0).max(9),
  Events: yup.number().required().min(1).max(99),
});

type CupForm = Partial<yup.InferType<typeof schema>>;

export type NewCup = CupForm & { AppleResults: boolean };

type AddCupProps = {
  add: (cup: NewCup) => void;
};

const initialValues: CupForm = {};

const AddCup = ({ add }: AddCupProps) => {
  const [AppleResults, setAppleResults] = useState(false);
  const formal = useFormal(initialValues, {
    schema,
    onSubmit: values => add({ ...values, AppleResults }),
  });
  return (
    <>
      {nickId() > 0 ? (
        <form {...formal.getFormProps()}>
          <Field label="Cup Name" {...formal.getFieldProps('CupName')} />
          <Field label="Description" {...formal.getFieldProps('Description')} />
          <FieldBoolean
            label="Apple Results (default, can be changed per event)"
            value={AppleResults}
            onChange={() => setAppleResults(!AppleResults)}
          />
          <Field label="Short Name" {...formal.getFieldProps('ShortName')} />
          <Field label="Skips" {...formal.getFieldProps('Skips')} />
          <Field label="Events" {...formal.getFieldProps('Events')} />
          <Button variant="contained" onClick={() => formal.submit()}>
            Create
          </Button>
        </form>
      ) : (
        <div>Log in to create a cup.</div>
      )}
    </>
  );
};

export default AddCup;
