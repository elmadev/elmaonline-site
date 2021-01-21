import React, { useState } from 'react';
import Link from 'components/Link';
import styled from 'styled-components';
import Header from 'components/Header';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';

const EolFolder = () => {
  const [exp, setExp] = useState({ lev: false, ddraw: false });
  const expandLev = (
    <TextBox>
      <Header h3>Level folder</Header>
      <p>
        This is where the levels in the External File category in game are
        stored. If you download a level outside of eol, this is where it goes.
      </p>
      <p>
        For you to be able to download battles, you need to have this folder.
        Not having the folder will cause the game to crash.
      </p>
    </TextBox>
  );
  const expandRec = (
    <TextBox>
      <Header h3>Replay folder</Header>
      <p>
        This is where the replays in the Replay menu in game are stored. If you
        download a replay outside of eol, this is where it goes.
      </p>
      <p>
        For you to be able to download battle replays, you need to have this
        folder. Not having the folder will cause the game to crash.
      </p>
    </TextBox>
  );
  const expandBmp = (
    <TextBox>
      <Header h3>Bmp folder</Header>
      <p>
        All players&#39; custom shirts are stored here. You can make your own
        shirt if you wish, the best way to get started is to copy one from
        someone else for the shape and size and modify it from there. Name the
        shirt &quot;yournick.bmp&quot;.
      </p>
      <p>
        When you are making a shirt, you should take into account that the game
        expects a 8-bit color palette on the image. Using a wrong color palette
        will result in unexpected colors.
      </p>
      <p>
        If the shirt is not the right size, it will break the shirt into some
        interesting fractal shapes.
      </p>
      <p>
        Download all available shirts here:{' '}
        <Link to="/dl/allshirts" download>
          Download
        </Link>
      </p>
    </TextBox>
  );
  const expandLgr = (
    <TextBox>
      <Header h3>Lgr folder</Header>
      <p>This is where the in-game Lgr&#39;s (&quot;skins&quot;) are stored.</p>
      <p>You will need to have a Default.lgr in this folder.</p>
      <p>
        You can name any lgr you have as Default.lgr and you can use it as your
        primary lgr in levels where no lgr has been specified by the level
        maker.
      </p>
    </TextBox>
  );
  const expandDdraw = (
    <TextBox>
      <Header h3>ddraw.dll</Header>
      <p>
        ddraw.dll is a library which will greatly increase your framerate by
        changing the rendering method.
      </p>
      <p>
        There are a couple of different options, trying different ones for the
        best performance is recommended.
      </p>
      <p>
        Download here:{' '}
        <Link to="./ddraws.zip" download>
          Zip (local)
        </Link>
        {' - '}
        <Link
          to="https://docs.google.com/uc?authuser=0&id=0B1HOSlW-Ci3UZXJvVmFWSnVMUjg&export=download"
          download
        >
          Rar (Google Docs)
        </Link>
      </p>
      <p>
        To use a any of these, unpack the archive and copy one of the .dll files
        into your eol folder. You can try to change it if the performance is
        suboptimal.
      </p>
      <p>
        Note that your in-game editor might not work with this ddraw.dll, in
        which case you might want to try swapping for another one or using an
        excternal level editor such as{' '}
        <Link to="https://mopolauta.moposite.com/viewtopic.php?f=3&t=6101">
          SLE
        </Link>
        .
      </p>
    </TextBox>
  );
  const expandStartballe = (
    <TextBox>
      <Header h3>startballe.exe</Header>
      <p>Use this to start battles or perform moderator actions.</p>
      <p>
        You need to be given rights to start battles, special battles or to
        abort/stop battles. The best way to get the rights to start battles is
        to ask in elma discord or in-game game chat if a moderator is online.
      </p>
      <p>
        Read more about the specifics in the &quot;Starting Battles&quot;
        section.
      </p>
    </TextBox>
  );
  const expandScreenshots = (
    <TextBox>
      <Header h3>Screenshot files</Header>
      <p>
        Whenever you take a screenshot in-game, it is saved as snp*****.pcx in
        your eol folder. To view them, you need a program that can open them.
      </p>
    </TextBox>
  );
  const expandEolconf = (
    <TextBox>
      <Header h3>eolconf.exe</Header>
      <p>
        Configure your eol here. For more information, check out the
        &quot;Configuring EOL&quot; section.
      </p>
    </TextBox>
  );
  const expandStats = (
    <TextBox>
      <Header h3>stats.txt</Header>
      <p>
        Your internal top10&#39;s and total times will be displayed here, along
        with multiplayer top10&#39;s and total times.
      </p>
      <p>
        Keep in mind this file is only updated whenever you close your game,
        unlike state.dat which is updated whenever you make a top 10 time.
      </p>
    </TextBox>
  );
  const expandEol = (
    <TextBox>
      <Header h3>eol.exe</Header>
      <p>This is the game executable file.</p>
    </TextBox>
  );
  const expandBs = (
    <TextBox>
      <Header h3>bs.dll</Header>
      <p>The online functionality file for eol.</p>
    </TextBox>
  );
  const expandElmares = (
    <TextBox>
      <Header h3>elma.res</Header>
      <p>The resource list file, including fonts, menu backgrounds, etc.</p>
    </TextBox>
  );
  const expandState = (
    <TextBox>
      <Header h3>state.dat</Header>
      <p>
        Your internal top10&#39;s and total times are here, along with
        multiplayer top10&#39;s and total times.
      </p>
      <p>
        If you want to make sure you will not lose your progress, you can upload
        this file to for example{' '}
        <Link to="http://stats.sshoyer.net">elmastats</Link>.
      </p>
      <p>
        To combine two existing state.dat files, name one of them merge.dat and
        place them in the game folder. When you launch the game they will merge
        into state.dat and you can proceed to delete merge.dat.
      </p>
    </TextBox>
  );
  const expandFrate = (
    <TextBox>
      <Header h3>f_rate.inf</Header>
      <p>
        f_rate.inf is an optional addition to your game folder. It will display
        the framerate at the end of your previous run. You do not need to exit
        the game to be able to check your fps.
      </p>
      <p>Download f_rate.inf here: </p>
      <Link to="./f_rate.zip" download>
        Download
      </Link>
    </TextBox>
  );

  const makeLink = (expName, linkName, description) => {
    return (
      <TableRow>
        <TableCellStyled highlight={exp === expName ? 'true' : null}>
          <Clickable color="primary" onClick={() => setExp(expName)}>
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
          {exp === 'lev' && expandLev}
          {exp === 'ddraw' && expandDdraw}
          {exp === 'frate' && expandFrate}
          {exp === 'rec' && expandRec}
          {exp === 'lgr' && expandLgr}
          {exp === 'bmp' && expandBmp}
          {exp === 'startballe' && expandStartballe}
          {exp === 'eolconf' && expandEolconf}
          {exp === 'eol' && expandEol}
          {exp === 'elmares' && expandElmares}
          {exp === 'bs' && expandBs}
          {exp === 'stats' && expandStats}
          {exp === 'state' && expandState}
          {exp === 'screenshots' && expandScreenshots}
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
  color: #219653;
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
