import React from 'react';
import styled from '@emotion/styled';
import Time from 'components/Time';
import Kuski from 'components/Kuski';
import DerpTable from 'components/Table/DerpTable';
import { zeroPad } from 'utils/time';
import { useNavigate } from '@tanstack/react-router';
import { ListRow, ListCell } from 'components/List';
import { PlayArrow } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import config from 'config';
import { downloadWithAuth } from 'utils/misc';
import { pts } from 'utils/cups';

const CupResults = props => {
  const navigate = useNavigate();
  const { results, cup, eventNo, CupIndex, pasteFriendly } = props;

  const goToReplay = (index, filename) => {
    navigate({ to: `/r/c-${index}/${filename}` });
  };

  if (pasteFriendly) {
    return (
      <Container>
        {results.map((r, no) => (
          <div>
            {r.Position ? r.Position : no + 1}.{' '}
            {r.KuskiData.Country
              ? `:flag_${r.KuskiData.Country.toLowerCase()}: `
              : null}
            {cup.TeamPoints ? (
              <Kuski
                kuskiData={{
                  Country: r.KuskiData.Country,
                  Kuski: r.KuskiData.Kuski,
                  TeamData: r.TeamData,
                }}
                team
              />
            ) : (
              <Kuski kuskiData={r.KuskiData} team />
            )}{' '}
            <Time time={r.Time} apples={-1} /> {pts(r.Points)}
          </div>
        ))}
      </Container>
    );
  }

  return (
    <Container>
      <DerpTable
        headers={[
          '#',
          'Player',
          'Time/Rec',
          { t: 'Points', r: true, w: 'auto' },
        ]}
        length={results.length}
      >
        {results.map((r, no) => (
          <ListRow key={r.KuskiIndex}>
            <ListCell>{r.Position ? r.Position : no + 1}.</ListCell>
            <ListCell>
              {cup.TeamPoints ? (
                <Kuski
                  kuskiData={{
                    Country: r.KuskiData.Country,
                    Kuski: r.KuskiData.Kuski,
                    TeamData: r.TeamData,
                  }}
                  team
                  flag
                />
              ) : (
                <Kuski kuskiData={r.KuskiData} team flag />
              )}
            </ListCell>
            <ListCell>
              {r.Replay || r.UUID ? (
                <a
                  href={`${config.dlUrl}cupreplay/${r.CupTimeIndex}/${
                    cup.ShortName
                  }${zeroPad(eventNo, 2)}${r.KuskiData.Kuski.substring(0, 6)}`}
                  onClick={e => e.stopPropagation()}
                >
                  <Time time={r.Time} apples={-1} />
                </a>
              ) : (
                <Time time={r.Time} apples={-1} />
              )}
              <Button
                onClick={() => {
                  goToReplay(
                    r.CupTimeIndex,
                    `${cup.ShortName}${zeroPad(
                      eventNo,
                      2,
                    )}${r.KuskiData.Kuski.substring(0, 6)}`,
                  );
                }}
              >
                <PlayArrow />
              </Button>
            </ListCell>
            <ListCell right>{pts(r.Points)}</ListCell>
          </ListRow>
        ))}
      </DerpTable>
      <Download>
        {results.length > 0 && (
          <Dl
            onClick={() =>
              downloadWithAuth(
                `eventrecs/${CupIndex}/${cup.ShortName}${zeroPad(eventNo, 2)}`,
                `${cup.ShortName}${zeroPad(eventNo, 2)}.zip`,
                'application/zip',
              )
            }
          >
            All replays
          </Dl>
        )}
      </Download>
    </Container>
  );
};

const Download = styled.div`
  display: flex;
  justify-content: flex-end;
  min-height: 42px;
`;

const Dl = styled.span`
  margin-top: 4px;
  margin-right: 4px;
  margin-bottom: 16px;
  cursor: pointer;
  color: ${p => p.theme.linkColor};
`;

const Container = styled.div``;

export default CupResults;
