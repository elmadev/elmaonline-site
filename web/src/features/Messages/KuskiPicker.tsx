import { useEffect } from 'react';
import { useStoreState, useStoreActions } from './storeHooks';
import { KuskiAutoComplete } from 'components/AutoComplete';
import type { KuskiData } from 'types/kuski';

type KuskiPickerProps = {
  selected: KuskiData[];
  onChange: (kuskis: KuskiData[]) => void;
  exclude?: number[];
  label?: string;
};

const KuskiPicker = ({
  selected,
  onChange,
  exclude = [],
  label = 'To',
}: KuskiPickerProps) => {
  const { playerList } = useStoreState(state => state.Kuskis);
  const { getPlayers } = useStoreActions(actions => actions.Kuskis);

  useEffect(() => {
    if (!playerList.length) {
      getPlayers();
    }
  }, []);

  const list = playerList.filter(k => !exclude.includes(Number(k.KuskiIndex)));

  return (
    <KuskiAutoComplete
      list={list}
      selected={selected}
      label={label}
      onChange={(_ids, kuskis) => onChange(kuskis || [])}
    />
  );
};

export default KuskiPicker;
