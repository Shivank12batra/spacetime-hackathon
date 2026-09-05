export const OPENING = [
  {
    kicker: 'ASTERIA INSTITUTE',
    line: 'The council has ₹100L and no President.',
  },
  {
    kicker: 'THE CONTEST',
    line: 'Two tickets. Five committees. Three votes take the chair.',
  },
  {
    kicker: 'THE REAL GAME',
    line: 'Committees do not win by picking a winner. They win if their department survives the year.',
  },
] as const;

export const PHASE_ANNOUNCE: Record<string, { kicker: string; line: string }> = {
  manifesto: {
    kicker: 'NIGHT ONE',
    line: 'Candidates paint their posters. Committees listen — and start selling votes.',
  },
  everyday: {
    kicker: 'THE CAMPUS WAKES',
    line: 'A crisis hits the hostels. Every door a candidate picks will be remembered.',
  },
  opportunity: {
    kicker: 'PRESTIGE',
    line: 'Glory is on the table. Sports and Culture will not forget who showed up.',
  },
  values: {
    kicker: 'THE LINE',
    line: 'The administration draws a line. Cross it and someone’s red line burns.',
  },
  soapbox: {
    kicker: 'LAST LIGHT',
    line: 'No more crises. Last deals. Then the vault opens.',
  },
  election: {
    kicker: 'THE VAULT',
    line: 'Eyes down. One name. The count is not yet.',
  },
  reveal: {
    kicker: 'THE COUNT',
    line: 'Every sealed ballot is opened. The town hears the names.',
  },
  allocation: {
    kicker: 'THE MANDATE',
    line: 'The President divides ₹100L. Promises become numbers.',
  },
  results: {
    kicker: 'AFTERMATH',
    line: 'Departments rise or fall. That is the only score that matters.',
  },
};

export const RED_LINE_FACTS: Record<string, string[]> = {
  sports: [],
  culture: ['strict_curfew'],
  hostel: ['compulsory_fee'],
  placement: ['recruiter_week_strained', 'wifi_unresolved'],
  welfare: ['compulsory_fee', 'sponsor_unrestricted'],
};

export const FLOOR: Record<string, number> = {
  sports: 25,
  culture: 30,
  hostel: 25,
  placement: 20,
  welfare: 20,
};
