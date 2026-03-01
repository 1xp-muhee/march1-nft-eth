const fs = require('fs');
const path = require('path');

const outAssets = path.join(__dirname, '..', 'assets');
const outMeta = path.join(__dirname, '..', 'metadata');
if (!fs.existsSync(outAssets)) fs.mkdirSync(outAssets, { recursive: true });
if (!fs.existsSync(outMeta)) fs.mkdirSync(outMeta, { recursive: true });

const bgColors = ['#f8fafc','#eef2ff','#f1f5f9','#fff7ed','#fef2f2'];
const accents = ['#ef4444','#2563eb','#0ea5e9','#111827','#334155'];

function svg(id){
  const bg = bgColors[id % bgColors.length];
  const ac = accents[id % accents.length];
  const seed = (id * 7919) % 99991;
  const cx = 180 + (seed % 40);
  const cy = 190 + (seed % 30);
  const wave = 8 + (seed % 6);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="${bg}"/>
  <circle cx="512" cy="512" r="360" fill="#ffffff" stroke="#e5e7eb" stroke-width="4"/>
  <path d="M512 370c80 0 145 65 145 145s-65 145-145 145V370z" fill="#dc2626"/>
  <path d="M512 660c-80 0-145-65-145-145s65-145 145-145v290z" fill="#2563eb"/>
  <rect x="300" y="250" width="32" height="220" rx="8" fill="#111827"/>
  <rect x="356" y="250" width="32" height="220" rx="8" fill="#111827"/>
  <rect x="412" y="250" width="32" height="220" rx="8" fill="#111827"/>
  <rect x="580" y="550" width="32" height="220" rx="8" fill="#111827"/>
  <rect x="636" y="550" width="32" height="220" rx="8" fill="#111827"/>
  <rect x="692" y="550" width="32" height="220" rx="8" fill="#111827"/>
  <path d="M180 ${cy} Q 512 ${cy-wave*3} 844 ${cy}" stroke="${ac}" stroke-width="5" fill="none" opacity="0.35"/>
  <text x="512" y="870" text-anchor="middle" font-size="44" font-family="Arial, sans-serif" fill="#0f172a">March 1st Spirit #${id}</text>
  <text x="512" y="920" text-anchor="middle" font-size="24" font-family="Arial, sans-serif" fill="#475569">대한독립 만세 · 3.1절 기념 컬렉션</text>
</svg>`;
}

for(let i=1;i<=100;i++){
  const s = svg(i);
  fs.writeFileSync(path.join(outAssets, `${i}.svg`), s, 'utf8');
  const meta = {
    name: `March 1st Spirit #${i}`,
    description: 'Korean March 1st Independence Movement commemorative NFT collection (educational/art project).',
    image: `./assets/${i}.svg`,
    attributes: [
      { trait_type: 'Theme', value: '3.1절' },
      { trait_type: 'Edition', value: i },
      { trait_type: 'Collection Size', value: 100 }
    ]
  };
  fs.writeFileSync(path.join(outMeta, `${i}.json`), JSON.stringify(meta, null, 2));
}
console.log('Generated 100 SVG + metadata files');
