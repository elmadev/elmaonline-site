import React, { useState, useEffect, useRef } from 'react';
import Layout from 'components/Layout';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { nick, nickId } from 'utils/nick';
import Loading from 'components/Loading';
import { Tabs, Tab } from '@material-ui/core';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { ChartPie, ChartCon } from 'components/Chart';
import { Dropdown } from 'components/Inputs';
import Stepper from 'components/Stepper';
import Awards from './Awards';
import OverTime from './OverTime';
import CrippledBattles from './CrippledBattles';

import playing from 'images/recap/playing.jpg';
import wheelie from 'images/recap/wheelie.jpg';
import apples from 'images/recap/apples.jpg';
import speed from 'images/recap/speed.jpg';
import drunk from 'images/recap/drunk.png';
import chat from 'images/recap/chat.jpg';
import flowers from 'images/recap/flowers.jpg';
import flag from 'images/recap/flag.jpg';
import designer from 'images/recap/designer.jpg';
import designed from 'images/recap/designed.jpg';
import seasons from 'images/recap/seasons.jpg';

export const hours = t => {
  if (!t) {
    return 0;
  }
  return (t / (100 * 60 * 60)).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
};

export const percent = (value, of) => {
  if (!value || !of) {
    return 0;
  }
  return `${((value * 100) / of).toFixed(0)}%`;
};

export const number = (...args) => {
  let value = 0;
  for (var i = 0; i < args.length; i++) {
    if (!isNaN(parseInt(args[i]))) {
      value += parseInt(args[i]);
    }
  }
  return value.toLocaleString();
};

export const int = value => {
  if (!value) {
    return 0;
  }
  return parseInt(value);
};

const Recap = () => {
  const [tab, setTab] = useState(nickId() === 0 ? 1 : 0);
  const [year, setYear] = useState('2025');
  const container = useRef();
  const {
    player: { data: playerData, loading: playerLoading },
    overall: { data: overallData, loading: overallLoading },
  } = useStoreState(state => state.Recap);
  const {
    player: { fetch },
    overall: { fetch: overallFetch },
  } = useStoreActions(actions => actions.Recap);

  useEffect(() => {
    fetch({ user: nickId(), year });
    overallFetch(year);
  }, [year]);

  const pronoun = tab ? 'We' : 'You';
  const pronounLower = tab ? 'we' : 'you';

  const data = {};
  if (tab === 1 && overallData?.data) {
    overallData.data.forEach(stat => {
      const name = overallData.types[stat.Type];
      data[name] = stat.Value;
    });
  }
  if (tab === 0 && playerData?.data) {
    playerData.data.forEach(stat => {
      const name = playerData.types[stat.Type];
      data[name] = stat.Value;
    });
  }

  const ranking = playerData?.ranking;

  const voltChart = [
    { name: 'Left Volts', value: int(data.LeftVolts) },
    { name: 'Right Volts', value: int(data.RightVolts) },
    { name: 'Alovolts', value: int(data.SuperVolts) },
  ];

  const FinishedChart = [
    { name: 'Died', value: int(data.DiedRuns) },
    { name: 'Finished', value: int(data.FinishedRuns) },
    { name: 'Escaped', value: int(data.EscapedRuns) },
    { name: 'F1 Spied', value: int(data.SpiedRuns) },
  ];

  const runsChart = [
    { name: 'Battle runs', value: int(data.BattleRuns) },
    { name: 'Other runs', value: int(data.NonBattleRuns) },
  ];

  const chatChart = [
    { name: '!rec 10', value: int(data.ChatRec10s) },
    { name: '!lev 10', value: int(data.ChatLev10s) },
    { name: 'lol', value: int(data.ChatLols) },
  ];

  const battlesChart = [
    { name: 'Normal', value: int(data.PlayedNormal) },
    { name: 'First Finish', value: int(data.PlayedFirstFinish) },
    { name: 'One Life', value: int(data.PlayedOneLife) },
    { name: 'Slowness', value: int(data.PlayedSlowness) },
    { name: 'Survivor', value: int(data.PlayedSurvivor) },
    { name: 'Last Counts', value: int(data.PlayedLastCounts) },
    { name: 'Flag Tag', value: int(data.PlayedFlagTag) },
    { name: 'Apple', value: int(data.PlayedApple) },
    { name: 'Speed', value: int(data.PlayedSpeed) },
    { name: 'Finish Count', value: int(data.PlayedFinishCount) },
    { name: '1 Hour TT', value: int(data.Played1HourTT) },
  ];

  const designedChart = [
    { name: 'Normal', value: int(data.Normal) },
    { name: 'First Finish', value: int(data.FirstFinish) },
    { name: 'One Life', value: int(data.OneLife) },
    { name: 'Slowness', value: int(data.Slowness) },
    { name: 'Last Counts', value: int(data.LastCounts) },
    { name: 'Flag Tag', value: int(data.FlagTag) },
    { name: 'Apple', value: int(data.Apple) },
    { name: 'Speed', value: int(data.Speed) },
    { name: 'Finish Count', value: int(data.FinishCount) },
  ];

  const label = ({ name, value, percent }) => {
    return `${value.toLocaleString()} ${name} (${(percent * 100).toFixed(0)}%)`;
  };

  const over20players = overallData?.data
    ? overallData.data.filter(d => d.Type === 77 && parseInt(d.Value) > 19)
    : [];

  const avgVotes = overallData?.data
    ? overallData.data.filter(d => d.Type === 78)
    : [];
  const average = avgVotes
    ? avgVotes.reduce((total, next) => total + int(next.Value), 0) /
      avgVotes.length
    : 0;
  const oneVotes = overallData?.data
    ? overallData.data.filter(d => d.Type === 80)
    : [];
  const tenVotes = overallData?.data
    ? overallData.data.filter(d => d.Type === 81)
    : [];

  const onStep = index => {
    if (container?.current) {
      const el = container.current.children[index];
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 53;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const steps = [
    'To top',
    'Play time',
    'Volts',
    'Max speed',
    'Runs',
    'Drunk',
    'Chat',
    'Levels',
  ];

  if (tab === 0) {
    steps.push('Battles');
    steps.push('Battles played');
    steps.push('Battles started');
    if (data.AmountBattles > 0) {
      steps.push('Battle types');
    }
  }
  if (tab === 1) {
    steps.push('Battles started');
    steps.push('Battle types');
    steps.push('Replays');
  }

  const loading = playerLoading || overallLoading;

  return (
    <Layout edge>
      <Header>
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={tab}
          onChange={(e, value) => {
            setTab(value);
          }}
        >
          {nickId() !== 0 ? <Tab label="Personal" value={0} /> : null}
          <Tab label="Overall" value={1} />
          <Tab label="Best of" value={2} />
          <Tab label="All time (overall)" value={3} />
          <Tab label="All time (personal)" value={4} />
        </Tabs>
        {[3, 4].indexOf(tab) === -1 ? (
          <Dropdown
            name="Year"
            selected={year}
            update={y => setYear(y)}
            options={[
              '2010',
              '2011',
              '2012',
              '2013',
              '2014',
              '2015',
              '2016',
              '2017',
              '2018',
              '2019',
              '2020',
              '2021',
              '2022',
              '2023',
              '2024',
              '2025',
            ]}
          />
        ) : null}
      </Header>
      {loading ? <Loading /> : null}
      {(tab === 0 || tab === 1) && (
        <StepCon>
          <Stepper
            steps={steps}
            orientation="vertical"
            hideable
            onClick={index => onStep(index)}
          />
        </StepCon>
      )}
      {tab === 2 && !loading ? (
        <Awards overall={overallData} year={year} />
      ) : null}
      {tab === 3 && !loading ? <OverTime tab={tab} /> : null}
      {tab === 4 && !loading ? <OverTime tab={tab} /> : null}
      {(tab === 0 || tab === 1) && !loading && (
        <Sections ref={container}>
          <Section bg="white">
            <HeadlineNick>{tab ? 'OVERALL' : nick()}</HeadlineNick>
            <RecapHeadline>{year} eol recap</RecapHeadline>
            <Img opacity src={seasons} alt="seasons" />
          </Section>
          <Section bg="black">
            <Text right white>
              {pronoun} played EOL <V>{hours(data.TimePlayed)}</V> hours this
              year
            </Text>
            <TextSmall right white>
              <V>{hours(data.TimePlayedBattles)}</V> of these during battles
            </TextSmall>
            <TextSmall top white>
              of the <V>{hours(data.TimePlayed)}</V> hours played {pronounLower}{' '}
              spent <V>{percent(data.ThrottleTime, data.TimePlayed)}</V> of them
              throttling and <V>{percent(data.BrakeTime, data.TimePlayed)}</V>{' '}
              braking
            </TextSmall>
            <Text left top white>
              <V>{number(data.LevelsPlayed)}</V> different levels played
              throughout the year
            </Text>
            <ImgRight src={playing} alt="playing" />
          </Section>
          <Section bg="white">
            <Text top>
              {pronoun} did a total of{' '}
              <V>{number(data.LeftVolts, data.RightVolts, data.SuperVolts)}</V>{' '}
              volts
            </Text>
            <ChartPie data={voltChart} label={label} />
            <ImgLeft src={wheelie} alt="wheelie" />
          </Section>
          <Section bg="#010b15">
            <Text white right>
              Max speed reached was{' '}
              <V>
                {(int(data.MaxSpeed) / 100).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </V>
            </Text>
            <Text top white right>
              {pronoun} turned the bike a total of <V>{number(data.Turns)}</V>{' '}
              times
            </Text>
            <ImgRight src={speed} alt="speed" />
          </Section>
          <Section bg="white">
            <Text>
              {pronoun} took an average of{' '}
              {!data.Runs || !data.Apples ? (
                <V>0 </V>
              ) : (
                <>
                  <V>
                    {(int(data.Runs) / int(data.Apples)).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 3 },
                    )}
                  </V>{' '}
                </>
              )}
              apples per run
            </Text>
            <TextSmall>
              for a total of <V>{number(data.Apples)}</V> apples taken
            </TextSmall>
            <Text left top>
              {pronoun} started a level a total of <V>{number(data.Runs)}</V>{' '}
              times this year
            </Text>
            <TextSmall left>
              out of which <V>{number(data.FinishedRuns)}</V> attempts was
              finished
            </TextSmall>
            <ChartPie data={FinishedChart} label={label} />
            <ChartPie data={runsChart} label={label} />
            <ImgLeft src={apples} alt="apples" />
          </Section>
          <Section noPad bg="black">
            <Text white>
              {pronoun} started <V>{number(data.DrunkRuns)}</V> drunk runs and{' '}
              <V>{number(data.OneWheelRuns)}</V> one wheel runs
            </Text>
            <ImgRight src={drunk} alt="drunk" />
          </Section>
          <Section bg="white">
            {tab === 0 ? (
              <Text left>
                {pronoun} had something to say a total of{' '}
                <V>{number(data.ChatLines)}</V> times this year
              </Text>
            ) : null}
            {tab === 1 ? (
              <Text left>
                <V>{number(data.KuskisChatted)}</V> different players wrote a
                total of <V>{number(data.ChatLines)}</V> chat lines combined
              </Text>
            ) : null}
            <TextSmall>
              these chat lines had an average length of{' '}
              <V>{number(data.AverageChatLength)}</V> letters for a total{' '}
              <V>{number(data.ChatLines * data.AverageChatLength)}</V> letters
              written
            </TextSmall>
            {data.ChatLev10s || data.ChatRec10s || data.ChatLols ? (
              <>
                <TextSmall top>
                  Amount of times {pronounLower} rated 10 and wrote LOL:
                </TextSmall>
                <ChartCon>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={chatChart}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCon>
              </>
            ) : null}
            <ImgLeft src={chat} alt="chat" />
          </Section>
          <Section bg="#91d4da">
            {tab === 0 ? (
              <Text white right>
                {pronoun} added <V>{number(data.UniqueLevelNames)}</V> new
                levels to the database
              </Text>
            ) : null}
            {tab === 1 ? (
              <Text white right>
                <V>{number(data.UniqueDesigners)}</V> designers added a total of{' '}
                <V>{number(data.UniqueLevelNames)}</V> new levels to the
                database
              </Text>
            ) : null}
            {number(data.UniqueLevelNames) < number(data.LevelsAdded) ? (
              <TextSmall white right>
                however {pronounLower} also added another{' '}
                <V>
                  {number(
                    parseInt(data.LevelsAdded) -
                      parseInt(data.UniqueLevelNames),
                  )}
                </V>{' '}
                levels with duplicate names
              </TextSmall>
            ) : null}
            <Text white top>
              These levels included a total of <V>{number(data.TotalApples)}</V>{' '}
              apples, <V>{number(data.TotalKillers)}</V> killers and{' '}
              <V>{number(data.TotalFlowers)}</V> flowers
            </Text>
            <ImgRight src={flowers} alt="flowers" />
          </Section>
          {tab === 0 ? (
            <Section bg="#00121c">
              <Text white left>
                {pronoun} played <V>{number(data.BattlesPlayed)}</V> battles
                this year
              </Text>
              {number(data.RankingEarned) > 0 ? (
                <TextSmall white left>
                  and earned <V>{number(data.RankingEarned)}</V> ranking points
                  \o/
                </TextSmall>
              ) : null}
              {number(data.RankingEarned) < 0 ? (
                <TextSmall white left>
                  and lost{' '}
                  <V>{number(Math.abs(parseInt(data.RankingEarned)))}</V>{' '}
                  ranking points :&#40;
                </TextSmall>
              ) : null}
              <ChartPie
                data={battlesChart.filter(c => c.value !== 0)}
                label={label}
                light
              />
              <Text white>
                <V>{number(ranking ? ranking.Wins : 0)}</V> battle wins in the{' '}
                <V>{number(ranking ? ranking.Played5 : 0)}</V> battles with at
                least five participants
              </Text>
              {ranking ? (
                <TextSmall white>
                  that's a{' '}
                  <V>
                    {((ranking.Wins * 100) / ranking.Played5).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 2 },
                    )}
                  </V>
                  % win rate
                </TextSmall>
              ) : null}
              <ImgRight top src={flag} alt="flag" />
            </Section>
          ) : null}
          {tab === 0 ? (
            <Section bg="white">
              <Text right>
                {pronoun} played battles by{' '}
                <V>{number(data.UniquePlayedDesigners)}</V> different designers
              </Text>
              <Text top>
                Average length of battles participated in was{' '}
                <V>{number(data.AveragePlayedDuration)}</V> minutes
              </Text>
              <ImgLeft src={designer} alt="designer" />
            </Section>
          ) : null}
          <Section bg="white">
            <Text left>
              {pronoun} started <V>{number(data.AmountBattles)}</V> battles
            </Text>
            {data.AmountBattles > 0 ? (
              <>
                <TextSmall top>
                  these had a combined duration of{' '}
                  <V>
                    {(parseInt(data.TotalDuration) / 60).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 2 },
                    )}
                  </V>{' '}
                  hours plus{' '}
                  <V>
                    {(parseInt(data.TotalCountdown) / 60).toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 2,
                      },
                    )}
                  </V>{' '}
                  minutes of countdown
                </TextSmall>
                <TextSmall top right>
                  average duration was <V>{number(data.AverageDuration)}</V>{' '}
                  minutes
                </TextSmall>
                {tab === 0 ? (
                  <Text top left>
                    <V>{number(data.UniquePlayers)}</V> different players played
                    your battles for a total of <V>{number(data.Players)}</V>{' '}
                    participants in your <V>{number(data.AmountBattles)}</V>{' '}
                    battles
                  </Text>
                ) : null}
              </>
            ) : null}
            {tab === 1 ? (
              <Text top>
                <V>{number(over20players.length)}</V> battles had 20 or more
                players
              </Text>
            ) : null}
            <ImgRight src={designed} alt="designed" />
          </Section>
          {data.AmountBattles > 0 ? (
            <Section bg="black">
              <Text white>Battle types started</Text>
              <ChartPie data={designedChart} label={label} light />
              <CrippledBattles data={data} />
            </Section>
          ) : null}
          {tab === 1 ? (
            <Section bg="white">
              <Text>
                Average replay rating was{' '}
                {!average ? (
                  <V>0</V>
                ) : (
                  <V>
                    {average.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </V>
                )}
              </Text>
              <TextSmall>
                for the <V>{avgVotes.length}</V> replays with more than 1 vote
              </TextSmall>
              <Text top>
                This included <V>{oneVotes.length}</V> one star votes and{' '}
                <V>{tenVotes.length}</V> ten star votes
              </Text>
            </Section>
          ) : null}
          <Section>
            <div>
              <a href="https://www.freepik.com/">Vectors by Freepik</a>
            </div>
            <div>
              <a href="https://www.vecteezy.com/">Vectors by Vecteezy</a>
            </div>
          </Section>
        </Sections>
      )}
    </Layout>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

export const StepCon = styled.div`
  position: fixed;
  top: 80px;
  right: 26px;
  z-index: 20;
  border: 1px dashed black;
  background-color: ${p => p.theme.paperBackground};
`;

const Sections = styled.div``;

const V = styled.span`
  color: #4f8ec9;
`;

export const Text = styled.div`
  color: ${p => (p.white ? 'white' : 'black')};
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  z-index: 1;
  -webkit-text-stroke: 1px black;
  ${p => p.right && 'margin-left: 10%;'}
  ${p => p.left && 'margin-right: 10%;'}
  ${p => p.top && 'margin-top: 60px;'}
`;

export const TextSmall = styled(Text)`
  font-size: 28px;
`;

export const Img = styled.img`
  height: 500px;
  position: absolute;
  z-index: 0;
  margin-top: auto;
  margin-bottom: auto;
  max-width: 100%;
  object-fit: cover;
  ${p => p.top && 'top: 0;'}
  ${p => p.bottom && 'bottom: 0;'}
  ${p => p.opacity && 'opacity: 0.8;'}
`;

const ImgRight = styled(Img)`
  right: 0;
`;

const ImgLeft = styled(Img)`
  left: 0;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(100% - 20px);
  background-color: ${p => (p.bg ? p.bg : 'transparent')};
  position: relative;
  min-height: 400px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 50px;
  padding-bottom: 50px;
`;

export const RecapHeadline = styled.div`
  margin: ${p => p.theme.padSmall};
  margin-bottom: ${p => p.theme.padMedium};
  color: #4f8ec9;
  font-weight: 700;
  font-size: 82px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  transform: rotate(6deg);
  width: 99%;
  margin-bottom: 50px;
  z-index: 10;
  -webkit-text-stroke: 2px white;
`;

export const HeadlineNick = styled(RecapHeadline)`
  margin: 0;
  margin-top: 50px;
  text-transform: none;
  transform: rotate(4deg);
`;

export default Recap;
