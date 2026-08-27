import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { themes, previews } from 'theme';
import Header from 'components/Header';
import { Column, Row } from 'components/Containers';
import styled from '@emotion/styled';
import { Radio, Grid } from '@material-ui/core';
import { alphaNumeric } from 'utils/misc';
import { Paper } from 'components/Paper';

const Themes = () => {
  const {
    settings: { siteTheme },
  } = useStoreState(state => state.Settings);
  const { setSiteTheme } = useStoreActions(actions => actions.Settings);
  return (
    <Grid container spacing={2}>
      <Grid item sm={6} xs={12}>
        <Paper padding width="auto">
          <Header h2>Select Site Theme</Header>
          <Column>
            {themes.map((theme, index) => (
              <Column key={theme.name} t="Large">
                <Row>
                  <Header h3>{theme.name}</Header>
                  <ThemeRadio
                    checked={siteTheme === index}
                    onChange={() => setSiteTheme(index)}
                    value={alphaNumeric(theme.name)}
                    name="themeRadios"
                  />
                </Row>
                <Link target="_blank" rel="noreferrer" href={previews[index]}>
                  <PreviewImage src={previews[index]} alt={theme.name} />
                </Link>
              </Column>
            ))}
          </Column>
        </Paper>
      </Grid>
    </Grid>
  );
};

const ThemeRadio = styled(Radio)`
  && {
    padding: 0;
  }
`;

const Link = styled.a`
  height: 200px;
  width: 400px;
  margin-top: ${p => p.theme.padSmall};
`;

const PreviewImage = styled.img`
  border: 1px solid ${p => p.theme.fontColor};
  height: 200px;
  width: 400px;
  object-fit: cover;
`;

export default Themes;
