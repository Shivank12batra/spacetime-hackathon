export const ROLE = {
  builder: 'builder',
  campusStar: 'campus_star',
  sports: 'sports',
  culture: 'culture',
  hostel: 'hostel',
  placement: 'placement',
  welfare: 'welfare',
} as const;

export const CANDIDATES = [ROLE.builder, ROLE.campusStar] as const;
export const BROKERS = [
  ROLE.sports,
  ROLE.culture,
  ROLE.hostel,
  ROLE.placement,
  ROLE.welfare,
] as const;
export const COMMITTEE_HEADS = BROKERS;

export const ROLE_ICONS: Record<string, string> = {
  [ROLE.builder]: '🏗️',
  [ROLE.campusStar]: '🌟',
  [ROLE.sports]: '🏃',
  [ROLE.culture]: '🎭',
  [ROLE.hostel]: '🌙',
  [ROLE.placement]: '💼',
  [ROLE.welfare]: '🛡️',
};

export const ROLE_TAG: Record<string, string> = {
  [ROLE.builder]: 'Candidate',
  [ROLE.campusStar]: 'Candidate',
  [ROLE.sports]: 'Committee Head',
  [ROLE.culture]: 'Committee Head',
  [ROLE.hostel]: 'Committee Head',
  [ROLE.placement]: 'Committee Head',
  [ROLE.welfare]: 'Committee Head',
};

export const ROLE_META: Record<
  string,
  { title: string; blurb: string; demand?: string; kind: 'candidate' | 'committee_head' }
> = {
  [ROLE.builder]: {
    title: 'The Builder',
    kind: 'candidate',
    blurb: 'Focuses on infrastructure and placements. Starts Allied with Placement.',
  },
  [ROLE.campusStar]: {
    title: 'The Campus Star',
    kind: 'candidate',
    blurb: 'Charismatic crowd-puller and fest champion. Starts Allied with Culture.',
  },
  [ROLE.sports]: {
    title: 'Sports Secretary',
    kind: 'committee_head',
    blurb: 'Controls the hostel sports blocs and varsity teams.',
    demand: 'Minimum ₹25L',
  },
  [ROLE.culture]: {
    title: 'Cultural Secretary',
    kind: 'committee_head',
    blurb: 'Guards the annual cultural fest budget and student clubs.',
    demand: 'Minimum ₹30L',
  },
  [ROLE.hostel]: {
    title: 'Hostel & Mess',
    kind: 'committee_head',
    blurb: 'Guards mess quality, night canteen, and hostel Wi-Fi.',
    demand: 'Minimum ₹25L',
  },
  [ROLE.placement]: {
    title: 'Placement & Academic',
    kind: 'committee_head',
    blurb: 'Guards recruiter relations, resume labs, and corporate visits.',
    demand: 'Minimum ₹20L',
  },
  [ROLE.welfare]: {
    title: 'Student Welfare',
    kind: 'committee_head',
    blurb: 'Guards subsidized emergency funds, fee relief, and campus equity.',
    demand: 'Minimum ₹20L',
  },
};

export const PRIORITIES = [
  { id: 'sports', label: 'Sports' },
  { id: 'culture', label: 'Culture and Campus Life' },
  { id: 'hostel', label: 'Hostel and Mess' },
  { id: 'placement', label: 'Placements and Academics' },
  { id: 'welfare', label: 'Student Welfare' },
] as const;

export const PROJECTS = [
  { id: 'carnival', label: 'Inter-College Carnival', pull: 'Sports + Culture' },
  { id: 'commons', label: '24/7 Student Commons', pull: 'Hostel + Culture + Welfare' },
  { id: 'career_lab', label: 'Career and Startup Lab', pull: 'Placement' },
  { id: 'renewal', label: 'Campus Renewal Plan', pull: 'Hostel + Welfare + Sports' },
] as const;

export const SECRET: Record<string, { objective: string; redLine: string }> = {
  [ROLE.sports]: {
    objective: 'Flagship: Inter-College Carnival',
    redLine: 'Sports must not receive less than Culture',
  },
  [ROLE.culture]: {
    objective: 'Flagship: Inter-College Carnival',
    redLine: 'No restrictive night curfew',
  },
  [ROLE.hostel]: {
    objective: 'Flagship: 24/7 Student Commons',
    redLine: 'No compulsory student fee',
  },
  [ROLE.placement]: {
    objective: 'Flagship: Career and Startup Lab',
    redLine: 'No unresolved recruiter-week controversy',
  },
  [ROLE.welfare]: {
    objective: 'Flagship: Campus Renewal Plan',
    redLine: 'No compulsory fee or exclusionary policy',
  },
};

export const EVENTS: Record<
  string,
  { title: string; body: string; options: string[] }
> = {
  night_canteen: {
    title: 'The Night-Canteen Bill',
    body: 'The mess contractor will keep the night canteen open — only with a compulsory student fee.',
    options: [
      'Accept the fee and keep the canteen open.',
      'Reject the fee and publicly promise a subsidy.',
      'Close the night canteen and prioritize essential mess improvements.',
    ],
  },
  wifi_blackout: {
    title: 'Placement Week Blackout',
    body: 'Hostel Block C loses reliable Wi-Fi days before placement interviews.',
    options: [
      'Promise a full network upgrade.',
      'Approve a temporary hotspot solution.',
      'Wait for the existing vendor and avoid a new commitment.',
    ],
  },
  tournament: {
    title: 'The National Tournament',
    body: 'The college team qualifies for a national tournament that needs serious travel money.',
    options: [
      'Fully back the trip.',
      'Offer partial support and require external sponsorship.',
      'Decline the expense and prioritize wider campus programmes.',
    ],
  },
  fest_sponsor: {
    title: 'The Fest Sponsor',
    body: 'A brand will rescue the annual fest in exchange for heavy branding and student-data collection.',
    options: [
      'Accept all sponsor terms.',
      'Reject the sponsor and promise institutional funding.',
      'Allow limited branding but prohibit student-data collection.',
    ],
  },
  curfew: {
    title: 'The 11 PM Curfew',
    body: 'After a late-night incident, the administration wants an 11 PM campus curfew.',
    options: [
      'Accept the curfew to protect institutional reputation.',
      'Reject it and promise night transport and security.',
      'Negotiate a temporary 1 AM limit with a review.',
    ],
  },
  fest_vs_recruiters: {
    title: 'Fest Versus Recruiter Week',
    body: 'An important recruiter programme has been scheduled on top of the annual fest.',
    options: [
      'Move the fest.',
      'Protect the fest dates and ask recruiters to adapt.',
      'Split venues and promise additional logistics funding.',
    ],
  },
};

export const PHASE_LABEL: Record<string, string> = {
  lobby: 'Lobby · Quad Gathering',
  manifesto: 'Round 1 · Manifesto Night',
  everyday: 'Round 2 · Mess & Wi-Fi Crisis',
  opportunity: 'Round 3 · Festival & Prestige',
  values: 'Round 4 · Curfew & Ethics Clash',
  soapbox: 'Round 5 · Final Soapbox',
  election: 'Secret Ballot · The Vote',
  reveal: 'The Count · Opening Box',
  allocation: 'The Mandate · Spending ₹100L',
  results: 'Final Verdict & Legacy',
};

export const FACT_LABEL: Record<string, string> = {
  compulsory_fee: 'Compulsory student fee approved',
  subsidy_promised: 'Night-canteen subsidy promised',
  night_canteen_closed: 'Night canteen closed',
  network_upgrade_promised: 'Full network upgrade promised',
  hotspot_restored: 'Temporary hotspots approved',
  wifi_unresolved: 'Hostel Wi-Fi left unresolved',
  tournament_backed: 'National tournament fully backed',
  tournament_sponsored: 'Tournament needs outside sponsors',
  tournament_declined: 'Tournament support declined',
  sponsor_unrestricted: 'Unrestricted fest sponsor accepted',
  fest_self_funded: 'Self-funded fest promised',
  sponsor_restricted: 'Restricted sponsorship negotiated',
  strict_curfew: '11 PM curfew accepted',
  curfew_rejected: 'Curfew rejected',
  curfew_compromise: 'Temporary 1 AM compromise',
  fest_moved: 'Fest rescheduled for recruiters',
  recruiter_week_strained: 'Recruiter week strained',
  split_venues: 'Fest and recruiters split venues',
};

export function projectLabel(id: string): string {
  return PROJECTS.find(project => project.id === id)?.label ?? 'No project';
}

export function priorityLabel(id: string): string {
  return PRIORITIES.find(priority => priority.id === id)?.label ?? id;
}

export function roleTitle(role: string): string {
  return ROLE_META[role]?.title ?? role;
}

export function isCandidate(role: string): boolean {
  return role === ROLE.builder || role === ROLE.campusStar;
}

export function isBroker(role: string): boolean {
  return (BROKERS as readonly string[]).includes(role);
}

export const isCommitteeHead = isBroker;
