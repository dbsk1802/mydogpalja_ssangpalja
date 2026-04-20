export const ZODIAC_LIST = [
  { name: '염소자리', emoji: '♑', en: 'Capricorn', trait: '신중하고 성실한', start: [12,22], end: [1,19] },
  { name: '물병자리', emoji: '♒', en: 'Aquarius', trait: '독창적이고 자유로운', start: [1,20], end: [2,18] },
  { name: '물고기자리', emoji: '♓', en: 'Pisces', trait: '감성적이고 꿈꾸는', start: [2,19], end: [3,20] },
  { name: '양자리', emoji: '♈', en: 'Aries', trait: '용감하고 열정적인', start: [3,21], end: [4,19] },
  { name: '황소자리', emoji: '♉', en: 'Taurus', trait: '안정적이고 고집있는', start: [4,20], end: [5,20] },
  { name: '쌍둥이자리', emoji: '♊', en: 'Gemini', trait: '활발하고 호기심 많은', start: [5,21], end: [6,20] },
  { name: '게자리', emoji: '♋', en: 'Cancer', trait: '다정하고 보호본능 강한', start: [6,21], end: [7,22] },
  { name: '사자자리', emoji: '♌', en: 'Leo', trait: '당당하고 사랑받길 좋아하는', start: [7,23], end: [8,22] },
  { name: '처녀자리', emoji: '♍', en: 'Virgo', trait: '꼼꼼하고 청결을 좋아하는', start: [8,23], end: [9,22] },
  { name: '천칭자리', emoji: '♎', en: 'Libra', trait: '균형잡히고 사교적인', start: [9,23], end: [10,22] },
  { name: '전갈자리', emoji: '♏', en: 'Scorpio', trait: '강렬하고 충성스러운', start: [10,23], end: [11,21] },
  { name: '사수자리', emoji: '♐', en: 'Sagittarius', trait: '모험을 좋아하는 자유로운', start: [11,22], end: [12,21] },
];

export function getZodiac(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  for (const z of ZODIAC_LIST) {
    const [sm, sd] = z.start;
    const [em, ed] = z.end;
    if (sm > em) {
      if ((m === sm && day >= sd) || (m === em && day <= ed)) return z;
    } else {
      if ((m === sm && day >= sd) || (m > sm && m < em) || (m === em && day <= ed)) return z;
    }
  }
  return null;
}

export function getAge(dateStr) {
  if (!dateStr) return null;
  const birth = new Date(dateStr);
  const now = new Date();
  const years = Math.floor((now - birth) / (365.25 * 24 * 3600 * 1000));
  if (years < 1) return '아기 강아지';
  if (years <= 3) return `${years}살 (청년)`;
  if (years <= 7) return `${years}살 (중년)`;
  return `${years}살 (시니어)`;
}
