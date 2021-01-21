import React from 'react';
import Header from 'components/Header';
import styled from 'styled-components';

const ConfiguringEol = () => {
  return (
    <Text>
      <Header h2>Configuring EOL</Header>
      <Header h3>Players</Header>
      <div>
        <StyledList>
          <li>1st nick: Your nickname</li>
          <li>Password: Your password</li>
        </StyledList>
      </div>
      <Header h3>Server setup</Header>
      <div>
        <StyledList>
          <li>IP: The address to connect to. Current IP is 161.35.35.82</li>
          <li>TCP port: Port for TCP. Currently valid TCP port is 4460</li>
          <li>UDP port: Port for UDP. Currently valid UDP port is 4461</li>
          <li>
            Play offline: With this option checked you will be playing offline.
          </li>
          <li>
            TCP only: With this option checked, TCP protocol will be used for
            players&#39; frames. Use this option if you have troubles in seeing
            other players.
          </li>
        </StyledList>
      </div>
      <Header h3>Keys</Header>
      <div>
        <StyledList>
          <li>
            Alovolt P1/P2: Is alovolt for player 1/2 enabled? If yes, then press
            the &quot;change&quot; button to set the button.
          </li>
          <li>
            Brake Alias: If enabled, you can set another button for braking.
          </li>
          <li>
            Esc alias: If enabled, you can set another button for escape to more
            conveniently start a new run.
          </li>
          <li>
            Option 2 key: Specify which button should be held down when choosing
            2nd options with function keys in game.
          </li>
          <li>
            Option 3 key: Specify which button should be held down when choosing
            3rd options with function keys in game.
          </li>
          <li>
            Replay keys: Set keys for controlling replay playing. The program
            will ask the following keys: Fast motion (8x), Fast motion (4x),
            Fast motion (2x), Slow motion (4x), Slow motion (2x), Backward and
            Pause.
          </li>
          <li>
            Function keys: Set keys for the 12 function keys. These are F1-F12
            buttons by default.
          </li>
          <li>
            Hotkeys: Enable/disable and set hotkeys for 1st/2nd/3rd function
            keys.
          </li>
        </StyledList>
      </div>
      <Header h3>Main menu</Header>
      <div>
        <StyledList>
          <li>About EOL 1.3: About screen</li>
          <li>Lev Packs: Level pack screen</li>
          <li>Merge Replays: Merge replays -function</li>
          <li>Help: Help screen</li>
          <li>Best Times: Best Times screen</li>
          <li>Demo: Demo</li>
        </StyledList>
      </div>
      <Header h3>Screen</Header>
      <div>
        <StyledList>
          <li>
            Resolution: Set the resolution that is used ingame. You can type
            arbitrary values in the box or choose from the list. Note that EOL
            will fail to start if your graphics device doesn&#39;t support the
            resolution you have specified.
          </li>
          <li>
            Zoom: Set the ingame zoom while playing (how far the camera is from
            the kuski). The greater the zoom, the closer the camera is. Entering
            extreme values may crash EOL.
          </li>
          <li>
            Center camera: When enabled, kuski is always in the middle of the
            screen regardless of whether he&#39;s facing left or right. When
            disabled, the camera will &quot;fly&quot; to the other side when
            turning in such a way that what&#39;s behind the kuski will be off
            the screen.
          </li>
          <li>Zoom textures: Are textures zoomed or not?</li>
        </StyledList>
      </div>
      <Header h3>Navigator</Header>
      <div>
        <StyledList>
          <li>
            Size: Size of the minimap. You can type arbitrary values or pick
            dimensions from the list.
          </li>
          <li>Zoom: How much the minimap is zoomed in or out.</li>
        </StyledList>
      </div>
    </Text>
  );
};

const Text = styled.div`
  padding-left: 8px;
  max-width: 900px;
`;

const StyledList = styled.ul`
  margin-block-start: 0.4em;
  margin-block-end: 0.4em;
`;

export default ConfiguringEol;
