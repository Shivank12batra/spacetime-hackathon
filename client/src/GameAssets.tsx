import type { CSSProperties } from 'react';
import { ROLE } from './world';

export function CampusBackdrop() {
  return <div className="game-environment" aria-hidden="true" />;
}

export function CandidatePortrait({ role }: { role: string }) {
  const star = role === ROLE.campusStar;
  return star ? <StarPoster /> : <BuilderPoster />;
}

function BuilderPoster() {
  return (
    <svg className="candidate-portrait" viewBox="0 0 260 300" role="img" aria-label="The Builder campaign poster">
      <defs>
        <pattern id="builder-dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.65" fill="#6b1f2a" opacity=".22" />
        </pattern>
        <pattern id="builder-grid" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M14 0 H0 V14" fill="none" stroke="#7a2434" strokeWidth=".4" opacity=".35" />
        </pattern>
      </defs>
      <rect width="260" height="300" fill="#f0d7bb" />
      <rect width="260" height="300" fill="url(#builder-grid)" />
      <rect width="260" height="300" fill="url(#builder-dots)" />
      <rect x="8" y="8" width="244" height="284" fill="none" stroke="#7a2434" strokeWidth="3" />
      <rect x="14" y="14" width="232" height="272" fill="none" stroke="#9a3a3a" strokeWidth="1" />

      <rect x="20" y="20" width="86" height="16" fill="#7a2434" />
      <text x="63" y="31" textAnchor="middle" fill="#f0d7bb" fontFamily="'DM Mono', monospace" fontSize="8" fontWeight="700">NOMINATION SLIP</text>
      <text x="240" y="32" textAnchor="end" fill="#7a2434" fontFamily="'DM Mono', monospace" fontSize="8">FILE 01</text>

      <text x="22" y="62" fill="#7a2434" fontFamily="'Libre Caslon Display', serif" fontSize="34">The</text>
      <text x="22" y="94" fill="#7a2434" fontFamily="'Libre Caslon Display', serif" fontSize="40">Builder</text>
      <text x="22" y="112" fill="#7a2434" fontFamily="'DM Mono', monospace" fontSize="8" letterSpacing="1.4">INFRASTRUCTURE TICKET · ASTERIA</text>

      <g fill="#7a2434">
        <rect x="28" y="138" width="58" height="72" />
        <rect x="94" y="118" width="68" height="92" />
        <rect x="170" y="146" width="52" height="64" />
        <rect x="34" y="148" width="12" height="16" fill="#f0d7bb" />
        <rect x="50" y="148" width="12" height="16" fill="#f0d7bb" />
        <rect x="34" y="170" width="12" height="16" fill="#f0d7bb" />
        <rect x="50" y="170" width="12" height="16" fill="#f0d7bb" />
        <rect x="102" y="128" width="14" height="18" fill="#f0d7bb" />
        <rect x="122" y="128" width="14" height="18" fill="#f0d7bb" />
        <rect x="142" y="128" width="14" height="18" fill="#f0d7bb" />
        <rect x="102" y="152" width="14" height="18" fill="#f0d7bb" />
        <rect x="122" y="152" width="14" height="18" fill="#f0d7bb" />
        <rect x="142" y="152" width="14" height="18" fill="#f0d7bb" />
        <rect x="176" y="156" width="12" height="14" fill="#f0d7bb" />
        <rect x="194" y="156" width="12" height="14" fill="#f0d7bb" />
        <rect x="176" y="176" width="12" height="14" fill="#f0d7bb" />
        <rect x="194" y="176" width="12" height="14" fill="#f0d7bb" />
        <rect x="112" y="108" width="32" height="10" />
        <path d="M20 210 H232" stroke="#7a2434" strokeWidth="4" />
        <path d="M22 122 h40 l-8 8 h-24 z" fill="#9a3a3a" />
      </g>

      <circle cx="214" cy="246" r="26" fill="none" stroke="#7a2434" strokeWidth="2" strokeDasharray="3 2" />
      <text x="214" y="243" textAnchor="middle" fill="#7a2434" fontFamily="'DM Mono', monospace" fontSize="7">REPAIR</text>
      <text x="214" y="254" textAnchor="middle" fill="#7a2434" fontFamily="'DM Mono', monospace" fontSize="7">FIRST</text>

      <rect x="20" y="252" width="160" height="26" fill="#7a2434" />
      <text x="100" y="269" textAnchor="middle" fill="#f0d7bb" fontFamily="'DM Mono', monospace" fontSize="8" letterSpacing="1.2">HOSTEL · MESS · BLOCK C</text>
    </svg>
  );
}

function StarPoster() {
  return (
    <svg className="candidate-portrait" viewBox="0 0 260 300" role="img" aria-label="The Campus Star campaign poster">
      <defs>
        <pattern id="star-dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="0.6" fill="#16384d" opacity=".2" />
        </pattern>
      </defs>
      <rect width="260" height="300" fill="#c9d8e2" />
      <rect width="260" height="300" fill="url(#star-dots)" />
      <rect x="8" y="8" width="244" height="284" fill="none" stroke="#1f4d6a" strokeWidth="3" />
      <rect x="14" y="14" width="232" height="272" fill="none" stroke="#2f6f8d" strokeWidth="1" />

      <text x="22" y="36" fill="#1f4d6a" fontFamily="'DM Mono', monospace" fontSize="8" fontWeight="700">CULTURAL COUNCIL COPY</text>
      <text x="238" y="36" textAnchor="end" fill="#1f4d6a" fontFamily="'DM Mono', monospace" fontSize="8">FILE 02</text>

      <text x="22" y="68" fill="#1f4d6a" fontFamily="'Libre Caslon Display', serif" fontSize="28">The Campus</text>
      <text x="22" y="104" fill="#1f4d6a" fontFamily="'Libre Caslon Display', serif" fontSize="46">Star</text>
      <text x="22" y="122" fill="#1f4d6a" fontFamily="'DM Mono', monospace" fontSize="8" letterSpacing="1.6">NIGHT CAMPUS · FEST · CLUBS</text>

      <g fill="#1f4d6a">
        <path d="M40 210 C40 150 70 128 130 128 C190 128 220 150 220 210 Z" fill="#1f4d6a" />
        <path d="M58 210 C58 164 86 146 130 146 C174 146 202 164 202 210 Z" fill="#c9d8e2" />
        <path d="M78 210 C78 176 100 164 130 164 C160 164 182 176 182 210 Z" fill="#1f4d6a" />
        <path d="M130 78 L138 104 H166 L144 120 L152 146 L130 130 L108 146 L116 120 L94 104 H122 Z" fill="#c9a24a" stroke="#1f4d6a" strokeWidth="2" />
        <circle cx="52" cy="138" r="3" fill="#c9a24a" />
        <circle cx="208" cy="138" r="3" fill="#c9a24a" />
        <circle cx="70" cy="124" r="2.4" fill="#c9a24a" />
        <circle cx="190" cy="124" r="2.4" fill="#c9a24a" />
        <path d="M24 210 H236" stroke="#1f4d6a" strokeWidth="5" />
        <path d="M36 210 V188 M224 210 V188" stroke="#1f4d6a" strokeWidth="6" />
      </g>

      <circle cx="214" cy="246" r="26" fill="none" stroke="#1f4d6a" strokeWidth="2" />
      <text x="214" y="243" textAnchor="middle" fill="#1f4d6a" fontFamily="'DM Mono', monospace" fontSize="7">KEEP THE</text>
      <text x="214" y="254" textAnchor="middle" fill="#1f4d6a" fontFamily="'DM Mono', monospace" fontSize="7">NIGHT</text>

      <rect x="20" y="252" width="160" height="26" fill="#1f4d6a" />
      <text x="100" y="269" textAnchor="middle" fill="#c9d8e2" fontFamily="'DM Mono', monospace" fontSize="8" letterSpacing="1.2">LIFE · NIGHT · FEST</text>
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
