import React from 'react';
import {
  TextField,
  ListSubheader,
  CircularProgress,
  useMediaQuery,
} from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import AutocompleteMui from '@material-ui/lab/Autocomplete';
import Kuski from 'components/Kuski';
import { VariableSizeList } from 'react-window';

const AutoComplete = ({
  options,
  onChange,
  value,
  label,
  multiple = false,
  getOptionLabel,
  groupBy,
  getOptionSelected,
  renderOption,
  onOpen,
  loading = false,
}) => {
  const acClasses = useStyles();
  return (
    <AutocompleteMui
      multiple={multiple}
      options={options}
      getOptionLabel={getOptionLabel}
      filterSelectedOptions
      groupBy={groupBy}
      renderInput={params => (
        <TextField {...params} label={label} variant="outlined" />
      )}
      onChange={(e, value) => onChange(value)}
      value={value}
      getOptionSelected={getOptionSelected}
      renderGroup={renderGroup}
      ListboxComponent={ListboxComponent}
      classes={acClasses}
      renderOption={renderOption}
      onOpen={onOpen}
      loading={loading}
    />
  );
};

export const KuskiAutoComplete = ({
  list,
  onChange,
  selected,
  multiple = true,
  label = 'Kuski',
  variant = 'outlined',
  disabled = false,
}) => {
  const acClasses = useStyles();
  return (
    <>
      {list.length > 0 ? (
        <AutocompleteMui
          id="filter-kuski"
          options={list}
          multiple={multiple}
          filterSelectedOptions
          getOptionLabel={option => option.Kuski}
          getOptionSelected={(option, value) =>
            option.KuskiIndex === value?.KuskiIndex
          }
          onChange={(event, newValue) => {
            if (!multiple) {
              onChange(newValue);
            } else {
              const ids = newValue.map(value => value.KuskiIndex);
              onChange(ids, newValue);
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
          renderOption={option => <Kuski kuskiData={option} flag team noLink />}
          value={selected}
          ListboxComponent={ListboxComponent}
          renderGroup={renderGroup}
          classes={acClasses}
          disabled={disabled}
        />
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING,
    },
  });
}

const OuterElementContext = React.createContext({});

// eslint-disable-next-line react/display-name
const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

const useStyles = makeStyles({
  listbox: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

// Adapter for react-window
const ListboxComponent = React.forwardRef(
  function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = child => {
      if (React.isValidElement(child) && child.type === ListSubheader) {
        return 48;
      }

      return itemSize;
    };

    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * itemSize;
      }
      return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
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
            overscanCount={5}
            itemCount={itemCount}
          >
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  },
);

const renderGroup = params => {
  if (!params.group) {
    return [null, params.children];
  }
  return [
    <ListSubheader key={params.key} component="div">
      {params.group}
    </ListSubheader>,
    params.children,
  ];
};

export default AutoComplete;
