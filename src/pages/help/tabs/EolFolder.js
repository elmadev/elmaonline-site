import React, { useState } from 'react';
import Link from 'components/Link';
import styled from 'styled-components';
import Header from 'components/Header';
import { Table, TableCell, TableRow, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    border: 'none',
  },
  highlight: {
    border: 'none',
    fontWeight: 550,
  },
});

const EolFolder = () => {
  const [exp, setExp] = useState({ lev: false, ddraw: false });
  const classes = useStyles();
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
        expects a 8-bit color palette on the image. Failing to use a wrong color
        palette will result in unexpected colors.
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
        your eol folder. To view them, you need a program that can open them,
        such as IrfanView.
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
              <TableRow>
                <TableCell
                  className={exp === 'lev' ? classes.highlight : classes.root}
                >
                  <Clickable color="primary" onClick={() => setExp('lev')}>
                    lev
                  </Clickable>{' '}
                  - Level folder
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className={exp === 'rec' ? classes.highlight : classes.root}
                >
                  <Clickable onClick={() => setExp('rec')}>rec</Clickable> -
                  Replay folder
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className={exp === 'bmp' ? classes.highlight : classes.root}
                >
                  <Clickable onClick={() => setExp('bmp')}>bmp</Clickable> - The
                  folder for custom shirts
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className={exp === 'lgr' ? classes.highlight : classes.root}
                >
                  <Clickable onClick={() => setExp('lgr')}>lgr</Clickable> -
                  Customize how the game looks
                </TableCell>
              </TableRow>
            </Table>
            <Header h3>Files</Header>
            <Table size="small">
              <TableRow>
                <TableCell
                  className={exp === 'eol' ? classes.highlight : classes.root}
                >
                  <Clickable onClick={() => setExp('eol')}>eol.exe</Clickable> -
                  The game executable
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className={
                    exp === 'eolconf' ? classes.highlight : classes.root
                  }
                >
                  <Clickable onClick={() => setExp('eolconf')}>
                    eolconf.exe
                  </Clickable>{' '}
                  - Online settings
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className={
                    exp === 'startballe' ? classes.highlight : classes.root
                  }
                >
                  <Clickable onClick={() => setExp('startballe')}>
                    startballe.exe
                  </Clickable>{' '}
                  - Start battles
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className={
                    exp === 'elmares' ? classes.highlight : classes.root
                  }
                >
                  <Clickable onClick={() => setExp('elmares')}>
                    elma.res
                  </Clickable>{' '}
                  - Original Elasto Mania resource list file
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className={exp === 'bs' ? classes.highlight : classes.root}
                >
                  <Clickable onClick={() => setExp('bs')}>bs.dll</Clickable> -
                  Online patch functionality
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className={exp === 'state' ? classes.highlight : classes.root}
                >
                  <Clickable onClick={() => setExp('state')}>
                    state.dat
                  </Clickable>{' '}
                  - Local internal time storage
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className={exp === 'stats' ? classes.highlight : classes.root}
                >
                  <Clickable onClick={() => setExp('stats')}>
                    stats.txt
                  </Clickable>{' '}
                  - Local internal times in a text file format
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className={
                    exp === 'screenshots' ? classes.highlight : classes.root
                  }
                >
                  <Clickable onClick={() => setExp('screenshots')}>
                    snp*****.pcx
                  </Clickable>{' '}
                  - Screenshot files
                </TableCell>
              </TableRow>
            </Table>
            <Header h3>Useful additions</Header>
            <Table size="small">
              <TableRow>
                <TableCell
                  className={exp === 'ddraw' ? classes.highlight : classes.root}
                >
                  <Clickable onClick={() => setExp('ddraw')}>
                    ddraw.dll
                  </Clickable>{' '}
                  - A useful library to make the game smoother
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className={exp === 'frate' ? classes.highlight : classes.root}
                >
                  <Clickable onClick={() => setExp('frate')}>
                    f_rate.inf
                  </Clickable>{' '}
                  - Check your in-game fps
                </TableCell>
              </TableRow>
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
