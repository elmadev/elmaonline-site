import styled from '@emotion/styled';
import Time from 'components/Time';
import Kuski from 'components/Kuski';
import DerpTable from 'components/Table/DerpTable';
import { zeroPad } from 'utils/time';
import { useNavigate } from '@tanstack/react-router';
import { ListRow, ListCell } from 'components/List';
import { PlayArrow } from '@mui/icons-material';
import { Button } from '@mui/material';
import config from 'config';
import { downloadWithAuth } from 'utils/misc';
import { pts } from 'utils/cups';
import type { Cup, CupResult } from 'contract/cup.ts';

type CupResultsProps = {
  results: CupResult[];
  cup: Cup;
  eventNo: number;
  CupIndex: number;
  pasteFriendly?: boolean;
};

const CupResults = ({
  results,
  cup,
  eventNo,
  CupIndex,
  pasteFriendly = false,
}: CupResultsProps) => {
  const navigate = useNavigate();

  const goToReplay = (index: number, filename: string) => {
    navigate({ to: `/r/c-${index}/${filename}` });
  };

  if (pasteFriendly) {
    return (
      <Container>
        {results.map((r, no) => (
          <div key={r.KuskiIndex}>
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
        headers={['#', 'Player', 'Time/Rec', { t: 'Points', r: true }]}
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
