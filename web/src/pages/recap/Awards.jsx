import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import pedestal from 'images/recap/pedestal-long.jpg';
import tracks from 'images/recap/tracks.jpg';
import { Row, Column } from 'components/Containers';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import Link from 'components/Link';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Loading from 'components/Loading';
import Stepper from 'components/Stepper';
import { Text, StepCon } from './index';

const Name = ({ award, index }) => {
  let val = '';
  if (award.type === 'kuski') {
    val = award.data[index].KuskiData?.Kuski || '';
  }
  if (award.type === 'battle') {
    const level = award.data[index].BattleData?.RecFileName || '';
    val = level.split('_')[0];
  }
  if (award.type === 'replay') {
    val = award.data[index].ReplayData?.RecFileName || '';
  }
  if (award.data[index].Link) {
    return <Link to={award.data[index].Link}>{val}</Link>;
  }
  return <>{val}</>;
};

const Awards = ({ overall, year }) => {
  const [open, setOpen] = useState([]);
  const ref = useRef();
  const {
    bestof: { data, loading },
  } = useStoreState(state => state.Recap);
  const {
    bestof: { fetch },
  } = useStoreActions(actions => actions.Recap);

  useEffect(() => {
    if (!data) {
      fetch(year);
    }
  }, [year]);

  const isLoading = !overall || loading || !data;

  const wins = overall.ranking.sort((a, b) => b.Wins - a.Wins).slice(0, 10);
  const ratio = overall.ranking.sort((a, b) => b.Ratio - a.Ratio).slice(0, 10);
  const played = overall.ranking
    .sort((a, b) => b.Played - a.Played)
    .slice(0, 10);
  const designed = overall.ranking
    .sort((a, b) => b.Designed - a.Designed)
    .slice(0, 10);
  const ranking = overall.ranking
    .sort((a, b) => b.Ranking - a.Ranking)
    .slice(0, 10);
  const mostPlayed = overall.data
    .filter(d => d.Type === 77)
    .sort((a, b) => parseInt(b.Value) - parseInt(a.Value))
    .slice(0, 10)
    .map(m => ({
      ...m,
      Value: parseInt(m.Value),
      Link: `/battles/${m.BattleData?.BattleIndex || ''}`,
    }));
  const replay = overall.data
    .filter(d => d.Type === 81)
    .sort((a, b) => parseInt(b.Value) - parseInt(a.Value))
    .slice(0, 10)
    .map(m => ({
      ...m,
      Value: parseInt(m.Value),
      Link: `/r/${m.ReplayData?.UUID || ''}/${
        m.ReplayData?.RecFileName ? m.ReplayData.RecFileName.split('.')[0] : ''
      }`,
    }));

  const awards = [
    {
      title: 'Battle ranking',
      key: 'Ranking',
      unit: ' pts.',
      data: ranking,
      type: 'kuski',
      desc: 'Final ELO ranking for the year, all battle types.',
    },
    {
      title: 'Battle wins',
      key: 'Wins',
      unit: '',
      data: wins,
      type: 'kuski',
      desc: 'Amount of battles won, all battle types with at least five participants',
    },
    {
      title: 'Battle win ratio',
      key: 'Ratio',
      unit: '%',
      data: ratio,
      type: 'kuski',
      desc: 'Amount of battles won in relation to battles played for all types with at least five participants.',
    },
    {
      title: 'Battles played',
      key: 'Played',
      unit: '',
      data: played,
      type: 'kuski',
      desc: 'Total amount of battles played for all types.',
    },
    {
      title: 'First finish battles played',
      key: 'Value',
      unit: '',
      data: data?.FF,
      type: 'kuski',
      desc: 'Total amount of first finish battles played.',
    },
    {
      title: 'One life battles played',
      key: 'Value',
      unit: '',
      data: data?.OL,
      type: 'kuski',
      desc: 'Total amount of one life battles played.',
    },
    {
      title: 'Apples battles played',
      key: 'Value',
      unit: '',
      data: data?.Ap,
      type: 'kuski',
      desc: 'Total amount of apple battles played.',
    },
    {
      title: 'Battles started',
      key: 'Designed',
      unit: '',
      data: designed,
      type: 'kuski',
      desc: 'Total amount of battles started including all types.',
    },
    {
      title: 'Most played battles',
      key: 'Value',
      unit: '',
      data: mostPlayed,
      type: 'battle',
      desc: 'The specific battles with most participants.',
    },
    {
      title: 'Most played battle designer',
      key: 'Value',
      unit: '',
      data: data?.Players,
      type: 'kuski',
      desc: 'Total amount of players in a designers battles added together.',
    },
    {
      title: 'Best rated replays',
      key: 'Value',
      unit: ' tens',
      data: replay,
      type: 'replay',
      desc: 'Most amount of 10 stars for uploaded replays.',
    },
    {
      title: 'Finishes',
      key: 'Value',
      unit: '',
      data: data?.FinishedRuns,
      type: 'kuski',
      desc: 'Total amount of times a player finished any level.',
    },
    {
      title: 'Different levels played',
      key: 'Value',
      unit: '',
      data: data?.LevelsPlayed,
      type: 'kuski',
      desc: 'Amount of unique levels a player have played.',
    },
    {
      title: 'Active chatters',
      key: 'Value',
      unit: '',
      data: data?.ChatLines,
      type: 'kuski',
      desc: 'Total amount of lines written in chat.',
    },
    {
      title: 'Levels added',
      key: 'Value',
      unit: '',
      data: data?.UniqueLevelNames,
      type: 'kuski',
      desc: 'Total amount of levels added to the database, not including duplicates with same level name.',
    },
  ];

  const onStep = index => {
    if (ref?.current) {
      const el = ref.current.children[index];
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 53;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <StepCon>
        <Stepper
          steps={awards.map(a => a.title)}
          orientation="vertical"
          hideable
          onClick={index => onStep(index)}
        />
      </StepCon>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Header>
            <HeadlineTop>Best of</HeadlineTop>
            <Headline>EOL {year}</Headline>
          </Header>
          <Container ref={ref}>
            {awards.map((award, awardIndex) => {
              if (!award?.data?.length > 0) {
                return null;
              }
              return (
                <Section>
                  <Text white>{award.title}</Text>
                  <Row ai="center" jc="center">
                    <Silver>
                      <Name award={award} index={1} />
                      <br />
                      {parseFloat(award.data[1][award.key]).toLocaleString()}
                      {award.unit}
                    </Silver>
                    <Gold>
                      <Name award={award} index={0} />
                      <br />
                      {parseFloat(award.data[0][award.key]).toLocaleString()}
                      {award.unit}
                    </Gold>
                    <Bronze>
                      <Name award={award} index={2} />
                      <br />
                      {parseFloat(award.data[2][award.key]).toLocaleString()}
                      {award.unit}
                    </Bronze>
                  </Row>
                  <Row ai="center" jc="center">
                    {open.indexOf(awardIndex) === -1 ? (
                      <ExpandMore
                        onClick={() => setOpen([...open, awardIndex])}
                      />
                    ) : (
                      <ExpandLess
                        onClick={() => {
                          const index = open.indexOf(awardIndex);
                          const newOpen = [...open];
                          newOpen.splice(index, 1);
                          setOpen(newOpen);
                        }}
                      />
                    )}
                  </Row>
                  {open.indexOf(awardIndex) > -1 && (
                    <Column t="Small" ai="center" jc="center">
                      {award.data.map((val, no) => (
                        <Row>
                          <No>{no + 1}.</No>
                          <NameCon>
                            <Name award={award} index={no} />
                          </NameCon>
                          <Value>
                            {parseFloat(val[award.key]).toLocaleString()}
                            {award.unit}
                          </Value>
                        </Row>
                      ))}
                      <Column t="Small">{award.desc}</Column>
                    </Column>
                  )}
                </Section>
              );
            })}
          </Container>
        </>
      )}
    </>
  );
};

const Container = styled.div`
  background-color: #dddddd;
  padding-bottom: 200px;
  color: rgb(34, 34, 34);
`;

const No = styled.span`
  width: 50px;
  text-align: right;
  padding-right: 10px;
`;

const NameCon = styled.span`
  width: 120px;
`;

const Value = styled.span`
  width: 100px;
  text-align: right;
`;

const Gold = styled.div`
  font-size: 22px;
  margin-top: 190px;
  width: 150px;
  text-align: center;
`;

const Silver = styled(Gold)`
  margin-top: 250px;
`;

const Bronze = styled(Gold)`
  margin-top: 260px;
`;

const Headline = styled.div`
  margin: ${p => p.theme.padSmall};
  margin-bottom: ${p => p.theme.padMedium};
  color: #4f8ec9;
  font-weight: 700;
  font-size: 82px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  transform: rotate(-6deg);
  width: 99%;
  margin-bottom: 50px;
  -webkit-text-stroke: 2px white;
`;

const HeadlineTop = styled(Headline)`
  margin: 0;
  padding-top: 150px;
  text-transform: none;
  transform: rotate(-4deg);
`;

const Section = styled.div`
  height: 500px;
  width: 100%;
  position: relative;
  background-image: url('${pedestal}');
  background-position: center;
  background-size: 2000px 500px;
  margin-bottom: 200px;
  svg {
    cursor: pointer;
  }
`;

const Header = styled(Section)`
  background-image: url('${tracks}');
  margin-bottom: 0;
`;

export default Awards;
