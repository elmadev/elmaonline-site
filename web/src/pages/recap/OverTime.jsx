import React, { useEffect } from 'react';
import { Section, HeadlineNick, RecapHeadline, Img, Text } from './';
import { nick, nickId } from 'utils/nick';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Loading from 'components/Loading';
import { groupBy, map } from 'lodash-es';
import { ChartLine } from 'components/Chart';

import graphs from 'images/recap/graphs.jpg';

const hourFraction = value => {
  return parseInt(value / 60);
};

const int = value => {
  if (!value) {
    return 0;
  }
  return parseInt(value);
};

const hours = t => {
  if (!t) {
    return 0;
  }
  return Math.round(t / (100 * 60 * 60));
};

const number = (...args) => {
  let value = 0;
  for (var i = 0; i < args.length; i++) {
    if (!isNaN(parseInt(args[i]))) {
      value += parseInt(args[i]);
    }
  }
  return value.toLocaleString();
};

const convertToChartDataSet = (data, types, formatFunc) => {
  const grouped = groupBy(data, 'Year');
  const chartData = map(grouped, (values, key) => {
    const result = { name: parseInt(key, 10) };
    values.forEach(item => {
      result[types[item.Type]] = formatFunc(item.Value);
      if (item.OtherIndex) {
        result.OtherIndex = item.OtherIndex;
      }
    });
    return result;
  });
  return chartData;
};

const filterAndFormatForChart = (data, fields, formatFunc) => {
  return convertToChartDataSet(
    data.data.filter(d => fields.includes(data.types[d.Type])),
    data.types,
    formatFunc,
  );
};

const charts = [
  {
    type: 'line',
    fields: ['AmountBattles', 'Normal'],
    name: 'Battles started',
    func: int,
  },
  {
    type: 'line',
    fields: [
      'FirstFinish',
      'Apple',
      'OneLife',
      'HiddenTimes',
      'FlagTag',
      'FinishCount',
    ],
    name: 'Popular battle types started',
    func: int,
  },
  {
    type: 'line',
    fields: [
      'Slowness',
      'LastCounts',
      'Speed',
      'Multi',
      'NoTurn',
      'OneTurn',
      'NoBrake',
      'NoThrottle',
      'AlwaysThrottle',
      'OneWheel',
    ],
    name: 'Other battle types started',
    func: int,
  },
  {
    type: 'line',
    fields: ['TotalDuration', 'TotalCountdown'],
    names: ['Total duration (hours)', 'Total countdown (mins)'],
    name: 'Total battle duration',
    func: hourFraction,
  },
  {
    type: 'line',
    fields: ['AverageDuration'],
    names: ['Average duration (mins)'],
    name: 'Average battle duration',
    func: number,
  },
  {
    type: 'line',
    fields: ['UniqueDesigners'],
    name: 'Level designers',
    func: int,
    isOverall: true,
  },
  {
    type: 'line',
    fields: ['UniqueLevelNames', 'LevelsAdded'],
    name: 'Level added',
    func: int,
  },
  {
    type: 'line',
    fields: ['TotalApples', 'TotalKillers', 'TotalFlowers'],
    name: 'Level objects',
    func: int,
  },
  {
    type: 'line',
    fields: ['ChatLines'],
    name: 'Chat lines',
    func: int,
  },
  {
    type: 'line',
    fields: ['KuskisChatted'],
    name: 'Chatters',
    func: int,
    isOverall: true,
  },
  {
    type: 'line',
    fields: ['AverageChatLength'],
    name: 'Average chat length',
    func: int,
  },
  {
    type: 'line',
    fields: ['ChatLev10s', 'ChatRec10s', 'ChatLols'],
    name: '10s and lols',
    func: int,
  },
  {
    type: 'line',
    fields: ['DrunkRuns'],
    name: 'Drunk runs',
    func: int,
  },
  {
    type: 'line',
    fields: ['OneWheelRuns'],
    name: 'One wheel runs',
    func: int,
  },
  {
    type: 'line',
    fields: ['Apples'],
    name: 'Apples taken',
    func: int,
  },
  {
    type: 'line',
    fields: ['Runs', 'BattleRuns', 'NonBattleRuns'],
    name: 'Total runs',
    func: int,
  },
  {
    type: 'line',
    fields: ['FinishedRuns'],
    name: 'Total finished runs',
    func: int,
  },
  {
    type: 'line',
    fields: ['DiedRuns', 'FinishedRuns', 'EscapedRuns', 'SpiedRuns'],
    name: 'Runs completion',
    names: ['Died', 'Finished', 'Escaped', 'F1 Spied'],
    func: int,
  },
  {
    type: 'line',
    fields: ['LeftVolts', 'RightVolts', 'SuperVolts', 'Turns'],
    name: 'Volts and Turns',
    func: int,
  },
  {
    type: 'line',
    fields: ['MaxSpeed'],
    name: 'Max speed',
    func: int,
  },
  {
    type: 'line',
    fields: ['TimePlayed', 'TimePlayedBattles'],
    name: 'Hours played',
    func: hours,
  },
  {
    type: 'line',
    fields: ['ThrottleTime', 'BrakeTime'],
    name: 'Throttle and brake time',
    func: hours,
  },
  {
    type: 'line',
    fields: ['LevelsPlayed'],
    name: 'Levels played',
    func: int,
  },
  {
    type: 'line',
    fields: ['BattlesPlayed', 'PlayedNormal'],
    name: 'Battles played',
    func: int,
    isPersonal: true,
  },
  {
    type: 'line',
    fields: [
      'PlayedFirstFinish',
      'PlayedOneLife',
      'PlayedSlowness',
      'PlayedSurvivor',
      'PlayedLastCounts',
      'PlayedFlagTag',
      'PlayedApple',
      'PlayedSpeed',
      'PlayedFinishCount',
      'Played1HourTT',
    ],
    name: 'Battle types played',
    func: int,
    isPersonal: true,
  },
  {
    type: 'line',
    fields: ['RankingEarned'],
    name: 'Ranking earned',
    func: int,
    isPersonal: true,
  },
  {
    type: 'line',
    fields: ['UniquePlayers', 'Players'],
    name: 'Your battles',
    func: int,
    isPersonal: true,
  },
  {
    type: 'line',
    fields: ['UniquePlayedDesigners'],
    name: 'Played battle designers',
    func: int,
    isPersonal: true,
  },
  {
    type: 'line',
    fields: ['AveragePlayedDuration'],
    name: 'Played battle duration',
    func: int,
    isPersonal: true,
  },
];

const OverTime = ({ tab }) => {
  const {
    playerAll: { data: playerData, loading: playerLoading },
    overallAll: { data: overallData, loading: overallLoading },
  } = useStoreState(state => state.Recap);
  const {
    playerAll: { fetch },
    overallAll: { fetch: overallFetch },
  } = useStoreActions(actions => actions.Recap);

  useEffect(() => {
    fetch(nickId());
    overallFetch();
  }, []);

  const data = tab === 3 ? overallData : playerData;

  if (playerLoading || overallLoading || !data) return <Loading />;

  return (
    <>
      <Section bg="white">
        <HeadlineNick>{tab === 3 ? 'OVERALL' : nick()}</HeadlineNick>
        <RecapHeadline>eol recap all time</RecapHeadline>
        <Img opacity src={graphs} alt="seasons" />
      </Section>
      {charts.map(
        ({ type, fields, names, name, isOverall, isPersonal, func }) => {
          if (isOverall && tab === 4) {
            return null;
          }
          if (isPersonal && tab === 3) {
            return null;
          }
          return (
            <Section key={name}>
              <Text white>{name}</Text>
              {type === 'line' ? (
                <ChartLine
                  data={filterAndFormatForChart(data, fields, func)}
                  keys={fields}
                  names={names}
                />
              ) : null}
            </Section>
          );
        },
      )}
    </>
  );
};

export default OverTime;
