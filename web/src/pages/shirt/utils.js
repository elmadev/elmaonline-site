import { nick } from 'utils/nick';

// convert hex color to RGB (BMP format)
export const hexToRgb = hex => {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

// convert the color palette to BMP-compatible format (RGBA)
export const convertToBMPColorTable = colors => {
  const palette = new Uint8Array(256 * 4); // 256 colors * 4 bytes (Blue, Green, Red, Reserved)
  colors.forEach((hex, i) => {
    const rgb = hexToRgb(hex);
    palette[i * 4] = rgb[2]; // Blue
    palette[i * 4 + 1] = rgb[1]; // Green
    palette[i * 4 + 2] = rgb[0]; // Red
    palette[i * 4 + 3] = 0x00; // Reserved
  });

  return palette;
};

// flood fill algorithm
export const floodFill = (canvas, x, y, targetColor, fillColor) => {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  // Convert target color to RGBA array
  const targetR = targetColor[0];
  const targetG = targetColor[1];
  const targetB = targetColor[2];
  const targetA = targetColor[3] || 255;

  // Convert fill color to RGBA array
  const fillR = fillColor[0];
  const fillG = fillColor[1];
  const fillB = fillColor[2];
  const fillA = fillColor[3] || 255;

  // Check if target and fill colors are the same
  if (
    targetR === fillR &&
    targetG === fillG &&
    targetB === fillB &&
    targetA === fillA
  ) {
    return;
  }

  // Get the color at the starting point
  const startIndex = (y * width + x) * 4;
  const startR = data[startIndex];
  const startG = data[startIndex + 1];
  const startB = data[startIndex + 2];
  const startA = data[startIndex + 3];

  // If starting color doesn't match target color, return
  if (
    startR !== targetR ||
    startG !== targetG ||
    startB !== targetB ||
    startA !== targetA
  ) {
    return;
  }

  // Stack for flood fill
  const stack = [{ x, y }];
  const visited = new Set();

  while (stack.length > 0) {
    const { x: currentX, y: currentY } = stack.pop();
    const key = `${currentX},${currentY}`;

    if (
      visited.has(key) ||
      currentX < 0 ||
      currentX >= width ||
      currentY < 0 ||
      currentY >= height
    ) {
      continue;
    }

    const index = (currentY * width + currentX) * 4;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const a = data[index + 3];

    if (r !== targetR || g !== targetG || b !== targetB || a !== targetA) {
      continue;
    }

    visited.add(key);

    // Set the fill color
    data[index] = fillR;
    data[index + 1] = fillG;
    data[index + 2] = fillB;
    data[index + 3] = fillA;

    // Add neighboring pixels to stack
    stack.push(
      { x: currentX + 1, y: currentY },
      { x: currentX - 1, y: currentY },
      { x: currentX, y: currentY + 1 },
      { x: currentX, y: currentY - 1 },
    );
  }

  // Put the modified image data back
  ctx.putImageData(imageData, 0, 0);
};

export const downloadBmp = canvas => {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const width = 149;
  const height = 101;
  const rowSize = Math.ceil(width / 4) * 4; // Padded row size
  const pixelArraySize = rowSize * height;

  const header = new ArrayBuffer(1078 + pixelArraySize + 2); // Full BMP file
  const view = new DataView(header);

  // BMP Header
  view.setUint8(0, 'B'.charCodeAt(0));
  view.setUint8(1, 'M'.charCodeAt(0));
  view.setUint32(2, 1078 + pixelArraySize, true); // File size
  view.setUint32(10, 1078, true); // Pixel array offset

  // DIB Header
  view.setUint32(14, 40, true); // Header size
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true); // Planes
  view.setUint16(28, 8, true); // Bits per pixel
  view.setUint32(30, 0, true); // Compression
  view.setUint32(34, pixelArraySize, true); // Image size
  view.setUint32(38, 45074, true); // X pixels per meter
  view.setUint32(42, 45074, true); // Y pixels per meter
  view.setUint32(46, 256, true); // Colors in palette
  view.setUint32(50, 0, true); // Important colors

  // color Table (Custom Palette)
  const bmpPalette = convertToBMPColorTable(colors);
  for (let i = 0; i < 256; i++) {
    const baseIndex = 54 + i * 4; // Start of palette in BMP header
    view.setUint8(baseIndex, bmpPalette[i * 4]); // Blue
    view.setUint8(baseIndex + 1, bmpPalette[i * 4 + 1]); // Green
    view.setUint8(baseIndex + 2, bmpPalette[i * 4 + 2]); // Red
    view.setUint8(baseIndex + 3, bmpPalette[i * 4 + 3]); // Reserved
  }

  // pixel Array (Use palette indices)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const canvasY = height - 1 - y; // BMP is bottom-up
      const pixelIndex = canvasY * width + x;

      // get canvas pixel data (RGB)
      const r = imageData.data[pixelIndex * 4];
      const g = imageData.data[pixelIndex * 4 + 1];
      const b = imageData.data[pixelIndex * 4 + 2];

      // find the closest matching palette index
      let paletteIndex = -1;
      for (let i = 0; i < 256; i++) {
        const paletteR = bmpPalette[i * 4 + 2]; // Red
        const paletteG = bmpPalette[i * 4 + 1]; // Green
        const paletteB = bmpPalette[i * 4]; // Blue
        if (paletteR === r && paletteG === g && paletteB === b) {
          paletteIndex = i;
          break;
        }
      }

      // if no match, default to 0 (black)
      view.setUint8(
        1078 + y * rowSize + x,
        paletteIndex === -1 ? 0 : paletteIndex,
      );
    }
  }

  // optional padding
  view.setUint8(1078 + pixelArraySize, 0);
  view.setUint8(1078 + pixelArraySize + 1, 0);

  // create and download the file
  const blob = new Blob([header], { type: 'image/bmp' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = nick() ? `${nick()}.bmp` : 'shirt.bmp';
  link.click();
};

// available font options
export const fontOptions = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Tahoma', label: 'Tahoma' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
];

const DefaultLGRPalette = new Uint8Array([
  0, 0, 0, 120, 48, 0, 32, 0, 0, 180, 196, 172, 156, 0, 0, 164, 0, 0, 96, 96,
  56, 0, 8, 8, 8, 0, 8, 56, 0, 0, 104, 96, 104, 96, 104, 104, 156, 24, 8, 80, 8,
  72, 244, 112, 0, 80, 0, 0, 156, 40, 8, 180, 0, 0, 156, 40, 0, 120, 0, 0, 136,
  64, 16, 156, 16, 8, 40, 8, 0, 0, 128, 8, 0, 128, 0, 244, 228, 16, 128, 0, 0,
  56, 48, 48, 32, 32, 48, 0, 96, 0, 188, 204, 188, 0, 0, 48, 136, 40, 0, 64, 24,
  8, 180, 196, 180, 56, 16, 0, 40, 112, 180, 196, 96, 16, 0, 8, 0, 136, 180,
  212, 0, 104, 0, 104, 40, 0, 156, 104, 8, 136, 24, 0, 156, 156, 72, 220, 228,
  220, 0, 96, 8, 96, 0, 0, 128, 128, 128, 136, 136, 96, 120, 128, 148, 72, 64,
  32, 0, 212, 24, 96, 96, 96, 104, 96, 96, 148, 48, 0, 136, 48, 196, 120, 32, 0,
  156, 156, 96, 136, 156, 80, 136, 164, 204, 0, 48, 120, 0, 80, 0, 48, 156, 48,
  104, 112, 96, 72, 72, 72, 104, 112, 112, 188, 196, 180, 252, 112, 0, 0, 128,
  24, 96, 148, 196, 96, 148, 204, 96, 148, 148, 16, 96, 172, 164, 64, 8, 148,
  180, 212, 196, 0, 0, 0, 48, 0, 148, 0, 0, 172, 0, 0, 136, 48, 0, 0, 32, 0, 64,
  16, 0, 180, 188, 188, 0, 136, 8, 72, 96, 72, 0, 172, 0, 148, 16, 196, 244,
  212, 16, 120, 48, 16, 148, 40, 0, 196, 0, 8, 128, 128, 148, 148, 16, 0, 24, 8,
  0, 80, 24, 0, 8, 8, 80, 16, 56, 24, 180, 180, 172, 24, 96, 172, 156, 32, 136,
  56, 8, 0, 40, 56, 64, 128, 48, 8, 120, 164, 204, 120, 164, 112, 16, 0, 0, 188,
  180, 64, 236, 188, 56, 32, 32, 32, 164, 180, 172, 0, 120, 8, 80, 80, 80, 0,
  120, 0, 136, 0, 0, 24, 96, 180, 0, 120, 16, 104, 156, 204, 16, 112, 0, 104,
  156, 180, 204, 220, 196, 16, 112, 16, 88, 8, 0, 104, 0, 8, 8, 112, 0, 0, 112,
  8, 88, 0, 0, 72, 40, 0, 0, 112, 0, 104, 104, 96, 8, 96, 0, 104, 120, 120, 196,
  8, 8, 56, 64, 64, 0, 64, 0, 148, 104, 96, 56, 64, 32, 96, 0, 164, 228, 96, 8,
  16, 16, 8, 16, 16, 16, 32, 104, 180, 112, 156, 204, 180, 156, 48, 16, 24, 16,
  148, 16, 204, 32, 0, 8, 148, 56, 8, 24, 16, 72, 80, 136, 196, 80, 88, 88, 56,
  120, 188, 120, 16, 0, 64, 128, 188, 72, 128, 188, 148, 188, 212, 48, 136, 40,
  48, 120, 188, 120, 32, 8, 120, 8, 0, 80, 80, 56, 72, 0, 0, 64, 64, 64, 96, 96,
  88, 136, 24, 8, 16, 32, 8, 40, 0, 0, 72, 80, 64, 40, 48, 40, 16, 120, 8, 48,
  104, 188, 0, 16, 8, 88, 136, 196, 156, 8, 0, 96, 128, 80, 120, 120, 120, 72,
  136, 196, 56, 24, 0, 180, 8, 8, 120, 120, 72, 120, 96, 32, 8, 180, 8, 72, 128,
  196, 136, 72, 32, 0, 112, 32, 24, 104, 180, 88, 24, 16, 96, 64, 24, 188, 204,
  180, 136, 136, 148, 48, 112, 180, 24, 24, 24, 16, 56, 0, 120, 172, 204, 8, 16,
  24, 80, 212, 40, 104, 212, 244, 0, 96, 204, 104, 48, 16, 96, 96, 204, 104, 0,
  0, 80, 136, 188, 164, 156, 164, 148, 0, 80, 188, 32, 48, 8, 88, 172, 32, 112,
  24, 56, 72, 56, 0, 80, 172, 252, 164, 32, 220, 164, 24, 16, 96, 112, 8, 88,
  180, 32, 24, 24, 136, 252, 0, 40, 112, 188, 120, 136, 128, 236, 220, 72, 32,
  40, 64, 120, 48, 8, 104, 164, 196, 244, 164, 120, 236, 156, 120, 120, 64, 16,
  188, 16, 8, 96, 24, 0, 40, 16, 8, 64, 120, 188, 0, 16, 0, 64, 212, 24, 72,
  228, 8, 56, 40, 212, 32, 228, 40, 104, 148, 196, 0, 88, 172, 16, 128, 16, 196,
  204, 196, 8, 80, 16, 220, 244, 220, 236, 16, 48, 40, 16, 0, 40, 104, 180, 120,
  156, 220, 88, 16, 212, 48, 48, 80, 88, 148, 196, 220, 0, 0, 212, 212, 212, 0,
  8, 156, 0, 148, 196, 88, 80, 80, 72, 220, 40, 16, 80, 172, 228, 128, 96, 204,
  64, 24, 252, 252, 252,
]);

// convert DefaultLGRPalette to array of hex colors
export const convertDefaultLGRPaletteToHex = () => {
  const hexColors = [];
  for (let i = 0; i < DefaultLGRPalette.length; i += 3) {
    const r = DefaultLGRPalette[i];
    const g = DefaultLGRPalette[i + 1];
    const b = DefaultLGRPalette[i + 2];
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    hexColors.push(hex);
  }
  return hexColors;
};

export const colors = convertDefaultLGRPaletteToHex();

// convert hex to HSL for sorting
const hexToHsl = hex => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

// sort colors by hue (rainbow pattern)
export const sortColorsByRainbow = colors => {
  return colors
    .map(color => ({ color, hsl: hexToHsl(color) }))
    .sort((a, b) => {
      const aHsl = a.hsl;
      const bHsl = b.hsl;
      // handle grayscale colors (low saturation) - put them at the end
      const aIsGray = aHsl.s < 10;
      const bIsGray = bHsl.s < 10;
      if (aIsGray && !bIsGray) return 1;
      if (!aIsGray && bIsGray) return -1;
      if (aIsGray && bIsGray) {
        // sort grays by lightness (dark to light)
        return aHsl.l - bHsl.l;
      }
      // for colored pixels, sort by hue with some tolerance
      const hueDiff = Math.abs(aHsl.h - bHsl.h);
      // if hues are very close (within 15 degrees), sort by saturation then lightness
      if (hueDiff < 15 || hueDiff > 345) {
        // handle wraparound (red-purple transition)
        if (Math.abs(aHsl.s - bHsl.s) > 5) {
          return bHsl.s - aHsl.s; // higher saturation first
        }
        return aHsl.l - bHsl.l; // lower lightness first
      }
      // otherwise sort by hue
      return aHsl.h - bHsl.h;
    })
    .map(item => item.color);
};

export const colorsRainbow = sortColorsByRainbow(
  convertDefaultLGRPaletteToHex(),
);

// Color quantization function to convert image to use only palette colors
export const quantizeImageToPalette = (imageData, palette) => {
  const data = imageData.data;
  const quantizedData = new Uint8ClampedArray(data.length);

  // Convert palette colors to RGB arrays for comparison
  const paletteRgb = palette.map(hex => hexToRgb(hex));

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // If pixel is transparent, keep it transparent
    if (a === 0 || (r === 255 && g === 255 && b === 255)) {
      quantizedData[i] = 0;
      quantizedData[i + 1] = 0;
      quantizedData[i + 2] = 0;
      quantizedData[i + 3] = 0;
      continue;
    }

    // Find the closest color in the palette
    let closestColor = paletteRgb[0];
    let minDistance = Infinity;

    for (const paletteColor of paletteRgb) {
      const distance = Math.sqrt(
        Math.pow(r - paletteColor[0], 2) +
          Math.pow(g - paletteColor[1], 2) +
          Math.pow(b - paletteColor[2], 2),
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestColor = paletteColor;
      }
    }

    quantizedData[i] = closestColor[0]; // R
    quantizedData[i + 1] = closestColor[1]; // G
    quantizedData[i + 2] = closestColor[2]; // B
    quantizedData[i + 3] = a; // A
  }

  return new ImageData(quantizedData, imageData.width, imageData.height);
};

// Load and quantize an image to use only palette colors
export const loadAndQuantizeImage = (imageSrc, palette, canvas) => {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');

      // Create a temporary canvas to get image data
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;

      // Draw the image to the temporary canvas
      tempCtx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Get the image data
      const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);

      // Quantize the image data to use only palette colors
      const quantizedData = quantizeImageToPalette(imageData, palette);

      // Draw the quantized image to the main canvas
      ctx.putImageData(quantizedData, 0, 0);

      resolve();
    };
    img.src = imageSrc;
  });
};
