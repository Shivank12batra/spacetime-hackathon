import type { CSSProperties } from 'react';
import { ROLE } from './world';

export function CampusBackdrop() {
  return <div className="game-environment" aria-hidden="true" />;
}

export function CandidatePortrait({ role }: { role: string }) {
  const star = role === ROLE.campusStar;
  const accent = star ? '#315f82' : '#8b2d41';
  const jacket = star ? '#1d425d' : '#382b29';
  return (
    <svg className="candidate-portrait" viewBox="0 0 260 300" role="img" aria-label={star ? 'Campus Star campaign portrait' : 'Builder campaign portrait'}>
      <defs>
        <linearGradient id={`portrait-${role}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={star ? '#d9e3e7' : '#eadccb'} />
          <stop offset="1" stopColor={star ? '#7594a8' : '#b88670'} />
        </linearGradient>
      </defs>
      <rect width="260" height="300" fill={`url(#portrait-${role})`} />
      <circle cx={star ? 188 : 54} cy="58" r="96" fill={accent} opacity=".18" />
      <path d={star ? 'M50 302 Q68 218 130 210 Q202 220 226 302Z' : 'M34 302 Q58 215 130 210 Q204 215 228 302Z'} fill={jacket} />
      <path d="M104 205 L130 260 L157 205 Q143 193 130 193 Q116 193 104 205Z" fill="#f1e4d3" />
      <ellipse cx="130" cy="126" rx="58" ry="72" fill={star ? '#9b684d' : '#8e604b'} />
      <path d={star ? 'M74 118 Q78 45 132 44 Q192 51 190 119 Q166 83 125 82 Q92 82 74 118Z' : 'M73 117 Q78 49 129 45 Q179 47 188 109 Q157 81 118 84 Q91 86 73 117Z'} fill="#201b19" />
      <path d="M94 132 Q107 126 118 133 M142 133 Q154 126 168 132" fill="none" stroke="#30211d" strokeWidth="4" strokeLinecap="round" />
      <path d={star ? 'M111 166 Q130 179 151 163' : 'M113 166 Q130 170 148 165'} fill="none" stroke="#56372d" strokeWidth="4" strokeLinecap="round" />
      {!star && <path d="M93 124 Q106 118 119 125 M140 125 Q154 118 169 124 M119 125 H140" fill="none" stroke="#302b29" strokeWidth="3" />}
      {star && <path d="M185 70 l25 -14 M181 84 l32 -2" stroke="#e4bc67" strokeWidth="5" strokeLinecap="round" />}
      <rect x="15" y="17" width="70" height="23" fill="#f3e8d2" stroke={accent} strokeWidth="2" />
      <text x="50" y="32" textAnchor="middle" fill={accent} fontFamily="monospace" fontSize="10" fontWeight="700">{star ? 'THE STAR' : 'THE BUILDER'}</text>
    </svg>
  );
}

const EVENT_CIRCULARS: Record<string, { stamp: string; accent: string }> = {
  night_canteen: { stamp: 'MESS CIRCULAR', accent: '#c27b36' },
  wifi_blackout: { stamp: 'BLOCK C COMPLAINT', accent: '#315f82' },
  tournament: { stamp: 'ATHLETICS DESK', accent: '#8f3445' },
  fest_sponsor: { stamp: 'CULTURAL COUNCIL', accent: '#6d467b' },
  curfew: { stamp: 'DEAN OF STUDENTS', accent: '#97352f' },
  fest_vs_recruiters: { stamp: 'SCHEDULING OFFICE', accent: '#356554' },
};

export function EventIllustration({ eventId }: { eventId: string }) {
  const event = EVENT_CIRCULARS[eventId] ?? EVENT_CIRCULARS.night_canteen;
  return (
    <div className="event-illustration" style={{ '--event-accent': event.accent } as CSSProperties} aria-hidden="true">
      <span className="event-circular-stamp">{event.stamp}</span>
    </div>
  );
}
