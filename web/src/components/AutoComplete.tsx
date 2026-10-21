import React from 'react';
import {
  TextField,
  ListSubheader,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import type {
  AutocompleteRenderGroupParams,
  AutocompleteValue,
  TextFieldProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AutocompleteMui from '@mui/material/Autocomplete';
import Kuski from 'components/Kuski';
import { VariableSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import type { KuskiData } from 'types/kuski';

type Value<T> = AutocompleteValue<T, boolean, false, false>;

type AutoCompleteProps<T> = {
  options: T[];
  onChange: (value: Value<T>) => void;
  value: Value<T>;
  label: string;
  multiple?: boolean;
  getOptionLabel: (option: T) => string;
  groupBy?: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  renderOption?: (option: T) => React.ReactNode;
  onOpen?: () => void;
  loading?: boolean;
};

const listboxProps = {
  sx: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
} as const;

// Virtualized lists need the <li> rendered here so react-window can position it
const optionRenderer = <T,>(render: (option: T) => React.ReactNode) =>
  function OptionRenderer(
    props: React.HTMLAttributes<HTMLLIElement> & { key: React.Key },
    option: T,
  ) {
    const { key, ...optionProps } = props;
    return (
      <li key={key} {...optionProps}>
        {render(option)}
      </li>
    );
  };

const AutoComplete = <T,>({
  options,
  onChange,
  value,
  label,
  multiple = false,
  getOptionLabel,
  groupBy,
  isOptionEqualToValue,
  renderOption,
  onOpen,
  loading = false,
}: AutoCompleteProps<T>) => (
  <AutocompleteMui<T, boolean, false, false>
    multiple={multiple}
    options={options}
    getOptionLabel={getOptionLabel}
    filterSelectedOptions
    groupBy={groupBy}
    renderInput={params => (
      <TextField {...params} label={label} variant="outlined" />
    )}
    onChange={(_e, newValue) => onChange(newValue)}
    value={value}
    isOptionEqualToValue={isOptionEqualToValue}
    renderGroup={renderGroup}
    ListboxComponent={ListboxComponent}
    ListboxProps={listboxProps}
    renderOption={renderOption ? optionRenderer(renderOption) : undefined}
    onOpen={onOpen}
    loading={loading}
  />
);

type KuskiAutoCompleteProps = {
  list: KuskiData[];
  onChange: (
    value: (number | undefined)[] | KuskiData | null,
    kuskis?: KuskiData[],
  ) => void;
  selected: Value<KuskiData>;
  multiple?: boolean;
  label?: string;
  variant?: TextFieldProps['variant'];
  disabled?: boolean;
};

export const KuskiAutoComplete = ({
  list,
  onChange,
  selected,
  multiple = true,
  label = 'Kuski',
  variant = 'outlined',
  disabled = false,
}: KuskiAutoCompleteProps) => (
  <>
    {list.length > 0 ? (
      <AutocompleteMui<KuskiData, boolean, false, false>
        id="filter-kuski"
        options={list}
        multiple={multiple}
        filterSelectedOptions
        getOptionLabel={option => option.Kuski}
        isOptionEqualToValue={(option, value) =>
          option.KuskiIndex === value?.KuskiIndex
        }
        onChange={(_event, newValue) => {
          if (Array.isArray(newValue)) {
            onChange(
              newValue.map(value => value.KuskiIndex),
              newValue,
            );
          } else {
            onChange(newValue);
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            placeholder="Name(s)"
            variant={variant}
          />
        )}
        renderOption={optionRenderer<KuskiData>(option => (
          <Kuski kuskiData={option} flag team noLink />
        ))}
        value={selected}
        ListboxComponent={ListboxComponent}
        ListboxProps={listboxProps}
        renderGroup={renderGroup}
        disabled={disabled}
      />
    ) : (
      <CircularProgress />
    )}
  </>
);

const LISTBOX_PADDING = 8; // px

function renderRow({
  data,
  index,
  style,
}: ListChildComponentProps<
  React.ReactElement<{ style: React.CSSProperties }>[]
>) {
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: Number(style.top) + LISTBOX_PADDING,
    },
  });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>(
  function OuterElementType(props, ref) {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
  },
);

function useResetCache(data: number) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<{ style: React.CSSProperties }> =>
      React.isValidElement(child),
  );
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child: React.ReactNode) => {
    if (React.isValidElement(child) && child.type === ListSubheader) {
      return 48;
    }

    return itemSize;
  };

  const totalSize = itemData.map(getChildSize).reduce((a, b) => a + b, 0);

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return totalSize;
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={index => getChildSize(itemData[index])}
          estimatedItemSize={itemCount ? totalSize / itemCount : itemSize}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const renderGroup = (params: AutocompleteRenderGroupParams) => [
  params.group ? (
    <ListSubheader key={params.key} component="div">
      {params.group}
    </ListSubheader>
  ) : null,
  params.children,
];

export default AutoComplete;
