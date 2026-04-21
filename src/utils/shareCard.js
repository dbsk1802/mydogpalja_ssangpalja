import { BREED_IMAGE } from './breeds';

const W = 1080, H = 1920;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

function wrapText(ctx, text, maxW) {
  const chars = [...text];
  let line = '', lines = [];
  for (const ch of chars) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxW) { lines.push(line); line = ch; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawStar(ctx, cx, cy, spikes, outerR, innerR, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR); rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR); rot += step;
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawHeart(ctx, x, y, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(x, y - size * 0.5, x - size, y - size * 0.5, x - size, y + size * 0.3);
  ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.5, x, y + size * 2);
  ctx.bezierCurveTo(x, y + size * 1.5, x + size, y + size, x + size, y + size * 0.3);
  ctx.bezierCurveTo(x + size, y - size * 0.5, x, y - size * 0.5, x, y + size * 0.3);
  ctx.fill();
  ctx.restore();
}

// ─── 6가지 테마 정의 ───────────────────────────────────────
const THEMES = [

  // 1. 따뜻한 햇살 (Warm Sunny)
  {
    name: 'warm',
    drawBg(ctx) {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#fff8dc'); g.addColorStop(0.5, '#ffe08a'); g.addColorStop(1, '#ffc84a');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // Decorations
      [[150,200],[950,150],[100,750],[1000,650],[200,1600],[900,1700]].forEach(([x,y]) => {
        drawStar(ctx, x, y, 5, 22, 9, '#ffd700', 0.65);
      });
      for (let i = 0; i < 35; i++) {
        ctx.fillStyle = `rgba(255,180,0,${Math.random()*0.2+0.05})`;
        ctx.beginPath(); ctx.arc(Math.random()*W, Math.random()*H, Math.random()*6+2, 0, Math.PI*2); ctx.fill();
      }
    },
    circleFill: '#fff8e8',
    circleBorder: '#f4a800',
    circleGlow: 'rgba(255,200,0,0.45)',
    cardBg: 'rgba(255,255,255,0.45)',
    cardBorder: 'rgba(255,180,0,0.3)',
    titleColor: '#a05c00',
    quoteLabel: '#c07800',
    quoteText: '#5a3000',
    quoteSub: '#7a4a00',
    luckBg: 'rgba(255,200,0,0.18)',
    luckBorder: '#f4a800',
    luckText: '#7a4f00',
    brand: 'rgba(120,70,0,0.35)',
  },

  // 2. 별빛 밤하늘 (Starry Night)
  {
    name: 'starry',
    drawBg(ctx) {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#12033a'); g.addColorStop(0.5, '#1e0a55'); g.addColorStop(1, '#080d30');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 110; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.8+0.1})`;
        ctx.beginPath(); ctx.arc(Math.random()*W, Math.random()*H, Math.random()*2+0.3, 0, Math.PI*2); ctx.fill();
      }
      [[100,250],[970,180],[60,900],[1020,800],[160,1550],[920,1630]].forEach(([x,y]) => {
        drawStar(ctx, x, y, 5, 26, 10, '#ffe566', 0.85);
      });
      const g2 = ctx.createRadialGradient(W*0.5, H*0.35, 0, W*0.5, H*0.35, 420);
      g2.addColorStop(0, 'rgba(120,60,255,0.18)'); g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
    },
    circleFill: '#1a0a40',
    circleBorder: '#9b6dff',
    circleGlow: 'rgba(140,80,255,0.55)',
    cardBg: 'rgba(255,255,255,0.06)',
    cardBorder: 'rgba(155,109,255,0.3)',
    titleColor: '#c4a0ff',
    quoteLabel: '#a07eff',
    quoteText: '#f0e6ff',
    quoteSub: '#c4b0f5',
    luckBg: 'rgba(140,80,255,0.18)',
    luckBorder: '#9b6dff',
    luckText: '#d4b0ff',
    brand: 'rgba(196,176,245,0.3)',
  },

  // 3. 핑크 큐티 (Pink Cute)
  {
    name: 'pink',
    drawBg(ctx) {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#ffe0ec'); g.addColorStop(0.5, '#ffb3cb'); g.addColorStop(1, '#ff85a8');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      [[120,230],[960,160],[80,820],[1000,720],[200,1560],[880,1660]].forEach(([x,y]) => {
        drawHeart(ctx, x, y, 18, 'rgba(255,100,140,0.45)');
      });
      for (let i = 0; i < 22; i++) {
        drawStar(ctx, Math.random()*W, Math.random()*H, 5, 14, 6, 'rgba(255,200,220,0.55)', 1);
      }
    },
    circleFill: '#fff0f5',
    circleBorder: '#ff4d7d',
    circleGlow: 'rgba(255,100,140,0.45)',
    cardBg: 'rgba(255,255,255,0.4)',
    cardBorder: 'rgba(255,100,140,0.25)',
    titleColor: '#c0184a',
    quoteLabel: '#d4265a',
    quoteText: '#5c0f2a',
    quoteSub: '#8a2040',
    luckBg: 'rgba(255,100,140,0.18)',
    luckBorder: '#ff4d7d',
    luckText: '#8a0030',
    brand: 'rgba(160,20,60,0.3)',
  },

  // 4. 다크 미스틱 (Dark Mystic)
  {
    name: 'dark',
    drawBg(ctx) {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#0a0618'); g.addColorStop(0.5, '#12092e'); g.addColorStop(1, '#080c20');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 120; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.6+0.05})`;
        ctx.beginPath(); ctx.arc(Math.random()*W, Math.random()*H, Math.random()*1.8+0.2, 0, Math.PI*2); ctx.fill();
      }
      // Moon
      ctx.save();
      ctx.fillStyle = 'rgba(255,216,122,0.12)'; ctx.beginPath(); ctx.arc(900,140,95,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#0a0618'; ctx.beginPath(); ctx.arc(938,122,85,0,Math.PI*2); ctx.fill();
      ctx.restore();
      const g2 = ctx.createRadialGradient(W/2, H*0.34, 0, W/2, H*0.34, 380);
      g2.addColorStop(0, 'rgba(255,216,122,0.1)'); g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
    },
    circleFill: '#1a0e3a',
    circleBorder: '#ffd87a',
    circleGlow: 'rgba(255,216,122,0.5)',
    cardBg: 'rgba(255,255,255,0.05)',
    cardBorder: 'rgba(255,216,122,0.2)',
    titleColor: '#ffd87a',
    quoteLabel: '#ffd87a',
    quoteText: '#f0e6ff',
    quoteSub: '#c4b0f5',
    luckBg: 'rgba(255,216,122,0.1)',
    luckBorder: '#ffd87a',
    luckText: '#ffd87a',
    brand: 'rgba(196,176,245,0.3)',
  },

  // 5. 레인보우 에너지 (Rainbow Energy)
  {
    name: 'rainbow',
    drawBg(ctx) {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#ff6b6b'); g.addColorStop(0.25, '#ffd166');
      g.addColorStop(0.5, '#06d6a0'); g.addColorStop(0.75, '#118ab2'); g.addColorStop(1, '#7b2d8b');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fillRect(0, 0, W, H);
      [[100,190],[980,240],[80,620],[1000,560],[150,1420],[950,1510],[310,1760],[740,1810]].forEach(([x,y]) => {
        drawStar(ctx, x, y, 4, 32, 5, 'rgba(255,255,255,0.8)', 1);
      });
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.35+0.05})`;
        ctx.beginPath(); ctx.arc(Math.random()*W, Math.random()*H, Math.random()*5+1, 0, Math.PI*2); ctx.fill();
      }
    },
    circleFill: 'rgba(255,255,255,0.15)',
    circleBorder: '#ffffff',
    circleGlow: 'rgba(255,255,255,0.55)',
    cardBg: 'rgba(255,255,255,0.2)',
    cardBorder: 'rgba(255,255,255,0.4)',
    titleColor: '#ffffff',
    quoteLabel: 'rgba(255,255,255,0.9)',
    quoteText: '#ffffff',
    quoteSub: 'rgba(255,255,255,0.85)',
    luckBg: 'rgba(255,255,255,0.22)',
    luckBorder: 'rgba(255,255,255,0.7)',
    luckText: '#ffffff',
    brand: 'rgba(255,255,255,0.35)',
  },

  // 6. 소프트 미니멀 (Soft Minimal)
  {
    name: 'minimal',
    drawBg(ctx) {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#f8f4ff'); g.addColorStop(0.5, '#ede8ff'); g.addColorStop(1, '#ddd5ff');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // Dashed border
      ctx.save();
      ctx.setLineDash([22, 14]); ctx.strokeStyle = 'rgba(139,111,212,0.22)'; ctx.lineWidth = 5;
      roundRect(ctx, 44, 44, W-88, H-88, 54); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();
      [[80,80],[W-80,80],[80,H-80],[W-80,H-80]].forEach(([x,y]) => {
        drawStar(ctx, x, y, 6, 20, 8, 'rgba(139,111,212,0.3)', 1);
      });
      for (let i = 0; i < 28; i++) {
        ctx.fillStyle = `rgba(139,111,212,${Math.random()*0.12+0.04})`;
        ctx.beginPath(); ctx.arc(Math.random()*W, Math.random()*H, Math.random()*9+3, 0, Math.PI*2); ctx.fill();
      }
    },
    circleFill: '#ffffff',
    circleBorder: '#8b6fd4',
    circleGlow: 'rgba(139,111,212,0.35)',
    cardBg: 'rgba(255,255,255,0.55)',
    cardBorder: 'rgba(139,111,212,0.2)',
    titleColor: '#6b4fa8',
    quoteLabel: '#7b5fb8',
    quoteText: '#3a2a5a',
    quoteSub: '#5a4a7a',
    luckBg: 'rgba(139,111,212,0.1)',
    luckBorder: '#8b6fd4',
    luckText: '#5a3a8a',
    brand: 'rgba(107,79,168,0.3)',
  },
];

// ─── 메인 생성 함수 ───────────────────────────────────────
export async function generateShareCard({ dog, fortune, zodiac }) {
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];

  // 배경 + 장식
  theme.drawBg(ctx);

  // 강아지 이미지 로드
  const dogImgSrc = dog.profileImages?.[0] || BREED_IMAGE[dog.breed] || '/breeds/default.png';
  const dogImg = await loadImage(dogImgSrc);

  // ── 타이틀 ──
  ctx.font = `700 62px 'Noto Sans KR', sans-serif`;
  ctx.fillStyle = theme.titleColor;
  ctx.textAlign = 'center';
  ctx.fillText(`오늘의 '${dog.name}' 운세`, W / 2, 190);

  // ── 강아지 원형 프레임 ──
  const cx = W / 2, cy = 560, cr = 230;
  ctx.save();
  ctx.shadowColor = theme.circleGlow;
  ctx.shadowBlur = 55;
  ctx.strokeStyle = theme.circleBorder;
  ctx.lineWidth = 9;
  ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, cr - 5, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = theme.circleFill;
  ctx.fillRect(cx - cr, cy - cr, cr * 2, cr * 2);
  if (dogImg) {
    const s = (cr - 5) * 1.9;
    ctx.drawImage(dogImg, cx - s / 2, cy - s / 2, s, s);
  }
  ctx.restore();

  // ── 오늘의 한마디 박스 ──
  const boxY = 860, boxH = 330;
  ctx.save();
  roundRect(ctx, 80, boxY, W - 160, boxH, 36);
  ctx.fillStyle = theme.cardBg; ctx.fill();
  ctx.strokeStyle = theme.cardBorder; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();

  ctx.font = `400 38px 'Noto Sans KR', sans-serif`;
  ctx.fillStyle = theme.quoteLabel;
  ctx.textAlign = 'center';
  ctx.fillText('오늘의 한마디', W / 2, boxY + 62);

  ctx.font = `700 56px 'Noto Sans KR', sans-serif`;
  ctx.fillStyle = theme.quoteText;
  const mainLines = wrapText(ctx, fortune.overall, W - 200);
  mainLines.slice(0, 2).forEach((l, i) => ctx.fillText(l, W / 2, boxY + 148 + i * 70));

  ctx.font = `300 40px 'Noto Sans KR', sans-serif`;
  ctx.fillStyle = theme.quoteSub;
  const subLines = wrapText(ctx, fortune.overall_sub, W - 220);
  subLines.slice(0, 1).forEach((l) => ctx.fillText(l, W / 2, boxY + 286));

  // ── 행운 아이템 박스 ──
  const luckY = 1270, luckH = 200;
  ctx.save();
  roundRect(ctx, 80, luckY, W - 160, luckH, 32);
  ctx.fillStyle = theme.luckBg; ctx.fill();
  ctx.strokeStyle = theme.luckBorder; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();

  ctx.font = `400 38px 'Noto Sans KR', sans-serif`;
  ctx.fillStyle = theme.luckText;
  ctx.textAlign = 'center';
  ctx.fillText('🍀 행운 아이템', W / 2, luckY + 68);

  ctx.font = `700 56px 'Noto Sans KR', sans-serif`;
  ctx.fillStyle = theme.luckText;
  ctx.fillText(`✨ ${fortune.lucky_item}`, W / 2, luckY + 152);

  // ── 브랜딩 ──
  ctx.font = `300 34px 'Noto Sans KR', sans-serif`;
  ctx.fillStyle = theme.brand;
  ctx.textAlign = 'center';
  ctx.fillText('🐾 독팔자 상팔자', W / 2, H - 80);

  return canvas.toDataURL('image/png');
}
