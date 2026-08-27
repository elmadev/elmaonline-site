import React from 'react';
import styled from '@emotion/styled';
import Header from 'components/Header';
import Link from 'components/Link';

const HowToInstall = () => {
  return (
    <Text>
      <Header h2>How to install</Header>
      <Header h3>Buying Elasto Mania</Header>
      <List>
        <li>
          <a
            href="https://store.steampowered.com/about/"
            target="_blank"
            rel="noreferrer"
          >
            Install steam
          </a>
        </li>
        <li>
          <a
            href="https://store.steampowered.com/app/1290220/Elasto_Mania_Remastered/"
            target="_blank"
            rel="noreferrer"
          >
            Buy Elasto Mania on steam
          </a>
        </li>
        <li>Install Elasto Mania through your steam client</li>
      </List>
      <Header h3>Upgrading to Elma Online</Header>
      <List>
        <li>
          <a
            href="https://steamcommunity.com/workshop/filedetails/?id=2094059600"
            target="_blank"
            rel="noreferrer"
          >
            Install the Elma Online mod on steam workshop by clicking subscribe
          </a>
        </li>
        <li>Let steam download the upgrade</li>
      </List>
      <Header h3>How to run</Header>
      You have 3 options:
      <List>
        <li>
          Open Elasto Mania through steam or the desktop shortcut it created. It
          will start eolconf first, where you input nick and password, and then
          the game will start when you save and exit eolconf.
        </li>
        <li>
          After opening it once like described above, you can also open the
          eol.exe directly from "[steam-folder]\steamapps\common\elma\merged".
          Here you can also open eolconf and startballe.
        </li>
        <li>
          You can also copy the "[steam-folder]\steamapps\common\elma\merged"
          folder outside steam to be completely independent of steam
          (standalone). This option will require manual updates of EOL. Turn on{' '}
          <Link to="/settings/notifications">news notifications</Link> to be{' '}
          aware.
        </li>
      </List>
      <Header h3>Common issues</Header>
      <List>
        <li>
          Gray square, non working editor, low fps: Try different
          resolution/zoom in eolconf (preferably native res of your monitor). Or
          try a different ddraw.dll file, find the different ones under{' '}
          <Link to="help/programs">help/programs</Link>.
        </li>
        <li>
          msvcr120.dll missing, vcruntime140 missing or similar error: You need
          to install visual studio redistributable. Usually{' '}
          <a href="https://aka.ms/vs/16/release/vc_redist.x64.exe">2013 x64</a>{' '}
          or <a href="https://aka.ms/highdpimfc2013x86enu">2013 x86</a> helps,
          otherwise google the error and see which version you need. Try both
          both 32bit and 64bit versions. Older versions can be found{' '}
          <a href="https://learn.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170">
            here
          </a>
          .
        </li>
      </List>
      <Header h3>Other issues</Header>
      If you run into issues you can ask someone in{' '}
      <a href="https://discord.gg/j5WMFC6" target="_blank" rel="noreferrer">
        discord
      </a>{' '}
      who&apos;ll usually have a solution. Tag @eolmod for a faster response.
    </Text>
  );
};

const Text = styled.div`
  padding-left: 8px;
  max-width: 900px;
`;

const List = styled.ol`
  margin-top: 8px;
  margin-bottom: 8px;
`;

export default HowToInstall;
