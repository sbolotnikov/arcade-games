const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'assets/app-icon-source.png');

async function main() {
  for (const size of [16, 32, 36, 48, 72, 96, 128, 144, 152, 180, 192, 384, 512]) {
    const name = size === 180 ? 'apple-touch-icon.png' : `${size <= 32 ? 'favicon' : 'icon'}-${size}x${size}.png`;
    await sharp(source).resize(size, size).png().toFile(path.join(root, 'public', name));
  }
  // Keep the original circular badge within the central 80% maskable safe circle.
  for (const size of [192, 512]) {
    const inner = Math.round(size * 0.76);
    const inset = Math.floor((size - inner) / 2);
    const badge = await sharp(source).resize(inner, inner).png().toBuffer();
    await sharp({ create: { width: size, height: size, channels: 3, background: '#0f172a' } })
      .composite([{ input: badge, left: inset, top: inset }]).png()
      .toFile(path.join(root, 'public', `icon-maskable-${size}x${size}.png`));
  }
  await fs.copyFile(path.join(root, 'public/icon-512x512.png'), path.join(root, 'app/icon.png'));
  await fs.copyFile(path.join(root, 'public/apple-touch-icon.png'), path.join(root, 'app/apple-icon.png'));

  // ICO supports embedded PNGs; include native sizes rather than stretching one small image.
  const sizes = [16, 32, 48, 256];
  const images = await Promise.all(sizes.map(size => sharp(source).resize(size, size).png().toBuffer()));
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  images.forEach((image, i) => {
    const entry = 6 + i * 16;
    header[entry] = header[entry + 1] = sizes[i] % 256;
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(image.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += image.length;
  });
  await fs.writeFile(path.join(root, 'app/favicon.ico'), Buffer.concat([header, ...images]));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
