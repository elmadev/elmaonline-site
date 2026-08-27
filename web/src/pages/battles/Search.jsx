import React, { useState, useMemo, useEffect } from 'react';
import styled from '@emotion/styled';
import Loading from 'components/Loading';
import queryString from 'query-string';
import { Dropdown, TextField } from 'components/Inputs';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { getBattleTypes } from 'utils/eol';
import { forceInt } from 'utils/calcs';
import Slider from '@material-ui/core/Slider';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import { parseDateRange, getTypeAndDate } from 'utils/parseDateRange';
import { format, endOfDay, addDays } from 'date-fns';
import { BattleListTable } from 'features/BattleList';
import { Button } from '@material-ui/core';
import { TablePagination } from '@material-ui/core';
import Switch from 'components/Switch';
import { BattlesSearch, useQueryAlt } from 'api';
import { ExpandMore } from '@material-ui/icons';
import Header from 'components/Header';
import { Paper } from 'components/Paper';
import { getOrderedValues } from 'utils/misc';
import { isEqual } from 'lodash';

const urlOrder = [
  'kuski',
  'battleType',
  'durMin',
  'durMax',
  'startDate',
  'endDate',
  'cripple',
  'page',
  'pageSize',
  'sort',
];

const tr = s => (s || '').trim();

const formatDateArr = (arr, nextDay, dayEnd, dateFormat = 'yyyy-MM-dd') => {
  if (Array.isArray(arr)) {
    let date = new Date(arr[0], arr[1] - 1, arr[2]);

    if (nextDay) {
      date = addDays(date, 1);
    }

    if (dayEnd) {
      date = endOfDay(date);
    }

    return format(date, dateFormat);
  }
  return null;
};

// input is user text field values.
const parseDateStrings = (start, end) => {
  const [startDateArr, endDateArr] = parseDateRange(
    getTypeAndDate(start),
    getTypeAndDate(end),
  );

  return [
    // errors (invalid start or end date format)
    tr(start) && startDateArr === null,
    tr(end) && endDateArr === null,
    // format to send to api (it requires exact format)
    formatDateArr(startDateArr, false, false, 'yyyy-MM-dd HH:mm:ss'),
    formatDateArr(endDateArr, false, true, 'yyyy-MM-dd HH:mm:ss'),
  ];
};

const BattleListTableMemo = React.memo(BattleListTable, isEqual);

// query is raw user input from URL.
// builds function args for api/BattleSearch
const buildArgs = query => {
  const [
    // eslint-disable-next-line no-unused-vars
    startDateError,
    // eslint-disable-next-line no-unused-vars
    endDateError,
    startDateApiFormat,
    endDateApiFormat,
  ] = parseDateStrings(query.startDate, query.endDate);

  return {
    Kuski: query.kuski || undefined,
    BattleType: query.battleType || undefined,
    Cripple: query.cripple || undefined,
    DurationMin: query.durMin || undefined,
    DurationMax: query.durMax || undefined,
    StartedMin: startDateApiFormat || undefined,
    StartedMax: endDateApiFormat || undefined,
    page: (query.page || 1) - 1,
    pageSize: query.pageSize || 25,
    sort: query.sort === 'asc' ? 'ASC' : 'DESC',
  };
};

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = location.search;

  const [kuski, setKuski] = useState('');
  // cripple selector turned off for now (server doesn't support it yet).
  const [cripples, setCripples] = useState([]);
  const [battleType, setBattleType] = useState('');
  // we'll consider a duration of 61 to mean above 60. (battles above 60 min may eventually be possible).
  const [duration, setDuration] = useState([0, 61]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // for stateful inputs (those in the form with submit button)
  useEffect(() => {
    setKuski(query.kuski || '');
    setCripples((query.cripple || '').split(','));
    setBattleType(query.battleType || '');
    setDuration([
      forceInt(query.durMin, 0, 0, 60),
      forceInt(query.durMax, 61, 0, 61),
    ]);
    setStartDate(query.startDate || '');
    setEndDate(query.endDate || '');
  }, [
    query.kuski,
    query.battleType,
    query.cripple,
    query.durMin,
    query.durMax,
    query.startDate,
    query.endDate,
  ]);

  // these only live in the URL
  const page = forceInt(query.page, 1, 1) - 1;
  const pageSize = forceInt(query.pageSize, 25, 0);
  const sort = query.sort === 'asc' ? 'asc' : 'desc';

  const args = useMemo(() => {
    return buildArgs(query);
  }, [
    query.kuski,
    query.battleType,
    query.cripple,
    query.durMin,
    query.durMax,
    query.startDate,
    query.endDate,
    query.page,
    query.pageSize,
    query.sort,
  ]);

  // date errors, which change as the user types
  const [startDateError, endDateError] = useMemo(() => {
    return parseDateStrings(startDate, endDate);
  }, [startDate, endDate]);

  const { isLoading, data } = useQueryAlt(
    ['BattleSearch', ...getOrderedValues(args)],
    async () => BattlesSearch(args),
  );

  const battles = data?.rows;
  // server may omit countAll for some queries
  let countAll = data?.count;

  if (countAll === null && Array.isArray(battles)) {
    if (battles.length < pageSize) {
      countAll = page * pageSize + battles.length;
    }
  }

  const setUrl = (_page, _pageSize, _sort) => {
    const query = queryString.stringify(
      {
        kuski: kuski
          .trim()
          .split(',')
          .map(k => k.trim())
          .filter(Boolean),
        cripple: cripples,
        battleType,
        durMin: duration[0] <= 1 ? '' : duration[0],
        durMax: duration[1] > 60 ? '' : duration[1],
        startDate: (startDate || '').trim(),
        endDate: (endDate || '').trim(),
        page: _page && _page > -1 ? _page + 1 : undefined,
        pageSize: _pageSize === 25 ? undefined : _pageSize,
        sort: _sort === 'asc' ? 'asc' : undefined,
      },
      {
        arrayFormat: 'comma',
        skipEmptyString: true,
        sort: (a, b) => urlOrder.indexOf(a) - urlOrder.indexOf(b),
      },
    );

    navigate({ to: '/battles/search?' + query });
  };

  // const crippleOpts = [['', 'None']].concat(getCripples()[0]);
  const battleTypeOpts = [['', 'Any']].concat(getBattleTypes()[0]);

  return (
    <Root>
      <Container>
        <Paper>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Header h3>Instructions</Header>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <div>
                  Enter one or more kuskis separated by a comma (case
                  insensitive).
                </div>
                <div>
                  Enter date(s) in one of these formats: YYYY-MM-DD, YYYY-MM,
                  YYYY.
                </div>
                <div>
                  You can omit one of the date fields to search before/after a
                  date.
                </div>
                <div>
                  Start and end dates are inclusive. A start date of 2015 is
                  effectively 2015-01-01, whereas an end date of 2015 is
                  effectively 2015-12-31.
                </div>
                <div>
                  To see all battles in a year, enter the same year in both
                  input fields.
                </div>
                <div>
                  Dates displayed in the table are local time, but filtering by
                  date uses server time.
                </div>
                <div>
                  Click the "Search" tab at the top of the page to clear the
                  filters.
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Container>
      <Container>
        <Paper>
          <FormWrapper>
            <form
              onSubmit={e => {
                e.preventDefault();
                setUrl(0, pageSize, sort);
              }}
            >
              <Fields>
                <Field>
                  <TextField
                    name="Kuski(s)"
                    value={kuski}
                    onChange={v => setKuski(v)}
                  />
                </Field>
                <Field>
                  <Dropdown
                    name="Battle Type"
                    options={battleTypeOpts}
                    update={setBattleType}
                    selected={battleType}
                  />
                </Field>
                <Field>
                  <div>
                    Duration ({duration[0]} -{' '}
                    {duration[1] > 60 ? '60+' : duration[1]} minutes)
                  </div>
                  <Slider
                    min={0}
                    max={61}
                    step={1}
                    value={duration}
                    onChange={(e, v) => setDuration(v)}
                    valueLabelDisplay="auto"
                  />
                </Field>
                <Field>
                  <TextField
                    name="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                  />
                </Field>
                <Field>
                  <TextField
                    name="End Date"
                    value={endDate}
                    onChange={setEndDate}
                  />
                </Field>
                <SubmitButton
                  variant="contained"
                  type="submit"
                  onClick={e => {
                    e.preventDefault();
                    setUrl(0, pageSize, sort);
                  }}
                >
                  Submit
                </SubmitButton>
              </Fields>
            </form>
            <div>
              {(startDateError || endDateError) && (
                <ErrColor>
                  Date field(s) should use one of these formats: YYYY, YYYY-MM,
                  or YYYY-MM-DD.
                </ErrColor>
              )}
            </div>
          </FormWrapper>
        </Paper>
      </Container>
      <TableContainer>
        <Paper>
          <SortPagination>
            <table>
              <tbody>
                <tr>
                  <TablePagination
                    count={
                      countAll === null || countAll === undefined
                        ? -1
                        : countAll
                    }
                    rowsPerPageOptions={[25, 50, 100, 200]}
                    rowsPerPage={pageSize}
                    page={page}
                    onPageChange={(e, value) => setUrl(value, pageSize, sort)}
                    onRowsPerPageChange={e => setUrl(0, e.target.value, sort)}
                  />
                  <td>
                    <Switch
                      checked={sort === 'desc'}
                      onChange={val =>
                        setUrl(page, pageSize, val ? 'desc' : 'asc')
                      }
                    >
                      Recent Battles First
                    </Switch>
                  </td>
                </tr>
              </tbody>
            </table>
          </SortPagination>

          {isLoading && (
            <div>
              <Loading />
              <br />
            </div>
          )}
          <BattleListTableMemo
            battles={Array.isArray(battles) ? battles : []}
            condensed={false}
            startedFormat="MMM d, y HH:mm"
            wideStartedCol={true}
          />
        </Paper>
      </TableContainer>
      <br />
    </Root>
  );
};

const Root = styled.div`
  background: ${p => p.theme.pageBackground};
`;

const Container = styled.div`
  padding: 0 20px;
  margin: 8px 0;
`;

const TableContainer = styled(Container)`
  min-width: 800px;
`;

const FormWrapper = styled.div`
  padding: 4px 15px 12px 15px;
`;

const Fields = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  margin-left: -10px;
`;

const Field = styled.div`
  width: 260px;
  margin-top: 10px;
  margin-bottom: 10px;
  .MuiFormControl-marginNormal {
    margin: 0;
  }
  &:nth-child(1) {
    width: 280px;
  }
  &:nth-child(2) {
    width: 200px;
    margin-right: 14px;
    padding-bottom: 12px;
  }
  &:nth-child(3) {
    width: 210px;
    padding-top: 15px;
    margin-right: 10px;
  }
  &:nth-child(4),
  &:nth-child(5) {
    width: 190px;
  }
`;

const SortPagination = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  padding-top: 3px;
  min-width: 473px;
  > * {
    padding-right: 10px;
  }
  td {
    padding: 0;
  }
  @media screen and (max-width: 900px) {
    justify-content: flex-start;
  }
`;

const SubmitButton = styled(Button)`
  height: 55px;
  width: 125px;
  margin-left: 7px !important;
`;

const ErrColor = styled.div`
  color: ${p => p.theme.errorColor};
`;

export default Search;
