import React, { useState, useEffect } from 'react';
import { parse, format, startOfDay, addDays, subDays } from 'date-fns';
import styled from '@emotion/styled';
import Loading from 'components/Loading';
import BattleList from 'features/BattleList';
import { useNavigate, useLocation } from '@tanstack/react-router';

const ByDate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { date } = location.search;

  const [start, setStart] = useState();
  const [end, setEnd] = useState();

  const parseDate = d =>
    d ? startOfDay(parse(d, 'yyyy-MM-dd', new Date())) : startOfDay(new Date());

  useEffect(() => {
    const parsedDate = parseDate(date);
    setStart(parsedDate);
    setEnd(addDays(parsedDate, 1));
  }, [date]);

  const next = () => {
    navigate({
      to: `/battles?date=${format(addDays(start, 1), 'yyyy-MM-dd')}`,
    });
  };

  const previous = () => {
    navigate({
      to: `/battles?date=${format(subDays(start, 1), 'yyyy-MM-dd')}`,
    });
  };

  return (
    <>
      {!start || !end ? (
        <Loading />
      ) : (
        <Container>
          <Datepicker style={{ paddingTop: 10, paddingBottom: 10 }}>
            <button onClick={previous} type="button">
              &lt;
            </button>
            <SelectedDate>{format(start, 'eee, dd.MM.yyyy')}</SelectedDate>
            <button onClick={next} type="button">
              &gt;
            </button>
          </Datepicker>
          <BattleList start={start} end={end} />
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  background: ${p => p.theme.paperBackground};
  min-height: 100%;
  box-sizing: border-box;
  font-size: 14px;
`;

const Datepicker = styled.div`
  background: ${p => p.theme.pageBackground};
  font-weight: 500;
  font-size: 16px;
  button {
    color: ${p => p.theme.fontColor};
    padding: 15px 10px;
    border: 0;
    background: transparent;
    cursor: pointer;
    outline: 0;
    width: 50px;
    text-align: center;
  }
`;

const SelectedDate = styled.span`
  display: inline-block;
  width: 120px;
  text-align: center;
`;

export default ByDate;
