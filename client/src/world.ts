export const GAME_TITLE = 'Campus Whispers';
export const INSTITUTE = 'Asteria Institute';

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
export const COMMITTEE_HEADS = [
  ROLE.sports,
  ROLE.culture,
  ROLE.hostel,
  ROLE.placement,
  ROLE.welfare,
] as const;

export type RoleKind = 'candidate' | 'committee';

export type RoleBrief = {
  title: string;
  shortTitle: string;
  kind: RoleKind;
  mark: string;
  publicBrief: string;
  privateGoal: string;
  redLine: string;
  winCondition: string;
  minimum?: number;
  flagship?: string;
};

export const ROLES: Record<string, RoleBrief> = {
  [ROLE.builder]: {
    title: 'The Builder',
    shortTitle: 'Builder',
    kind: 'candidate',
    mark: 'B',
    publicBrief: 'A policy-first candidate promising infrastructure, order, and long-term campus investment.',
    privateGoal: 'Build a coalition of at least three committee heads without revealing how far your promises exceed ₹100L.',
    redLine: 'You lose only if the other candidate reaches the majority first.',
    winCondition: 'Secure three of five secret ballots and take control of the Student Life Budget.',
  },
  [ROLE.campusStar]: {
    title: 'The Campus Star',
    shortTitle: 'Campus Star',
    kind: 'candidate',
    mark: 'S',
    publicBrief: 'A charismatic campus favourite promising energy, participation, and a college life worth remembering.',
    privateGoal: 'Turn public goodwill into three real votes while proving you can govern, not merely perform.',
    redLine: 'You lose only if the other candidate reaches the majority first.',
    winCondition: 'Secure three of five secret ballots and take control of the Student Life Budget.',
  },
  [ROLE.sports]: {
    title: 'Sports Secretary',
    shortTitle: 'Sports',
    kind: 'committee',
    mark: 'SP',
    publicBrief: 'Represents varsity teams, hostel leagues, facilities, and tournament travel.',
    privateGoal: 'Commission the Inter-College Carnival.',
    redLine: 'Sports must not receive less funding than Culture.',
    winCondition: 'Reach 3 agenda points through your budget floor, flagship, ballot, and protected red line.',
    minimum: 25,
    flagship: 'carnival',
  },
  [ROLE.culture]: {
    title: 'Cultural Secretary',
    shortTitle: 'Culture',
    kind: 'committee',
    mark: 'CU',
    publicBrief: 'Represents clubs, performers, the annual fest, and the social life of campus.',
    privateGoal: 'Commission the Inter-College Carnival.',
    redLine: 'No restrictive night curfew may survive the campaign.',
    winCondition: 'Reach 3 agenda points through your budget floor, flagship, ballot, and protected red line.',
    minimum: 30,
    flagship: 'carnival',
  },
  [ROLE.hostel]: {
    title: 'Hostel & Mess Representative',
    shortTitle: 'Hostel',
    kind: 'committee',
    mark: 'HM',
    publicBrief: 'Represents everyday residential life: food, repairs, Wi-Fi, and the night canteen.',
    privateGoal: 'Commission the 24/7 Student Commons.',
    redLine: 'No compulsory student fee may be introduced.',
    winCondition: 'Reach 3 agenda points through your budget floor, flagship, ballot, and protected red line.',
    minimum: 25,
    flagship: 'commons',
  },
  [ROLE.placement]: {
    title: 'Placement & Academic Representative',
    shortTitle: 'Placement',
    kind: 'committee',
    mark: 'PA',
    publicBrief: 'Represents recruiter access, academic prestige, case competitions, and career readiness.',
    privateGoal: 'Commission the Career and Startup Lab.',
    redLine: 'Recruiter week cannot be left in unresolved disorder.',
    winCondition: 'Reach 3 agenda points through your budget floor, flagship, ballot, and protected red line.',
    minimum: 20,
    flagship: 'career_lab',
  },
  [ROLE.welfare]: {
    title: 'Student Welfare Representative',
    shortTitle: 'Welfare',
    kind: 'committee',
    mark: 'SW',
    publicBrief: 'Represents affordability, safety, mental health, accessibility, and campus equity.',
    privateGoal: 'Commission the Campus Renewal Plan.',
    redLine: 'No compulsory fee or exploitative data policy may pass.',
    winCondition: 'Reach 3 agenda points through your budget floor, flagship, ballot, and protected red line.',
    minimum: 20,
    flagship: 'renewal',
  },
};

export const PRIORITIES = [
  { id: 'sports', label: 'Sports & Teams' },
  { id: 'culture', label: 'Culture & Campus Life' },
  { id: 'hostel', label: 'Hostel & Mess' },
  { id: 'placement', label: 'Placements & Academics' },
  { id: 'welfare', label: 'Student Welfare' },
] as const;

export const PROJECTS = [
  { id: 'carnival', label: 'Inter-College Carnival', pull: 'Sports + Culture' },
  { id: 'commons', label: '24/7 Student Commons', pull: 'Hostel + Culture + Welfare' },
  { id: 'career_lab', label: 'Career & Startup Lab', pull: 'Placement' },
  { id: 'renewal', label: 'Campus Renewal Plan', pull: 'Hostel + Welfare + Sports' },
] as const;

export type EventBrief = {
  title: string;
  desk: string;
  body: string;
  stakes: string;
  options: readonly string[];
};

export const EVENTS: Record<string, EventBrief> = {
  night_canteen: {
    title: 'The Night-Canteen Bill',
    desk: 'Mess Committee Circular · 11:43 PM',
    body: 'The contractor will keep the night canteen open—but only if every student pays a compulsory fee.',
    stakes: 'Night-campus life, affordability, and the ordinary hunger of hostel residents.',
    options: [
      'Accept the fee and keep the canteen open.',
      'Reject the fee and publicly promise a subsidy.',
      'Close the night canteen and prioritise essential mess repairs.',
    ],
  },
  wifi_blackout: {
    title: 'Placement Week Blackout',
    desk: 'Block C Complaint · Urgent',
    body: 'Hostel Block C loses reliable Wi-Fi days before placement interviews begin.',
    stakes: 'Immediate access versus a durable infrastructure commitment.',
    options: [
      'Promise a full network upgrade.',
      'Approve temporary hotspots for interview week.',
      'Wait for the existing vendor and make no new commitment.',
    ],
  },
  tournament: {
    title: 'The National Tournament',
    desk: 'Athletics Telegram · Qualified',
    body: 'The college team unexpectedly qualifies for nationals and needs serious travel support.',
    stakes: 'Prestige for a few versus programmes for the whole campus.',
    options: [
      'Fully back the trip.',
      'Offer partial support and require external sponsorship.',
      'Decline the expense and prioritise wider campus programmes.',
    ],
  },
  fest_sponsor: {
    title: 'The Fest Sponsor',
    desk: 'Cultural Council Proposal · Confidential',
    body: 'A major brand will rescue the annual fest in exchange for heavy branding and student-data collection.',
    stakes: 'A spectacular fest, corporate access, and the price of student privacy.',
    options: [
      'Accept all sponsor terms.',
      'Reject the sponsor and promise institutional funding.',
      'Allow limited branding but prohibit student-data collection.',
    ],
  },
  curfew: {
    title: 'The 11 PM Curfew',
    desk: 'Dean of Students · Immediate Order',
    body: 'After a late-night incident, the administration proposes an 11 PM campus curfew.',
    stakes: 'Safety, reputation, autonomy, and collective punishment.',
    options: [
      'Accept the curfew to protect institutional reputation.',
      'Reject it and promise night transport and security.',
      'Negotiate a temporary 1 AM limit with a formal review.',
    ],
  },
  fest_vs_recruiters: {
    title: 'Fest Versus Recruiter Week',
    desk: 'Scheduling Office · Double Booking',
    body: 'An important recruiter programme has been scheduled directly on top of the annual fest.',
    stakes: 'Career opportunity, campus tradition, and the cost of compromise.',
    options: [
      'Move the fest.',
      'Protect the fest dates and ask recruiters to adapt.',
      'Split venues and promise additional logistics funding.',
    ],
  },
};

export const PHASES: Record<string, { eyebrow: string; title: string; instruction: string }> = {
  lobby: { eyebrow: 'Before nominations close', title: 'The Common Board', instruction: 'Choose a seat and seal your role.' },
  manifesto: { eyebrow: 'Round I', title: 'Manifesto Night', instruction: 'Declare what your campaign will stand for.' },
  everyday: { eyebrow: 'Round II', title: 'Everyday Campus', instruction: 'Discuss the crisis. Candidates must lock a response.' },
  opportunity: { eyebrow: 'Round III', title: 'A Campus Opportunity', instruction: 'Decide who gets the glory—and who pays.' },
  values: { eyebrow: 'Round IV', title: 'The Line You Draw', instruction: 'Choose which principle survives the night.' },
  soapbox: { eyebrow: 'Round V', title: 'The Final Rally', instruction: 'Deals lock. Make the last public case.' },
  election: { eyebrow: 'Secret ballot', title: 'Five Slips of Paper', instruction: 'Committee heads vote. Choices remain private.' },
  reveal: { eyebrow: 'The count', title: 'The Box Opens', instruction: 'Watch every ballot become public.' },
  allocation: { eyebrow: 'The mandate', title: '₹100L, No Excuses', instruction: 'The President turns every promise into a number.' },
  results: { eyebrow: 'After the posters come down', title: 'What Campus Remembers', instruction: 'See who won, who survived, and who was betrayed.' },
};

export const FACT_LABELS: Record<string, string> = {
  compulsory_fee: 'A compulsory student fee was approved.',
  subsidy_promised: 'A public night-canteen subsidy was promised.',
  night_canteen_closed: 'The night canteen will close.',
  network_upgrade_promised: 'A full hostel network upgrade was promised.',
  hotspot_restored: 'Temporary interview-week hotspots were approved.',
  wifi_unresolved: 'Block C Wi-Fi remains unresolved.',
  tournament_backed: 'The national tournament received full backing.',
  tournament_sponsored: 'Sports must find outside sponsors.',
  tournament_declined: 'The national tournament trip was declined.',
  sponsor_unrestricted: 'The unrestricted fest sponsor was accepted.',
  fest_self_funded: 'The institute-funded fest was promised.',
  sponsor_restricted: 'A privacy-protecting sponsor compromise was accepted.',
  strict_curfew: 'An 11 PM curfew now stands.',
  curfew_rejected: 'The curfew was rejected.',
  curfew_compromise: 'A temporary 1 AM compromise now stands.',
  fest_moved: 'The annual fest will move for recruiters.',
  recruiter_week_strained: 'Recruiter relations are now strained.',
  split_venues: 'Fest and recruiters will split venues.',
};

export const OPENING_NOTICES = [
  {
    stamp: 'STUDENT AFFAIRS',
    title: 'Asteria has ₹100L—and no President.',
    body: 'By sunrise, one student will control the year’s Student Life Budget and one flagship campus project.',
  },
  {
    stamp: 'NOMINATIONS',
    title: 'Two candidates. Five committee heads.',
    body: 'Three secret votes take the chair. Every vote can be negotiated, endorsed, withdrawn, or betrayed.',
  },
  {
    stamp: 'HANDWRITTEN BELOW',
    title: 'Winning the election is not the same as winning.',
    body: 'Committee heads survive by protecting their department, their private objective, and the line they refuse to cross.',
  },
] as const;

export const RULE_NOTICES = [
  { number: '01', title: 'Negotiate', body: 'Candidates may record private budget and project promises. A promise creates an alliance, not obedience.' },
  { number: '02', title: 'Decide', body: 'Campus events force both candidates to choose in secret. Their answers reveal together.' },
  { number: '03', title: 'React', body: 'Committee heads approve, oppose, endorse, withdraw, or expose. Relationships change immediately.' },
  { number: '04', title: 'Vote', body: 'Five secret ballots elect the President. Public endorsements are influential, never binding.' },
  { number: '05', title: 'Remember', body: 'The winner allocates ₹100L. Every deal, red line, and betrayal becomes part of the final story.' },
] as const;

export const DEFAULT_MANIFESTOS: Record<string, readonly string[]> = {
  [ROLE.builder]: [
    'Repair hostels, mess, and Block C before new spectacle spending.',
    'Give Sports and Placements a floor they can actually plan around.',
    'Keep night facilities open without a compulsory student fee.',
    'Record every private promise. If it is written, it binds.',
  ],
  [ROLE.campusStar]: [
    'Protect fests, clubs, and the night-campus that people actually live in.',
    'Refuse sponsor terms that harvest student data for a louder fest.',
    'Put student voice ahead of a convenient 11 PM curfew.',
    'Turn public goodwill into a government that can still pay its bills.',
  ],
};

export function roleTitle(role: string): string {
  return ROLES[role]?.title ?? role;
}

export function seatLabel(role: string, displayName?: string): string {
  const title = roleTitle(role);
  const name = displayName?.trim();
  return name ? `${name} · ${title}` : title;
}

export function manifestoLines(role: string, priorityOne?: string, priorityTwo?: string): readonly string[] {
  if (priorityOne) {
    return [
      `First priority: ${priorityLabel(priorityOne)}.`,
      priorityTwo ? `Second priority: ${priorityLabel(priorityTwo)}.` : 'Second priority still unstated.',
      'Public answers on the board will test these promises.',
      'Private deals do not erase what is pinned here.',
    ];
  }
  return DEFAULT_MANIFESTOS[role] ?? [
    'Defend the department you were elected to protect.',
    'Do not spend what you cannot honour.',
    'Make the public case on the board, not in the corridor.',
    'A recorded promise is part of the simulation.',
  ];
}

export function projectLabel(id: string): string {
  return PROJECTS.find(project => project.id === id)?.label ?? 'No flagship selected';
}

export function priorityLabel(id: string): string {
  return PRIORITIES.find(priority => priority.id === id)?.label ?? id;
}

export function isCandidate(role: string): boolean {
  return role === ROLE.builder || role === ROLE.campusStar;
}

export function isCommitteeHead(role: string): boolean {
  return (COMMITTEE_HEADS as readonly string[]).includes(role);
}
