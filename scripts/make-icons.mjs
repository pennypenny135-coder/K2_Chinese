// 以純 Node 產生 PWA 圖示（熊貓頭像）— 無需任何外部套件
import zlib from "zlib";
import fs from "fs";

function crc32(buf) {
  let c, crc = ~0;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return ~crc >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
function png(size, pixel) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixel(x / size, y / size);
      const o = y * (size * 4 + 1) + 1 + x * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}
const inE = (x, y, cx, cy, rx, ry, rot = 0) => {
  const dx = x - cx, dy = y - cy, c = Math.cos(rot), s = Math.sin(rot);
  const u = dx * c + dy * s, v = -dx * s + dy * c;
  return (u * u) / (rx * rx) + (v * v) / (ry * ry) <= 1;
};
function sample(x, y) {
  // 背景：天空藍漸層
  let col = [56 + Math.round(y * 60), 189 - Math.round(y * 30), 248 - Math.round(y * 20), 255];
  if (y > 0.86) col = [74, 222, 128, 255];
  const ink = [43, 43, 58, 255], white = [255, 255, 255, 255], pink = [253, 164, 175, 255];
  if (inE(x, y, 0.27, 0.27, 0.11, 0.11) || inE(x, y, 0.73, 0.27, 0.11, 0.11)) col = ink;
  if (inE(x, y, 0.5, 0.55, 0.34, 0.31)) col = white;
  if (inE(x, y, 0.36, 0.52, 0.075, 0.1, 0.38) || inE(x, y, 0.64, 0.52, 0.075, 0.1, -0.38)) col = ink;
  if (inE(x, y, 0.365, 0.505, 0.03, 0.03) || inE(x, y, 0.635, 0.505, 0.03, 0.03)) col = white;
  if (inE(x, y, 0.5, 0.63, 0.05, 0.035)) col = ink;
  if (inE(x, y, 0.27, 0.66, 0.045, 0.04) || inE(x, y, 0.73, 0.66, 0.045, 0.04)) col = pink;
  // 笑口
  const mx = x - 0.5;
  const smileY = 0.69 + 0.035 * (1 - (mx / 0.09) * (mx / 0.09));
  if (Math.abs(mx) < 0.09 && Math.abs(y - smileY) < 0.011) col = ink;
  return col;
}
fs.mkdirSync("public", { recursive: true });
fs.writeFileSync("public/icon-192.png", png(192, sample));
fs.writeFileSync("public/icon-512.png", png(512, sample));
fs.writeFileSync("public/apple-touch-icon.png", png(180, sample));
console.log("icons done");
