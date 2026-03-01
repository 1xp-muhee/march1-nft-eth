const fs = require('fs');
const path = require('path');

const outAssets = path.join(__dirname, '..', 'assets');
const outMeta = path.join(__dirname, '..', 'metadata');
if (!fs.existsSync(outAssets)) fs.mkdirSync(outAssets, { recursive: true });
if (!fs.existsSync(outMeta)) fs.mkdirSync(outMeta, { recursive: true });

const palettes = [
  ['#0b1020', '#1d4ed8', '#ef4444', '#f8fafc', '#111827'],
  ['#111827', '#2563eb', '#fb7185', '#fef3c7', '#e5e7eb'],
  ['#0f172a', '#0ea5e9', '#f97316', '#ecfeff', '#f8fafc'],
  ['#1e1b4b', '#22c55e', '#ef4444', '#f1f5f9', '#fef2f2'],
  ['#172554', '#38bdf8', '#dc2626', '#ffffff', '#e2e8f0'],
  ['#020617', '#6366f1', '#f43f5e', '#f8fafc', '#cbd5e1']
];

const bgStyles = ['radial', 'stripes', 'grid', 'waves', 'sunburst'];
const badgeShapes = ['circle', 'hex', 'diamond', 'shield', 'medal'];
const symbolSets = [
  ['✦','✶','✺','✹','✷'],
  ['▣','▤','▥','▦','▧'],
  ['▲','◆','●','■','⬢'],
  ['⟡','⬟','⬢','✪','✺'],
  ['☼','☾','✸','✹','✦']
];

function seeded(n) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return ((x >>> 0) / 4294967295);
  };
}

function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

function bgSvg(style, p, rng) {
  const [base, c1, c2, light, mid] = p;
  if (style === 'radial') {
    return `
      <defs>
        <radialGradient id="g" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stop-color="${light}"/>
          <stop offset="65%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${base}"/>
        </radialGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#g)"/>
    `;
  }
  if (style === 'stripes') {
    let lines = '';
    for (let i = -4; i < 24; i++) {
      const x = i * 64;
      const color = i % 2 ? c1 : mid;
      lines += `<rect x="${x}" y="-80" width="36" height="1200" transform="rotate(20 512 512)" fill="${color}" opacity="0.28"/>`;
    }
    return `<rect width="1024" height="1024" fill="${base}"/>${lines}`;
  }
  if (style === 'grid') {
    let g = `<rect width="1024" height="1024" fill="${base}"/>`;
    for (let i=0;i<=16;i++) {
      const pos = i*64;
      g += `<line x1="${pos}" y1="0" x2="${pos}" y2="1024" stroke="${c1}" opacity="0.18"/>`;
      g += `<line x1="0" y1="${pos}" x2="1024" y2="${pos}" stroke="${mid}" opacity="0.14"/>`;
    }
    return g;
  }
  if (style === 'waves') {
    let w = `<rect width="1024" height="1024" fill="${base}"/>`;
    for (let i=0;i<10;i++) {
      const y = 120 + i*92;
      const amp = 18 + Math.floor(rng()*30);
      const col = i%2?c1:c2;
      w += `<path d="M-40 ${y} Q 256 ${y-amp} 512 ${y} T 1064 ${y}" stroke="${col}" stroke-width="${10 + i%3*2}" fill="none" opacity="0.35"/>`;
    }
    return w;
  }
  // sunburst
  let s = `<rect width="1024" height="1024" fill="${base}"/>`;
  for (let i=0;i<28;i++) {
    const a = i * (360/28);
    const col = i%2?c1:c2;
    s += `<rect x="500" y="80" width="24" height="430" fill="${col}" opacity="0.23" transform="rotate(${a} 512 512)"/>`;
  }
  s += `<circle cx="512" cy="512" r="190" fill="${light}" opacity="0.2"/>`;
  return s;
}

function badge(shape, p, rng) {
  const [base, c1, c2, light, mid] = p;
  if (shape === 'circle') return `<circle cx="512" cy="512" r="330" fill="${light}" stroke="${mid}" stroke-width="6"/>`;
  if (shape === 'hex') return `<polygon points="512,170 780,330 780,690 512,850 244,690 244,330" fill="${light}" stroke="${mid}" stroke-width="6"/>`;
  if (shape === 'diamond') return `<polygon points="512,170 820,512 512,854 204,512" fill="${light}" stroke="${mid}" stroke-width="6"/>`;
  if (shape === 'shield') return `<path d="M512 170 L790 300 L735 650 Q700 790 512 860 Q324 790 289 650 L234 300 Z" fill="${light}" stroke="${mid}" stroke-width="6"/>`;
  return `<g><circle cx="512" cy="512" r="310" fill="${light}" stroke="${mid}" stroke-width="6"/><circle cx="512" cy="512" r="265" fill="none" stroke="${c1}" opacity="0.35" stroke-width="8"/></g>`;
}

function trigramVariant(v, color) {
  // abstract trigram placements/lengths
  const bars = [];
  const ox = 315 + (v%5)*8;
  const oy = 280 + ((v>>3)%5)*8;
  const len = 118 + (v%4)*12;
  const gap = 22;
  const t = 14;
  const types = [
    [1,1,1], [1,0,1], [0,1,0], [1,1,0], [0,1,1], [1,0,0], [0,0,1], [0,0,0]
  ][v % 8];
  for (let i=0;i<3;i++) {
    const y = oy + i*(t+gap);
    if (types[i]===1) bars.push(`<rect x="${ox}" y="${y}" width="${len}" height="${t}" rx="5" fill="${color}"/>`);
    else {
      const half = Math.floor((len-20)/2);
      bars.push(`<rect x="${ox}" y="${y}" width="${half}" height="${t}" rx="5" fill="${color}"/>`);
      bars.push(`<rect x="${ox+half+20}" y="${y}" width="${half}" height="${t}" rx="5" fill="${color}"/>`);
    }
  }
  return bars.join('');
}

for (let id=1; id<=100; id++) {
  const rng = seeded(id * 971);
  const palette = pick(rng, palettes);
  const bg = pick(rng, bgStyles);
  const shape = pick(rng, badgeShapes);
  const symbols = pick(rng, symbolSets);
  const [base, c1, c2, light, mid] = palette;

  const taegeukR = 118 + Math.floor(rng()*52);
  const rot = Math.floor(rng()*360);
  const yShift = -10 + Math.floor(rng()*20);
  const ring = 230 + Math.floor(rng()*90);
  const decoCount = 8 + Math.floor(rng()*8);

  let deco = '';
  for (let i=0;i<decoCount;i++) {
    const a = i*(360/decoCount) + Math.floor(rng()*18);
    const r = ring + Math.floor(rng()*44);
    const x = 512 + Math.cos(a*Math.PI/180)*r;
    const y = 512 + Math.sin(a*Math.PI/180)*r;
    const size = 20 + Math.floor(rng()*30);
    const sym = symbols[(i + id) % symbols.length];
    deco += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="${size}" fill="${i%2?c1:c2}" opacity="0.75">${sym}</text>`;
  }

  const v1 = Math.floor(rng()*1000), v2=Math.floor(rng()*1000);
  const v3 = Math.floor(rng()*1000), v4=Math.floor(rng()*1000);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  ${bgSvg(bg, palette, rng)}
  ${badge(shape, palette, rng)}

  <g transform="translate(512 ${512+yShift}) rotate(${rot})">
    <circle cx="0" cy="0" r="${taegeukR+10}" fill="${light}" opacity="0.22"/>
    <path d="M0 -${taegeukR} A ${taegeukR} ${taegeukR} 0 1 1 0 ${taegeukR} A ${taegeukR/2} ${taegeukR/2} 0 1 0 0 -${taegeukR}" fill="${c2}"/>
    <path d="M0 ${taegeukR} A ${taegeukR} ${taegeukR} 0 1 1 0 -${taegeukR} A ${taegeukR/2} ${taegeukR/2} 0 1 0 0 ${taegeukR}" fill="${c1}"/>
  </g>

  <g opacity="0.94">
    <g transform="rotate(-23 512 512)">${trigramVariant(v1, '#111827')}</g>
    <g transform="translate(380 0) rotate(23 512 512)">${trigramVariant(v2, '#111827')}</g>
    <g transform="translate(0 380) rotate(23 512 512)">${trigramVariant(v3, '#111827')}</g>
    <g transform="translate(380 380) rotate(-23 512 512)">${trigramVariant(v4, '#111827')}</g>
  </g>

  ${deco}

  <text x="512" y="900" text-anchor="middle" font-size="38" font-family="Inter, Arial, sans-serif" fill="${light}">March 1st Spirit #${id}</text>
  <text x="512" y="942" text-anchor="middle" font-size="22" font-family="Inter, Arial, sans-serif" fill="${mid}">대한독립 만세 · Unique Edition</text>
</svg>`;

  fs.writeFileSync(path.join(outAssets, `${id}.svg`), svg, 'utf8');

  const metadata = {
    name: `March 1st Spirit #${id}`,
    description: 'Korean March 1st Independence Movement commemorative generative NFT collection.',
    image: `./assets/${id}.svg`,
    attributes: [
      { trait_type: 'Theme', value: '3.1절' },
      { trait_type: 'Background', value: bg },
      { trait_type: 'Badge', value: shape },
      { trait_type: 'Palette', value: palettes.indexOf(palette) + 1 },
      { trait_type: 'Rotation', value: rot },
      { trait_type: 'Edition', value: id }
    ]
  };
  fs.writeFileSync(path.join(outMeta, `${id}.json`), JSON.stringify(metadata, null, 2));
}

console.log('✅ Generated 100 visibly distinct NFTs');
