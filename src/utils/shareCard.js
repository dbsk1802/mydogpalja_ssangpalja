import { BREED_EMOJI } from './breeds';

export async function generateShareCard({ dog, fortune, zodiac }) {
  const canvas = document.createElement('canvas');
  const W = 1080, H = 1920;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0a0618';
  ctx.fillRect(0, 0, W, H);

  // Glow circles
  const drawGlow = (x, y, r, color) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  };
  drawGlow(W * 0.2, H * 0.15, 400, 'rgba(74,47,160,0.5)');
  drawGlow(W * 0.85, H * 0.7, 350, 'rgba(139,111,212,0.3)');
  drawGlow(W * 0.5, H * 0.5, 300, 'rgba(45,27,105,0.4)');

  // Stars
  ctx.fillStyle = 'rgba(240,232,255,0.7)';
  const stars = Array.from({length:80}, () => [Math.random()*W, Math.random()*H, Math.random()*2.5+0.5]);
  stars.forEach(([x,y,r]) => { ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); });

  // Top label
  ctx.font = `500 48px 'Noto Sans KR', sans-serif`;
  ctx.fillStyle = 'rgba(196,176,245,0.7)';
  ctx.textAlign = 'center';
  ctx.fillText('🐾 오늘의 강아지 운세', W/2, 140);

  // Date
  const today = new Date().toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'});
  ctx.font = `300 36px 'Noto Sans KR', sans-serif`;
  ctx.fillStyle = 'rgba(196,176,245,0.5)';
  ctx.fillText(today, W/2, 200);

  // Avatar circle
  ctx.save();
  ctx.shadowColor = 'rgba(139,111,212,0.8)';
  ctx.shadowBlur = 60;
  ctx.fillStyle = 'rgba(74,47,160,0.4)';
  ctx.beginPath(); ctx.arc(W/2, 420, 160, 0, Math.PI*2); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = 'rgba(196,176,245,0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(W/2, 420, 160, 0, Math.PI*2); ctx.stroke();

  ctx.font = '180px serif';
  ctx.textAlign = 'center';
  ctx.fillText(BREED_EMOJI[dog.breed] || '🐶', W/2, 490);

  // Name & zodiac
  ctx.font = `700 80px 'Noto Sans KR', sans-serif`;
  ctx.fillStyle = '#f0e8ff';
  ctx.fillText(dog.name, W/2, 650);
  if (zodiac) {
    ctx.font = `400 44px 'Noto Sans KR', sans-serif`;
    ctx.fillStyle = 'rgba(196,176,245,0.8)';
    ctx.fillText(`${zodiac.emoji} ${zodiac.name}`, W/2, 710);
  }

  // Overall fortune box
  ctx.save();
  roundRect(ctx, 80, 760, W - 160, 180, 30);
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  ctx.font = `700 56px 'Noto Sans KR', sans-serif`;
  ctx.fillStyle = '#ffd87a';
  ctx.fillText(fortune.overall, W/2, 850);
  ctx.font = `300 38px 'Noto Sans KR', sans-serif`;
  ctx.fillStyle = 'rgba(240,232,255,0.7)';
  ctx.fillText(fortune.overall_sub, W/2, 910);

  // Score bars
  const cats = [
    { label:'🍗 간식', score: fortune.snack.score, color:'#7fffd4' },
    { label:'🌿 산책', score: fortune.walk.score, color:'#8b6fd4' },
    { label:'💕 사랑', score: fortune.love.score, color:'#ff8fab' },
    { label:'😴 낮잠', score: fortune.nap.score, color:'#ffb347' },
  ];
  const barX = 100, barW = W - 200, barH = 22, barGap = 110;
  cats.forEach((c, i) => {
    const y = 1010 + i * barGap;
    ctx.font = `400 40px 'Noto Sans KR', sans-serif`;
    ctx.fillStyle = 'rgba(240,232,255,0.7)';
    ctx.textAlign = 'left';
    ctx.fillText(c.label, barX, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = c.color;
    ctx.fillText(`${c.score}점`, W - barX, y);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    roundRect(ctx, barX, y + 14, barW, barH, barH/2);
    ctx.fill();
    ctx.fillStyle = c.color;
    roundRect(ctx, barX, y + 14, barW * (c.score/100), barH, barH/2);
    ctx.fill();
  });

  // Detail message
  ctx.textAlign = 'center';
  ctx.font = `300 36px 'Noto Sans KR', sans-serif`;
  ctx.fillStyle = 'rgba(240,232,255,0.75)';
  const lines = wrapText(ctx, fortune.detail, W - 160, 36);
  lines.slice(0,4).forEach((l,i) => ctx.fillText(l, W/2, 1470 + i*52));

  // Lucky & warn pills
  const pillY = 1680;
  drawPill(ctx, W/2 - 20, pillY, `✨ 행운: ${fortune.lucky_item}`, '#ffd87a', 'rgba(255,216,122,0.15)');
  drawPill(ctx, W/2 - 20, pillY + 80, `⚠️ 주의: ${fortune.warn}`, '#ff8fab', 'rgba(255,143,171,0.15)');

  // Branding
  ctx.font = `300 32px 'Noto Sans KR', sans-serif`;
  ctx.fillStyle = 'rgba(196,176,245,0.3)';
  ctx.fillText('🌙 강아지 운세', W/2, H - 60);

  return canvas.toDataURL('image/png');
}

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

function wrapText(ctx, text, maxW, fontSize) {
  const chars = text.split('');
  let line = '', lines = [];
  ctx.font = `300 ${fontSize}px 'Noto Sans KR', sans-serif`;
  for (const ch of chars) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxW) { lines.push(line); line = ch; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function drawPill(ctx, x, y, text, color, bg) {
  ctx.font = `400 34px 'Noto Sans KR', sans-serif`;
  const tw = ctx.measureText(text).width;
  const pw = tw + 60, ph = 56;
  const px = x - pw/2;
  roundRect(ctx, px, y - ph + 14, pw, ph, ph/2);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = color + '55';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
}
