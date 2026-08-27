import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from '@material-ui/core';
import styled from '@emotion/styled';
import Layout from 'components/Layout';
import { ExpandMore } from '@material-ui/icons';
import { useStoreState, useStoreActions } from 'easy-peasy';
import RecList from 'features/RecList';
import Header from 'components/Header';
import UpdateForm from 'pages/level/UpdateForm';
import { useParams } from '@tanstack/react-router';
import LevelInfoLevelStats from './LevelInfoLevelStats';
import { nickId, mod } from 'utils/nick';
import Preview from '../kuski/Preview';
import LevelInfo from './LevelInfo.jsx';
import LevelBattles from './LevelBattles.jsx';
import LevelPlayer from './LevelPlayer.jsx';
import LevelTimes from './LevelTimes/LevelTimes.jsx';

const Level = () => {
  const { LevelId } = useParams({ strict: false });
  const LevelIndex = parseInt(LevelId, 10);
  const [previewRec, setPreviewRec] = useState(null);

  const { level, battlesForLevel, loading, levelpacks, cups } = useStoreState(
    state => state.Level,
  );

  const { getLevel } = useStoreActions(actions => actions.Level);

  useEffect(() => {
    getLevel(LevelIndex);
  }, []);

  const openReplay = time => {
    setPreviewRec({
      ...time,
      LevelIndex,
      LevelData: level,
    });
  };

  return (
    <Layout t={`Level - ${level.LevelName}.lev`}>
      <Grid container spacing={2}>
        <Grid container item xs={12} md={7} alignContent="flex-start">
          <Grid item xs={12}>
            <LevelPlayer
              level={level}
              battles={battlesForLevel}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <LevelTimes LevelIndex={LevelIndex} openReplay={openReplay} />
          </Grid>
        </Grid>
        <Grid container item xs={12} md={5}>
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>Level info</Header>
              </AccordionSummary>
              <AccordionDetails>
                <LevelInfo level={level} levelpacks={levelpacks} cups={cups} />
              </AccordionDetails>
            </Accordion>
            {(nickId() === level.AddedBy || mod() === 1) && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Header h3>Edit tags</Header>
                </AccordionSummary>
                <AccordionDetails style={{ flexDirection: 'column' }}>
                  <UpdateForm />
                </AccordionDetails>
              </Accordion>
            )}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>Play stats</Header>
              </AccordionSummary>
              <LevelStatsAccordion>
                <LevelInfoLevelStats level={level} />
              </LevelStatsAccordion>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>Battles in level</Header>
              </AccordionSummary>
              <AccordionBattles>
                <LevelBattles battles={battlesForLevel} loading={loading} />
              </AccordionBattles>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>Replays in level</Header>
              </AccordionSummary>
              <AccordionReplays>
                <RecList
                  LevelIndex={LevelIndex}
                  columns={['Replay', 'Time', 'By', 'Tags']}
                  horizontalMargin={-16}
                />
              </AccordionReplays>
            </Accordion>
          </Grid>
        </Grid>
      </Grid>
      {previewRec && (
        <Preview previewRec={previewRec} setPreviewRec={setPreviewRec} />
      )}
    </Layout>
  );
};

const AccordionReplays = styled(AccordionDetails)`
  max-height: 400px;
  overflow-y: auto;
  & {
    flex-direction: column;
  }
`;

const AccordionBattles = styled(AccordionDetails)`
  && {
    padding-left: 0;
    padding-right: 0;
    overflow-y: auto;
    max-height: 250px;
  }
`;

const LevelStatsAccordion = styled(AccordionDetails)`
  && {
    margin-top: -7px;
    padding-left: 0;
    padding-right: 0;
  }
`;

export default Level;
