import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import Header from 'components/Header';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import config from 'config';

const MakeTab = ({ components }) => {
  return (
    <TextBox>
      {components.map((p, i) =>
        typeof p === 'string' ? <p key={i.toString()}>{p}</p> : p,
      )}
    </TextBox>
  );
};

const tabs = {
  lev: [
    <Header h3 key="header">
      Level folder
    </Header>,
    `This is where the levels in the External File category in game are
      stored. If you download a level outside of eol, this is where it goes.`,
    `For you to be able to download battles, you need to have this folder.
      It is created automatically at startup if it doesn't exist.`,
  ],
  rec: [
    <Header h3 key="header">
      Replay folder
    </Header>,
    `This is where the replays in the Replay menu in game are stored. If you
      download a replay outside of eol, this is where it goes.`,
    `For you to be able to download battle replays, you need to have this
      folder. It is created automatically at startup if it doesn't exist.`,
  ],
  bmp: [
    <Header h3 key="header">
      Bmp folder
    </Header>,
    `All players' custom shirts are stored here. You can make your own
        shirt if you wish, the best way to get started is to copy one from
        someone else for the shape and size and modify it from there. Name the
        shirt "yournick.bmp".`,
    `When you are making a shirt, you should take into account that the game
        expects a 8-bit color palette on the image. Using a wrong color palette
        will result in unexpected colors.`,
    `If the shirt is not the right size, it will break the shirt into some
        interesting fractal shapes.`,
    <p key="p">
      <span>Download all available shirts here: </span>
      <a href={`${config.dlUrl}allshirts`} download>
        Download
      </a>
    </p>,
  ],

  lgr: [
    <Header h3 key="header">
      Lgr folder
    </Header>,
    `This is where the in-game LGRs ("skins") are stored.`,
    `You will need to have a Default.lgr in this folder.`,
    `You can name any LGR you have as Default.lgr and you can use it as your
        primary LGR in levels where no LGR has been specified by the level
        maker.`,
    <p key="p">
      <span>Download the original Default.lgr file here: </span>
      <span>
        <a href="https://up.elma.online/u/ly8259kxy2/Default.lgr">
          Default.lgr
        </a>
      </span>
    </p>,
  ],

  eol: [
    <Header h3 key="header">
      eol.exe
    </Header>,
    `This is the game executable file.`,
  ],

  eolconf: [
    <Header h3 key="header">
      eolconf.exe
    </Header>,
    `Configure your eol here. For more information, check out the
      "Configuring EOL" section.`,
  ],

  startballe: [
    <Header h3 key="header">
      startballe.exe
    </Header>,
    `Use this to start battles or perform moderator actions.`,
    `You need to be given rights to start battles, special battles or to
        abort/stop battles. The best way to get the rights to start battles is
        to ask in elma discord or in-game game chat if a moderator is online.`,
    `Read more about the specifics in the "Starting Battles"
        section.`,
  ],

  elmares: [
    <Header h3 key="header">
      elma.res
    </Header>,
    `The resource list file, including fonts, menu backgrounds, etc.`,
  ],

  bs: [
    <Header h3 key="header">
      bs.dll
    </Header>,
    `The online functionality file for eol.`,
  ],

  state: [
    <Header h3 key="header">
      state.dat
    </Header>,
    `Your internal top10's and total times are here, along with
      multiplayer top10's and total times.`,
    `To combine two existing state.dat files, name one of them merge.dat and
      place them in the game folder. When you launch the game they will merge
      into state.dat and you can proceed to delete merge.dat.`,
    <p key="p">
      <span>
        If you want to make sure you will not lose your progress, you can upload
        this file to for example{' '}
      </span>
      <span>
        <a href="http://stats.sshoyer.net">elmastats</a>.
      </span>
    </p>,
  ],

  stats: [
    <Header h3 key="header">
      stats.txt
    </Header>,
    `Your internal top10's and total times will be displayed here, along
      with multiplayer top10's and total times.`,
    `Keep in mind this file is only updated whenever you close your game,
      unlike state.dat which is updated whenever you make a top 10 time.`,
  ],

  screenshots: [
    <Header h3 key="header">
      Screenshot files
    </Header>,
    `Whenever you take a screenshot in-game, it is saved as snp*****.pcx in
      your eol folder. To view them, you need a program that can open them.`,
  ],

  ddraw: [
    <Header h3 key="header">
      ddraw.dll
    </Header>,
    `ddraw.dll is a library which will greatly increase your framerate by
        changing the rendering method.`,
    `There are a couple of different options, trying different ones for the
        best performance is recommended.`,
    <p key="p">
      Download here: <a href={`${config.url}ddraws.zip`}>Zip (local)</a>
      {' - '}
      <a href="https://docs.google.com/uc?authuser=0&id=0B1HOSlW-Ci3UZXJvVmFWSnVMUjg&export=download">
        Rar (Google Docs)
      </a>
    </p>,
    `To use a any of these, unpack the archive and copy one of the .dll files
        into your eol folder. You can try to change it if the performance is
        suboptimal.`,
    <p key="p2">
      Note that your in-game editor might not work with this ddraw.dll, in which
      case you might want to try swapping for another one or using an external
      level editor such as{' '}
      <a href="https://mopolauta.moposite.com/viewtopic.php?f=3&t=6101">SLE</a>.
    </p>,
  ],

  frate: [
    <Header h3 key="header">
      f_rate.inf
    </Header>,
    `f_rate.inf is an optional addition to your game folder. It will display
      the framerate at the end of your previous run. You do not need to exit
      the game to be able to check your fps.`,
    <p key="p">
      Download f_rate.inf here:{' '}
      <a href={`${config.url}f_rate.zip`}>Zip (local)</a>
    </p>,
  ],
};

const EolFolder = ({ section }) => {
  const navigate = useNavigate();

  const makeLink = (expName, linkName, description) => {
    return (
      <TableRow key={expName}>
        <TableCellStyled
          highlight={section === expName ? 'true' : null}
          key={`${expName}cell`}
        >
          <Clickable
            color="primary"
            onClick={() => navigate({ to: '/help/eolfiles/' + expName })}
          >
            {linkName}
          </Clickable>{' '}
          - {description}
        </TableCellStyled>
      </TableRow>
    );
  };

  return (
    <div>
      <Text>
        <Header h2>EOL Files</Header>
      </Text>
      <MainContainer>
        <LeftContainer>
          <Text>
            <Header h3>Folders</Header>
            <Table size="small">
              <TableBody>
                {makeLink('lev', 'lev', 'Level Folder')}
                {makeLink('rec', 'rec', 'Replay Folder')}
                {makeLink('bmp', 'bmp', 'The folder for custom shirts')}
                {makeLink('lgr', 'lgr', 'Customize how the game looks')}
              </TableBody>
            </Table>
            <Header h3>Files</Header>
            <Table size="small">
              <TableBody>
                {makeLink('eol', 'eol.exe', 'The game executable')}
                {makeLink('eolconf', 'eolconf.exe', 'Online settings')}
                {makeLink('startballe', 'startballe.exe', 'Start battles')}
                {makeLink(
                  'elmares',
                  'elma.res',
                  'Original Elasto Mania resource list file',
                )}
                {makeLink('bs', 'bs.dll', 'Online patch functionality')}
                {makeLink(
                  'state',
                  'state.dat',
                  'Local internal time storage file',
                )}
                {makeLink(
                  'stats',
                  'stats.txt',
                  'Local internal times in a text file format',
                )}
                {makeLink('screenshots', 'snp*****.pcx', 'Screenshot files')}
              </TableBody>
            </Table>
            <Header h3>Useful additions</Header>
            <Table size="small">
              <TableBody>
                {makeLink(
                  'ddraw',
                  'ddraw.dll',
                  'A useful library to make the game smoother',
                )}
                {makeLink('frate', 'f_rate.inf', 'Check your in-game fps')}
              </TableBody>
            </Table>
          </Text>
        </LeftContainer>
        <RightContainer>
          {section && <MakeTab components={tabs[section]} />}
        </RightContainer>
      </MainContainer>
    </div>
  );
};

const TableCellStyled = styled(TableCell)`
  && {
    border: none;
    font-weight: ${p => (p.highlight ? 550 : 'initial')};
  }
`;

const Text = styled.div`
  padding-left: 8px;
`;

const Clickable = styled.span`
  color: ${p => p.theme.linkColor};
  height: 100%;
  width: 100%;
  &:hover {
    cursor: pointer;
  }
`;

const MainContainer = styled.div`
  width: 100%;
  max-width: 950px;
  display: flex;
`;
const LeftContainer = styled.div`
  float: left;
  width: 50%;
`;
const RightContainer = styled.div`
  float: right;
  width: 50%;
`;

const TextBox = styled.div`
  padding: 8px;
  border: 1px solid rgba(224, 224, 224, 1);
  p {
    margin-block-start: 5px;
    margin-block-end: 0px;
  }
`;

export default EolFolder;
