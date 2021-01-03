import React from 'react';
import styled from 'styled-components';
import { has } from 'lodash';
import Header from 'components/Header';
import wc61st from '../../images/wc6/1st.png';
import wc62nd from '../../images/wc6/2nd.png';
import wc63rd from '../../images/wc6/3rd.png';
import wc6finisher from '../../images/wc6/finisher.png';
import wc6top10 from '../../images/wc6/top10.png';
import wc71st from '../../images/wc7/1st.png';
import wc72nd from '../../images/wc7/2nd.png';
import wc73rd from '../../images/wc7/3rd.png';
import wc7finisher from '../../images/wc7/finisher.png';
import wc7top10 from '../../images/wc7/top10.png';

const images = {
  '1st': wc61st,
  '2nd': wc62nd,
  '3rd': wc63rd,
  top10: wc6top10,
  finisher: wc6finisher,
  '7_1st': wc71st,
  '7_2nd': wc72nd,
  '7_3rd': wc73rd,
  '7_finisher': wc7finisher,
  '7_top10': wc7top10,
};

const titles = {
  '1st': 'Won World Cup 6.',
  '2nd': 'Finished on a second place in World Cup 6.',
  '3rd': 'Finished on a third place in World Cup 6.',
  top10: 'Finished in top 10 in World Cup 6.',
  finisher: 'Completed all levels (with 1 skip) in World Cup 6.',
  '7_1st': 'Won World Cup 7.',
  '7_2nd': 'Finished on a second place in World Cup 7.',
  '7_3rd': 'Finished on a third place in World Cup 7.',
  '7_finisher': 'Completed all levels (with 1 skip) in World Cup 7.',
  '7_top10': 'Finished in top 10 in World Cup 7.',
};

const a = {
  '2': ['finisher'],
  '5': ['top10', '7_1st', '7_top10', '7_finisher'],
  '8': ['finisher'],
  '10': ['finisher', '7_finisher'],
  '11': ['finisher'],
  '12': ['finisher', '7_finisher'],
  '17': ['7_top10', '7_finisher'],
  '18': ['finisher'],
  '26': ['top10', 'finisher'],
  '34': ['finisher'],
  '35': ['finisher', '7_finisher'],
  '45': ['top10', 'finisher'],
  '46': ['top10', 'finisher'],
  '48': ['7_top10'],
  '58': ['finisher'],
  '65': ['top10', 'finisher', '7_top10', '7_finisher'],
  '69': ['3rd', 'top10', 'finisher', '7_3rd', '7_top10', '7_finisher'],
  '74': ['7_finisher'],
  '81': ['2nd', 'top10', 'finisher'],
  '82': ['finisher'],
  '91': ['finisher', '7_finisher'],
  '108': ['finisher', '7_finisher'],
  '109': ['finisher'],
  '116': ['top10', 'finisher', '7_2nd', '7_top10', '7_finisher'],
  '122': ['finisher', '7_finisher'],
  '127': ['finisher'],
  '144': ['finisher'],
  '148': ['finisher'],
  '156': ['7_finisher'],
  '164': ['7_finisher'],
  '179': ['finisher', '7_finisher'],
  '213': ['7_top10'],
  '225': ['7_finisher'],
  '226': ['1st', 'top10', 'finisher'],
  '231': ['7_top10', '7_finisher'],
  '233': ['7_finisher'],
  '257': ['finisher', '7_finisher'],
  '269': ['finisher'],
  '323': ['7_finisher'],
  '345': ['top10', 'finisher', '7_top10', '7_finisher'],
  '349': ['finisher'],
  '356': ['finisher', '7_finisher'],
  '380': ['7_finisher'],
  '428': ['finisher'],
  '438': ['finisher'],
  '502': ['7_finisher'],
  '506': ['finisher', '7_finisher'],
  '564': ['finisher'],
  '681': ['finisher'],
  '738': ['finisher', '7_finisher'],
  '742': ['finisher'],
  '761': ['finisher'],
  '771': ['7_finisher'],
  '773': ['finisher', '7_finisher'],
  '907': ['finisher'],
  '1192': ['7_finisher'],
  '1306': ['finisher'],
  '1577': ['finisher'],
  '2543': ['finisher'],
  '2627': ['finisher'],
  '2979': ['finisher'],
  '3032': ['7_finisher'],
  '3052': ['7_finisher'],
  '4303': ['7_top10', '7_finisher'],
  '4889': ['7_finisher'],
  '5106': ['7_finisher'],
  '5146': ['7_finisher'],
  '5157': ['7_finisher'],
};

const AchievementsCups = ({ KuskiIndex }) => {
  return (
    <>
      {has(a, KuskiIndex) && (
        <>
          <Header h3>Cup achievements</Header>
          <Container>
            {a[KuskiIndex].map(x => (
              <img key={x} src={images[x]} alt={x} title={titles[x]} />
            ))}
          </Container>
        </>
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  img {
    padding: 8px;
  }
`;

export default AchievementsCups;
