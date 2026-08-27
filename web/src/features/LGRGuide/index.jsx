import { Link } from '@tanstack/react-router';
import { Text, Column } from 'components/Containers';
import Header from 'components/Header';

const LGRGuide = () => {
  return (
    <Column p="Large">
      <Header h1>LGR Development Guide</Header>
      <Text>This is a quick guide on developing your own LGR file.</Text>

      <Header h2>Tools</Header>

      <Header h3>Image Editing Software</Header>
      <Text>
        Photoshop or GIMP are good choices. These programs support the LGR
        files' 256-color index palette and can open .pcx files.
      </Text>

      <Header h3>LGR Programs</Header>
      <Text>
        Quick and minimal LGR alterations can be made using{' '}
        <a href="https://lgrstudio.janka.la/">LGR Studio</a>. For more advanced
        work,{' '}
        <a href="https://up.elma.online/u/0a0a0a0a01/LGR_Utility_64bit_V4.zip">
          LGR Utility
        </a>{' '}
        is recommended. It also automatically fixes/converts palette issues and
        allows the use of BMP files instead of PCX files.
      </Text>

      <Header h2>Making Your LGR</Header>
      <Text>
        The easiest way to create an LGR is to download default.lgr, extract the
        images using an LGR program, and edit them using an image editing
        software. You can also open other LGRs for ideas and inspiration.
      </Text>
      <Text>
        Ensure all images use the same palette - the game copies the palette
        stored in Q1BIKE.pcx and applies it to all the other images in the lgr.
        The large majority of LGRs use the palette that exists in default.lgr.
        You probably should not modify this palette unless you are an advanced
        user - modifying the palette may alter in-game text colors and kuski
        shirts.
      </Text>

      <Header h3>Image Properties</Header>
      <Text>
        Image names are limited to max 8 characters. Most images have these
        properties: image type (picture, texture, mask), default distance,
        default clipping and transparency (topleft, topright, bottomleft,
        bottomright, palette id 0, none). Special images start with "Q".
        Textures ignore transparency. Only masks may have a transparency of
        "none"
      </Text>

      <Header h3>Special Images</Header>
      <Text>
        None of the special images prefixed with "Q" use image properties. For
        most of them, no properties are defined. The images QUP_XXXX.pcx,
        QDOWN_XX.pcx, and qfood1-9.pcx technically have properties that the game
        ignores. All of the "Q" images are mandatory except for qfood2-9.pcx and
        QGRASS.pcx.
        <ul>
          <li>
            Q1, Q2: Kuski images, max size 255x255. Transparency is hardcoded to
            use the topleft pixel
          </li>
          <li>
            Q1BIKE, Q2BIKE: The game copies the purple section from the sample
            image, and deletes the green section. The topleft purple corner is
            used as the transparency pixel.
            <br />
            <img src="https://up.elma.online/u/glzxtd1u1h/Q1BIKE.bmp" />
          </li>
          <li>
            QFLAG: Bike flagtag image. The topleft pixel is used for
            transparency.
          </li>
          <li>
            qfood1-9, QKILLER, QEXIT: Frames of size 40x40 (max 1000 frames).
            The topleft pixel of each individual frame is used as transparency.
            If you skip a number in qfood1-9, none of the subsequent food images
            will be loaded.
          </li>
          <li>
            QGRASS: Grass texture file. Also counts as a regular texture, though
            it has no default distance/clipping
          </li>
          <li>
            QCOLORS: Minimap colors taken from the center pixel of each box. The
            timer color is unused - the darkest/lightest colors of the palette
            are automatically selected for the timer.
          </li>
        </ul>
      </Text>

      <Header h3>QUP_XXXX.pcx/QDOWN_XX.pcx</Header>
      <Text>
        If you have at least 2 grass pictures and QGRASS.pcx, then grass will be
        drawn. The exact names of QUP_ and QDOWN_ files are ignored. Instead,
        the game predicts the slope of each grass picture based on if it is an
        up or down picture and based on the height. The height of each image
        should be at least 41. The slope of the grass is calculated as
        HEIGHT-41. Grass pictures should have 20 pixels of space between the top
        and the bottom of each picture. See the provided example.
        <ul>
          <li>
            QDOWN_XX: The grass starts on pixel (x, y) = (0, 20) and ends on
            pixel (x, y) = (WIDTH - 1, HEIGHT - 21)
          </li>
          <li>
            QUP_XXXX: The grass starts on pixel (x, y) = (0, HEIGHT - 21) and
            ends on pixel (x, y) = (WIDTH - 1, 20)
          </li>
          <li>
            QUP_0: If you have a perfectly even grass, you should probably
            follow default.lgr and put it as a QUP and not a QDOWN to avoid
            unintended behaviour
            <br />
            <img src="https://up.elma.online/u/nrqbmjwnps/Grass.png" />
          </li>
        </ul>
      </Text>

      <Header h3>Image Name Best Practices</Header>
      <Text>
        The image names are case-insensitive. However, many third-party programs
        unfortunately are case-sensitive. To avoid bugs with third-party
        programs, it is best practice to copy the letter case of default.lgr:
        Put all the "Q" files in uppercase except for qfood1-qfood9 which should
        be in lowercase. All other image files should be lowercase.
      </Text>

      <Header h3>LGR file restrictions</Header>
      <Text>
        <ul>
          <li>There may be 0-999 pictures.</li>
          <li>There may be 2-99 textures.</li>
          <li>There may be 0-199 masks.</li>
          <li>There may be 0-99 QUP_/QDOWN_ grass files.</li>
          <li>
            You should test your LGR at 4.00 zoom to make sure you don't have
            any crashes related to the amount of memory taken up by magnified
            images.
          </li>
        </ul>
      </Text>

      <Header h2>Advanced Topics</Header>

      <Header h3>Fancyboosting</Header>
      <Text>
        LGRs can be fancyboosted using LGR Utility, or are automatically
        fancyboosted when uploaded to elma.online. Fancyboosting adds all 256
        palette colors, available as 200x200 pixel images, which can be used for
        custom art in levels. The images are all named zz??????, where ??????
        corresponds to the hex RGB color (if using the default palette colors).
      </Text>
      <Text>
        An example can be seen from World Cup 9:{' '}
        <Link to={'/r/c-166361/WC907Smibu'}>WC907Smibu.rec</Link>
      </Text>

      <Header h3>Palette</Header>
      <Text>
        If you do modify the palette, keep in mind that the kuski's shirts can
        be messed up. The most important colors you should absolutely keep are
        palette id 0 (#000000) as this palette id may be overwritten by elma.exe
        in some contexts to be changed to the color black (#000000), and palette
        ids 25 and 253 (#f4e410, #e48060), which are used for the in-game yellow
        text overlay.
      </Text>

      <Header h3>Avoiding Crashes at High Resolution</Header>
      <Text>
        Elma Online has increased the available memory for bigger images, but
        you might still hit the limit at high zoom. That is why all lgrs should
        be tested at 4.00 zoom. If you run into problems, here is a more precise
        explanation of the expected memory limits in Elma Online:
        <ul>
          <li>
            All images: The pcx file format is limited to a max width and height
            of 65,536. At 4x zoom, that means that you should try to keep the
            width and height below 16000
          </li>
          <li>
            Pictures: The width is limited to 60,000, so keep the width under
            15,000 to support higher zoom. In addition, the picture buffer can
            support a max of approximately 6,000,000 pixels (transparent pixels
            are compressed). At 4.00 zoom, you need to divide by 4*4, so this
            corresponds to a max square size of approximately 600x600 pixels
            (600*4*600*4).
          </li>
          <li>
            Mask: Masks are read row by row and compressed into blocks of data,
            where each block of data specifies the number of consecutive (1)
            transparent or (2) non-transparent pixels, or specifies (3) the end
            of a row. The maximum number of blocks before running out of memory
            is 19990. This means that at a zoom of 4.00 you only have about 5000
            blocks of data. This means that images that horizontally transition
            back and forth between transparent/non-transparent pixels will
            rapidly run out of memory (stitch transparency pattern).
          </li>
        </ul>
      </Text>
    </Column>
  );
};

export default LGRGuide;
