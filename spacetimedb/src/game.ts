export const MATCH_ID = 1n;

export const PHASE = {
  lobby: 'lobby',
  manifesto: 'manifesto',
  everyday: 'everyday',
  opportunity: 'opportunity',
  values: 'values',
  soapbox: 'soapbox',
  election: 'election',
  reveal: 'reveal',
  allocation: 'allocation',
  results: 'results',
} as const;

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

export const REL = {
  open: 'open',
  allied: 'allied',
  burned: 'burned',
} as const;

export const DEAL = {
  pending: 'pending',
  accepted: 'accepted',
  rejected: 'rejected',
} as const;

export const SUPPORT = {
  electoral: 'electoral',
  endorsement: 'endorsement',
} as const;

export const PROJECT = {
  none: '',
  carnival: 'carnival',
  commons: 'commons',
  careerLab: 'career_lab',
  renewal: 'renewal',
} as const;

export const PRIORITY = [
  'sports',
  'culture',
  'hostel',
  'placement',
  'welfare',
] as const;

export const FACT = {
  compulsoryFee: 'compulsory_fee',
  subsidyPromised: 'subsidy_promised',
  nightCanteenClosed: 'night_canteen_closed',
  networkUpgrade: 'network_upgrade_promised',
  hotspotRestored: 'hotspot_restored',
  wifiUnresolved: 'wifi_unresolved',
  tournamentBacked: 'tournament_backed',
  tournamentSponsored: 'tournament_sponsored',
  tournamentDeclined: 'tournament_declined',
  sponsorUnrestricted: 'sponsor_unrestricted',
  festSelfFunded: 'fest_self_funded',
  sponsorRestricted: 'sponsor_restricted',
  strictCurfew: 'strict_curfew',
  curfewRejected: 'curfew_rejected',
  curfewCompromise: 'curfew_compromise',
  festMoved: 'fest_moved',
  recruiterStrained: 'recruiter_week_strained',
  splitVenues: 'split_venues',
} as const;

export const EVENT = {
  nightCanteen: 'night_canteen',
  wifiBlackout: 'wifi_blackout',
  tournament: 'tournament',
  festSponsor: 'fest_sponsor',
  curfew: 'curfew',
  festVsRecruiters: 'fest_vs_recruiters',
} as const;

export const EVENT_PAIRS: Record<string, [string, string]> = {
  [PHASE.everyday]: [EVENT.nightCanteen, EVENT.wifiBlackout],
  [PHASE.opportunity]: [EVENT.tournament, EVENT.festSponsor],
  [PHASE.values]: [EVENT.curfew, EVENT.festVsRecruiters],
};

export const PHASE_ORDER = [
  PHASE.manifesto,
  PHASE.everyday,
  PHASE.opportunity,
  PHASE.values,
  PHASE.soapbox,
  PHASE.election,
] as const;

export const PHASE_MICROS: Record<string, bigint> = {
  [PHASE.manifesto]: 30_000_000n,
  [PHASE.everyday]: 30_000_000n,
  [PHASE.opportunity]: 30_000_000n,
  [PHASE.values]: 30_000_000n,
  [PHASE.soapbox]: 30_000_000n,
  [PHASE.election]: 30_000_000n,
};

export const EVENT_DISCUSSION_MICROS = 30_000_000n;
export const EVENT_REACTION_MICROS = 10_000_000n;

export const OPTION_LINE: Record<string, string[]> = {
  [EVENT.nightCanteen]: [
    'accepted a compulsory fee to keep the night canteen open',
    'rejected the fee and promised a public subsidy',
    'closed the night canteen and bet on essential mess work',
  ],
  [EVENT.wifiBlackout]: [
    'promised a full hostel network upgrade',
    'approved temporary hotspots and called it a fix',
    'left Block C on the old vendor and hoped interviews survive',
  ],
  [EVENT.tournament]: [
    'fully backed the national tournament',
    'offered half-support and told Sports to find sponsors',
    'declined the trip and spent the prestige elsewhere',
  ],
  [EVENT.festSponsor]: [
    'sold the fest for branding and student data',
    'rejected the sponsor and promised the institute would pay',
    'took the money but blocked student-data collection',
  ],
  [EVENT.curfew]: [
    'accepted an 11 PM campus curfew',
    'rejected the curfew and promised night transport',
    'cut a temporary 1 AM deal with a review',
  ],
  [EVENT.festVsRecruiters]: [
    'moved the fest for recruiter week',
    'protected fest dates and told recruiters to adapt',
    'split venues and promised more logistics money',
  ],
};

export const EVENT_TITLE: Record<string, string> = {
  [EVENT.nightCanteen]: 'The Night-Canteen Bill',
  [EVENT.wifiBlackout]: 'Placement Week Blackout',
  [EVENT.tournament]: 'The National Tournament',
  [EVENT.festSponsor]: 'The Fest Sponsor',
  [EVENT.curfew]: 'The 11 PM Curfew',
  [EVENT.festVsRecruiters]: 'Fest Versus Recruiter Week',
};

export const REVEAL_GAP_MICROS = 1_600_000n;

export const MIN_BUDGET: Record<string, number> = {
  [ROLE.sports]: 25,
  [ROLE.culture]: 30,
  [ROLE.hostel]: 25,
  [ROLE.placement]: 20,
  [ROLE.welfare]: 20,
};

export const SECRET_PROJECT: Record<string, string> = {
  [ROLE.sports]: PROJECT.carnival,
  [ROLE.culture]: PROJECT.carnival,
  [ROLE.hostel]: PROJECT.commons,
  [ROLE.placement]: PROJECT.careerLab,
  [ROLE.welfare]: PROJECT.renewal,
};

export const EVENT_OPTIONS: Record<string, { facts: string[] }[]> = {
  [EVENT.nightCanteen]: [
    { facts: [FACT.compulsoryFee] },
    { facts: [FACT.subsidyPromised] },
    { facts: [FACT.nightCanteenClosed] },
  ],
  [EVENT.wifiBlackout]: [
    { facts: [FACT.networkUpgrade] },
    { facts: [FACT.hotspotRestored] },
    { facts: [FACT.wifiUnresolved] },
  ],
  [EVENT.tournament]: [
    { facts: [FACT.tournamentBacked] },
    { facts: [FACT.tournamentSponsored] },
    { facts: [FACT.tournamentDeclined] },
  ],
  [EVENT.festSponsor]: [
    { facts: [FACT.sponsorUnrestricted] },
    { facts: [FACT.festSelfFunded] },
    { facts: [FACT.sponsorRestricted] },
  ],
  [EVENT.curfew]: [
    { facts: [FACT.strictCurfew] },
    { facts: [FACT.curfewRejected] },
    { facts: [FACT.curfewCompromise] },
  ],
  [EVENT.festVsRecruiters]: [
    { facts: [FACT.festMoved] },
    { facts: [FACT.recruiterStrained] },
    { facts: [FACT.splitVenues] },
  ],
};

export function isCandidate(role: string): boolean {
  return role === ROLE.builder || role === ROLE.campusStar;
}

export function isBroker(role: string): boolean {
  return (BROKERS as readonly string[]).includes(role);
}

export function isPriority(value: string): boolean {
  return (PRIORITY as readonly string[]).includes(value);
}

export function isProject(value: string): boolean {
  return (
    value === PROJECT.none ||
    value === PROJECT.carnival ||
    value === PROJECT.commons ||
    value === PROJECT.careerLab ||
    value === PROJECT.renewal
  );
}

export function validBudgetStep(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max && value % 5 === 0;
}

export function nextRelationship(state: string, towardAllied: boolean): string {
  if (towardAllied) {
    if (state === REL.burned) return REL.open;
    if (state === REL.open) return REL.allied;
    return REL.allied;
  }
  if (state === REL.allied) return REL.open;
  if (state === REL.open) return REL.burned;
  return REL.burned;
}

export function redLineHit(
  brokerRole: string,
  facts: Set<string>,
  sportsBudget: number,
  cultureBudget: number
): boolean {
  if (brokerRole === ROLE.sports) return sportsBudget < cultureBudget;
  if (brokerRole === ROLE.culture) return facts.has(FACT.strictCurfew);
  if (brokerRole === ROLE.hostel) return facts.has(FACT.compulsoryFee);
  if (brokerRole === ROLE.placement) {
    return facts.has(FACT.recruiterStrained) || facts.has(FACT.wifiUnresolved);
  }
  if (brokerRole === ROLE.welfare) {
    return facts.has(FACT.compulsoryFee) || facts.has(FACT.sponsorUnrestricted);
  }
  return false;
}

export function endingLabel(
  honoured: number,
  accepted: number,
  sports: number,
  culture: number,
  hostel: number,
  placement: number,
  welfare: number
): string {
  const minsMet =
    (sports >= 25 ? 1 : 0) +
    (culture >= 30 ? 1 : 0) +
    (hostel >= 25 ? 1 : 0) +
    (placement >= 20 ? 1 : 0) +
    (welfare >= 20 ? 1 : 0);
  if (accepted > 0 && honoured === accepted) return 'Promise Keeper';
  if (minsMet >= 4) return 'Coalition Builder';
  if (culture >= 30 && hostel >= 25) return 'Campus Populist';
  if (placement >= 25 && sports + placement >= 50) return 'Development President';
  return 'Power Grabber';
}
