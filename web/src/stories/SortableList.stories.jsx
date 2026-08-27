import React from 'react';
import { ListCell, ListRow } from 'components/List';
import SortableList from 'components/SortableList';

export default {
  title: 'Layout/SortableList',
  component: SortableList,
};

const rowsData = [
  { name: 'Malika', age: 13 },
  { name: 'Zac', age: 34 },
  { name: 'Lucas', age: 67 },
];

const rows = () => {
  return (
    <>
      {rowsData.map(r => (
        <ListRow>
          <ListCell>{r.name}</ListCell>
          <ListCell>{r.age}</ListCell>
        </ListRow>
      ))}
    </>
  );
};

const Template = args => <SortableList {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: rows,
  chin: null,
  horizontalMargin: null,
  width: '400px',
  flex: null,
  headers: ['Name', 'Age'],
  sort: null,
};
