import { ROLE } from './data';

export const MIN_ASK: Record<string, number> = {
  [ROLE.sports]: 25,
  [ROLE.culture]: 30,
  [ROLE.hostel]: 25,
  [ROLE.placement]: 20,
  [ROLE.welfare]: 20,
};

export const FLAGSHIP: Record<string, string> = {
  [ROLE.sports]: 'carnival',
  [ROLE.culture]: 'carnival',
  [ROLE.hostel]: 'commons',
  [ROLE.placement]: 'career_lab',
  [ROLE.welfare]: 'renewal',
};

export const START_ALLY: Record<string, string> = {
  [ROLE.builder]: ROLE.placement,
  [ROLE.campusStar]: ROLE.culture,
};

export const WANT: Record<string, { mission: string; condition: string; short: string }> = {
  [ROLE.sports]: {
    mission: 'Commission the Inter-College Carnival',
    condition: 'Sports allocation must meet or exceed Cultural budget',
    short: 'Carnival · Sports ≥ Culture',
  },
  [ROLE.culture]: {
    mission: 'Safeguard Festival Sovereignty',
    condition: 'Campus night access must remain open (No 11 PM Curfew)',
    short: 'Festival Fund · No Curfew',
  },
  [ROLE.hostel]: {
    mission: 'Construct the 24/7 Student Commons',
    condition: 'Zero mandatory student fees levied on hostel residents',
    short: '24/7 Commons · No Extra Fee',
  },
  [ROLE.placement]: {
    mission: 'Establish the Corporate Career & Startup Lab',
    condition: 'Protect recruiter week integrity from campus conflict',
    short: 'Career Lab · Clean Recruiter Week',
  },
  [ROLE.welfare]: {
    mission: 'Authorize the Campus Renewal & Subsidy Plan',
    condition: 'Reject exclusionary fees and predatory data-mining sponsors',
    short: 'Renewal Plan · Fair Subsidies',
  },
};

export const DESK: Record<
  string,
  { room: string; title: string; directive: string; subtext: string; theme: string }
> = {
  [ROLE.builder]: {
    room: 'CAMPAIGN WAR ROOM',
    title: 'The Builder',
    directive: 'Secure 3 of 5 Committee Votes',
    subtext: 'The treasury holds ₹100L. Demands exceed ₹120L. Strategic betrayal is inevitable.',
    theme: 'builder',
  },
  [ROLE.campusStar]: {
    room: 'CAMPAIGN WAR ROOM',
    title: 'The Campus Star',
    directive: 'Secure 3 of 5 Committee Votes',
    subtext: 'Rally the mass campus base. Lock 3 secret ballots to claim the Presidential mandate.',
    theme: 'star',
  },
  [ROLE.sports]: {
    room: 'ATHLETICS COMMISSION',
    title: 'Sports Secretary',
    directive: 'Leverage the Varsity Bloc',
    subtext: 'Candidates need your ballot. Back the ticket that guarantees your budget and Carnival.',
    theme: 'sports',
  },
  [ROLE.culture]: {
    room: 'CULTURAL COUNCIL',
    title: 'Cultural Secretary',
    directive: 'Leverage the Arts & Fest Bloc',
    subtext: 'Guard festival autonomy. Punish any candidate who threatens campus nightlife.',
    theme: 'culture',
  },
  [ROLE.hostel]: {
    room: 'HOSTEL & RESIDENCE BOARD',
    title: 'Hostel Secretary',
    directive: 'Leverage the 1,800 Dorm Voters',
    subtext: 'Mess food, night canteen, and Wi-Fi. Extract binding infrastructure commitments.',
    theme: 'hostel',
  },
  [ROLE.placement]: {
    room: 'CAREER & RECRUITMENT CELL',
    title: 'Placement Secretary',
    directive: 'Leverage Institutional Stakes',
    subtext: 'Corporate recruiters demand order. Back the candidate offering stability.',
    theme: 'placement',
  },
  [ROLE.welfare]: {
    room: 'STUDENT WELFARE ADVOCACY',
    title: 'Welfare Secretary',
    directive: 'Leverage the Equity & General Base',
    subtext: 'Defend student subsidies. Block exploitative administration fees.',
    theme: 'welfare',
  },
};

export type Door = {
  label: string;
  sub: string;
  optionIndex: number;
  helps: string[];
  burns: string[];
};

export const CINEMA: Record<
  string,
  {
    grade: string;
    kicker: string;
    headline: string;
    sting: string;
    doors: [Door, Door];
  }
> = {
  night_canteen: {
    grade: 'canteen',
    kicker: 'CRITICAL CAMPUS INCIDENT // DORMITORY CRISIS',
    headline: 'MESS SERVICES TERMINATE AT 23:00',
    sting: 'Contractor demands a mandatory ₹2,500 student levy or shutters late-night cafeteria operations immediately.',
    doors: [
      {
        label: 'APPROVE LEVY',
        sub: 'Night canteen stays operational. Hostel and Welfare blocs brand you an administrator puppet.',
        optionIndex: 0,
        helps: [],
        burns: [ROLE.hostel, ROLE.welfare],
      },
      {
        label: 'DENY LEVY & SUBSIDIZE',
        sub: 'Commit ₹10L council treasury subsidy. Dorms applaud; future project funds severely depleted.',
        optionIndex: 1,
        helps: [ROLE.hostel, ROLE.welfare],
        burns: [],
      },
    ],
  },
  wifi_blackout: {
    grade: 'wifi',
    kicker: 'CRITICAL INFRASTRUCTURE FAILURE // BLOCK C',
    headline: 'DORMITORY FIBER NETWORK BLACKOUT',
    sting: 'Critical connectivity severed 36 hours before multinational recruitment interview rounds begin.',
    doors: [
      {
        label: 'FULL INFRASTRUCTURE OVERHAUL',
        sub: 'Commit emergency fiber upgrade. Hostel residents and Placement Cell breathe easy.',
        optionIndex: 0,
        helps: [ROLE.hostel, ROLE.placement],
        burns: [],
      },
      {
        label: 'TEMPORARY HOTSPOTS ONLY',
        sub: 'Refuse new commitments. Placement week risks catastrophic interview interruptions.',
        optionIndex: 2,
        helps: [],
        burns: [ROLE.hostel, ROLE.placement],
      },
    ],
  },
  tournament: {
    grade: 'tournament',
    kicker: 'NATIONAL QUALIFICATION // ATHLETICS DISPATCH',
    headline: 'VARSITY TEAM QUALIFIES FOR NATIONALS',
    sting: 'Athletic Council requires ₹15L expedited transit funding. Competing departments claim it is elitist.',
    doors: [
      {
        label: 'AUTHORIZE TRAVEL BUDGET',
        sub: 'Full institutional endorsement. Sports Secretary pledges loyalty; arts funding tightens.',
        optionIndex: 0,
        helps: [ROLE.sports],
        burns: [],
      },
      {
        label: 'REJECT BUDGET REQUEST',
        sub: 'Instruct athletics to seek third-party patrons. Sports bloc severs diplomatic ties.',
        optionIndex: 2,
        helps: [],
        burns: [ROLE.sports],
      },
    ],
  },
  fest_sponsor: {
    grade: 'sponsor',
    kicker: 'ANNUAL FESTIVAL // COMMERCIAL PROPOSAL',
    headline: 'TELECOM TITAN OFFERS FESTIVAL BAILOUT',
    sting: 'Fintech sponsor covers stage logistics in exchange for compulsory student personal data harvesting.',
    doors: [
      {
        label: 'SIGN COMMERCIAL DEAL',
        sub: 'Festival scale doubled. Welfare Secretary and privacy advocates initiate public boycott.',
        optionIndex: 0,
        helps: [ROLE.culture],
        burns: [ROLE.welfare],
      },
      {
        label: 'REJECT CORPORATE EXPLOITATION',
        sub: 'Protect student privacy. Culture must operate on an austere baseline budget.',
        optionIndex: 1,
        helps: [ROLE.welfare, ROLE.culture],
        burns: [],
      },
    ],
  },
  curfew: {
    grade: 'curfew',
    kicker: 'CAMPUS GOVERNANCE // DISCIPLINARY DIRECTIVE',
    headline: 'ADMINISTRATION DEMANDS 23:00 CURFEW',
    sting: 'Dean of Students orders midnight perimeter locked down following off-campus disturbances.',
    doors: [
      {
        label: 'ENFORCE 23:00 CURFEW',
        sub: 'Appease senior faculty and corporate recruiters. Cultural and student life strangled.',
        optionIndex: 0,
        helps: [ROLE.placement],
        burns: [ROLE.culture],
      },
      {
        label: 'DEFEND NIGHT FREEDOM',
        sub: 'Refuse administrative curfew. Commit private campus shuttle security at candidate expense.',
        optionIndex: 1,
        helps: [ROLE.culture],
        burns: [],
      },
    ],
  },
  fest_vs_recruiters: {
    grade: 'clash',
    kicker: 'CALENDAR GRIDLOCK // LOGISTICAL CRISIS',
    headline: 'ANNUAL FESTIVAL COLLIDES WITH TIER-1 RECRUITERS',
    sting: 'Auditorium and central halls double-booked on identical dates. One faction must yield.',
    doors: [
      {
        label: 'RESCHEDULE FESTIVAL DATES',
        sub: 'Prioritize student careers. Cultural Council decries administrative favoritism.',
        optionIndex: 0,
        helps: [ROLE.placement],
        burns: [ROLE.culture],
      },
      {
        label: 'PROTECT FESTIVAL TRADITION',
        sub: 'Recruiters forced into secondary satellite venues. Placement team is furious.',
        optionIndex: 1,
        helps: [ROLE.culture],
        burns: [ROLE.placement],
      },
    ],
  },
};

export function dealPrices(headRole: string): number[] {
  const min = MIN_ASK[headRole] ?? 20;
  return [min, Math.min(40, min + 10), 40];
}

export function leanScore(
  headRole: string,
  candidateRole: string,
  ctx: {
    profiles: readonly { role: string; priorityOne: string; priorityTwo: string }[];
    deals: readonly {
      candidateRole: string;
      brokerRole: string;
      status: string;
    }[];
    relationships: readonly {
      candidateRole: string;
      brokerRole: string;
      state: string;
    }[];
    endorsements: readonly { candidateRole: string; brokerRole: string }[];
    revealedChoices: readonly {
      candidateRole: string;
      eventId: string;
      optionIndex: number;
    }[];
  }
): number {
  let score = 0;
  if (START_ALLY[candidateRole] === headRole) score += 24;

  const profile = ctx.profiles.find(row => row.role === candidateRole);
  if (profile?.priorityOne === headRole || profile?.priorityTwo === headRole) score += 30;

  const mine = ctx.deals.filter(
    row => row.brokerRole === headRole && row.candidateRole === candidateRole
  );
  if (mine.some(row => row.status === 'accepted')) score += 36;
  if (mine.some(row => row.status === 'pending')) score += 10;

  const rel = ctx.relationships.find(
    row => row.brokerRole === headRole && row.candidateRole === candidateRole
  );
  if (rel?.state === 'allied') score += 14;
  if (rel?.state === 'burned') score -= 32;

  if (ctx.endorsements.some(row => row.brokerRole === headRole && row.candidateRole === candidateRole)) {
    score += 10;
  }

  for (const choice of ctx.revealedChoices.filter(row => row.candidateRole === candidateRole)) {
    const scene = CINEMA[choice.eventId];
    const door = scene?.doors.find(item => item.optionIndex === choice.optionIndex);
    if (!door) continue;
    if (door.burns.includes(headRole)) score -= 45;
    if (door.helps.includes(headRole)) score += 25;
  }

  return score;
}

export function compassNeedle(
  headRole: string,
  ctx: Parameters<typeof leanScore>[2]
): { lean: 'builder' | 'campus_star' | 'toss'; deg: number; label: string; ratio: number } {
  const builder = leanScore(headRole, ROLE.builder, ctx);
  const star = leanScore(headRole, ROLE.campusStar, ctx);
  const gap = star - builder;
  const clampedGap = Math.max(-100, Math.min(100, gap));
  const deg = (clampedGap / 100) * 45;
  const ratio = Math.round(50 + (clampedGap / 100) * 50);

  if (Math.abs(gap) < 10) return { lean: 'toss', deg: 0, label: 'DEAD HEAT', ratio: 50 };
  if (gap > 0) return { lean: 'campus_star', deg, label: 'STAR FAVORABLE', ratio };
  return { lean: 'builder', deg, label: 'BUILDER FAVORABLE', ratio: 100 - ratio };
}

export function faceState(
  headRole: string,
  candidateRole: string,
  ctx: Parameters<typeof leanScore>[2]
): 'allied' | 'listening' | 'cold' {
  const rel = ctx.relationships.find(
    row => row.brokerRole === headRole && row.candidateRole === candidateRole
  );
  if (rel?.state === 'allied') return 'allied';
  if (rel?.state === 'burned') return 'cold';
  const accepted = ctx.deals.some(
    row =>
      row.brokerRole === headRole &&
      row.candidateRole === candidateRole &&
      row.status === 'accepted'
  );
  if (accepted) return 'allied';
  if (START_ALLY[candidateRole] === headRole) return 'listening';
  if (rel?.state === 'open') return 'listening';
  return 'cold';
}
