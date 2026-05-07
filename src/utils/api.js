export async function fetchFortune({ name, breed, birth, personality, zodiac }) {
  const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
  const zodiacInfo = zodiac ? `${zodiac.name}(${zodiac.trait})` : '정보없음';

  const res = await fetch('/api/fortune', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `당신은 강아지 전문 운세 상담사입니다. 반드시 아래 JSON 형식만 응답하세요. JSON 외 텍스트 없이:
{
  "overall": "종합 운세 한 줄 (이모지 포함, 20자 이내)",
  "overall_sub": "부제 (25자 이내)",
  "snack": { "score": 1~100, "text": "간식 운세 한마디 (15자 이내)" },
  "walk":  { "score": 1~100, "text": "산책 운세 한마디 (15자 이내)" },
  "love":  { "score": 1~100, "text": "사랑받을 운세 한마디 (15자 이내)" },
  "nap":   { "score": 1~100, "text": "낮잠 운세 한마디 (15자 이내)" },
  "detail": "오늘의 자세한 운세 (강아지 이름·별자리·성격 반영, 3문장, 귀엽고 유머러스)",
  "zodiac_tip": "별자리 기반 오늘의 팁 한 줄",
  "lucky_item": "행운 아이템",
  "lucky_color": "행운 색상",
  "warn": "주의사항 짧게"
}`,
      messages: [{
        role: 'user',
        content: `이름:${name}, 견종:${breed}, 생일:${birth||'미상'}, 성격:${personality}, 별자리:${zodiacInfo}, 오늘:${today}`
      }]
    })
  });

  const data = await res.json();
  const raw = data.content?.find(b => b.type === 'text')?.text || '';
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}
