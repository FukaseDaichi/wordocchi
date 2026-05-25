import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { deflateSync } from "node:zlib";

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const colors = {
  cream: [255, 248, 231, 255],
  panel: [255, 251, 240, 255],
  ink: [61, 46, 31, 255],
  leaf: [91, 168, 74, 255],
  sun: [255, 203, 71, 255],
  rose: [227, 107, 107, 255],
  sky: [107, 184, 219, 255],
  white: [255, 255, 255, 255],
};

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let c = index;

  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }

  return c >>> 0;
});

writePng("public/icons/icon-192.png", drawIcon(192, false));
writePng("public/icons/icon-512.png", drawIcon(512, false));
writePng("public/icons/maskable-512.png", drawIcon(512, true));
writePng("public/og-image.png", drawOgImage(1200, 630));

function drawIcon(size, maskable) {
  const image = createImage(size, size, colors.cream);
  const margin = Math.round(size * (maskable ? 0.15 : 0.08));
  const radius = Math.round(size * 0.18);

  drawRoundedRect(image, margin, margin, size - margin * 2, size - margin * 2, radius, colors.panel);
  drawCircle(image, size * 0.33, size * 0.36, size * 0.15, colors.sun);
  drawCircle(image, size * 0.63, size * 0.34, size * 0.13, colors.sky);
  drawCircle(image, size * 0.5, size * 0.6, size * 0.2, colors.leaf);
  drawCircle(image, size * 0.67, size * 0.66, size * 0.11, colors.rose);

  drawRoundedRect(
    image,
    size * 0.27,
    size * 0.73,
    size * 0.46,
    size * 0.07,
    size * 0.035,
    colors.ink,
  );

  return image;
}

function drawOgImage(width, height) {
  const image = createImage(width, height, colors.cream);
  drawCircle(image, 170, 130, 120, [255, 203, 71, 80]);
  drawCircle(image, 1020, 140, 145, [107, 184, 219, 70]);
  drawCircle(image, 640, 620, 240, [91, 168, 74, 55]);
  drawCircle(image, 350, 500, 120, [227, 107, 107, 50]);
  drawRoundedRect(image, 260, 140, 680, 350, 38, colors.panel);
  drawCircle(image, 440, 305, 88, colors.sun);
  drawCircle(image, 600, 305, 88, colors.leaf);
  drawCircle(image, 760, 305, 88, colors.sky);
  drawRoundedRect(image, 400, 420, 400, 28, 14, colors.ink);
  return image;
}

function createImage(width, height, fill) {
  const data = Buffer.alloc(width * height * 4);

  for (let offset = 0; offset < data.length; offset += 4) {
    data[offset] = fill[0];
    data[offset + 1] = fill[1];
    data[offset + 2] = fill[2];
    data[offset + 3] = fill[3];
  }

  return { width, height, data };
}

function drawCircle(image, cx, cy, radius, color) {
  const minX = Math.max(0, Math.floor(cx - radius));
  const maxX = Math.min(image.width - 1, Math.ceil(cx + radius));
  const minY = Math.max(0, Math.floor(cy - radius));
  const maxY = Math.min(image.height - 1, Math.ceil(cy + radius));
  const radiusSquared = radius * radius;

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = x - cx;
      const dy = y - cy;

      if (dx * dx + dy * dy <= radiusSquared) {
        blendPixel(image, x, y, color);
      }
    }
  }
}

function drawRoundedRect(image, x, y, width, height, radius, color) {
  const left = Math.round(x);
  const top = Math.round(y);
  const right = Math.round(x + width);
  const bottom = Math.round(y + height);
  const safeRadius = Math.max(0, Math.round(radius));

  for (let py = top; py < bottom; py += 1) {
    for (let px = left; px < right; px += 1) {
      const cx = px < left + safeRadius ? left + safeRadius : px > right - safeRadius ? right - safeRadius : px;
      const cy = py < top + safeRadius ? top + safeRadius : py > bottom - safeRadius ? bottom - safeRadius : py;
      const dx = px - cx;
      const dy = py - cy;

      if (dx * dx + dy * dy <= safeRadius * safeRadius) {
        blendPixel(image, px, py, color);
      }
    }
  }
}

function blendPixel(image, x, y, color) {
  if (x < 0 || y < 0 || x >= image.width || y >= image.height) {
    return;
  }

  const offset = (Math.floor(y) * image.width + Math.floor(x)) * 4;
  const alpha = color[3] / 255;
  const inverse = 1 - alpha;

  image.data[offset] = Math.round(color[0] * alpha + image.data[offset] * inverse);
  image.data[offset + 1] = Math.round(color[1] * alpha + image.data[offset + 1] * inverse);
  image.data[offset + 2] = Math.round(color[2] * alpha + image.data[offset + 2] * inverse);
  image.data[offset + 3] = 255;
}

function writePng(path, image) {
  mkdirSync(dirname(path), { recursive: true });
  const scanlines = Buffer.alloc((image.width * 4 + 1) * image.height);

  for (let y = 0; y < image.height; y += 1) {
    const sourceStart = y * image.width * 4;
    const targetStart = y * (image.width * 4 + 1);
    scanlines[targetStart] = 0;
    image.data.copy(scanlines, targetStart + 1, sourceStart, sourceStart + image.width * 4);
  }

  const png = Buffer.concat([
    PNG_SIGNATURE,
    chunk("IHDR", createIhdr(image.width, image.height)),
    chunk("IDAT", deflateSync(scanlines, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);

  writeFileSync(path, png);
}

function createIhdr(width, height) {
  const buffer = Buffer.alloc(13);
  buffer.writeUInt32BE(width, 0);
  buffer.writeUInt32BE(height, 4);
  buffer[8] = 8;
  buffer[9] = 6;
  buffer[10] = 0;
  buffer[11] = 0;
  buffer[12] = 0;
  return buffer;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const lengthBuffer = Buffer.alloc(4);
  const crcBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32BE(data.length, 0);
  crcBuffer.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([lengthBuffer, typeBuffer, data, crcBuffer]);
}

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}
