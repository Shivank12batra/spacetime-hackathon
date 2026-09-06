import {
  schema,
  table,
  t,
  SenderError,
  type InferSchema,
  type ReducerCtx,
} from 'spacetimedb/server';
import { ScheduleAt, Timestamp } from 'spacetimedb';
import {
  BROKERS,
  CANDIDATES,
  DEAL,
  EVENT_DISCUSSION_MICROS,
  EVENT_OPTIONS,
  EVENT_PAIRS,
  EVENT_REACTION_MICROS,
  EVENT_TITLE,
  MATCH_ID,
  OPTION_LINE,
  MIN_BUDGET,
  PHASE,
  PHASE_MICROS,
  PHASE_ORDER,
  PROJECT,
  REL,
  REVEAL_GAP_MICROS,
  ROLE,
  SECRET_PROJECT,
  SUPPORT,
  endingLabel,
  isBroker,
  isCandidate,
  isPriority,
  isProject,
  nextRelationship,
  redLineHit,
  validBudgetStep,
} from './game';

const match_state = table(
  { name: 'match_state', public: true },
  {
    id: t.u64().primaryKey(),
    phase: t.string(),
    phase_ends_at: t.timestamp(),
    event_id: t.string(),
    winner_role: t.string(),
    flagship: t.string(),
    sports_budget: t.u32(),
    culture_budget: t.u32(),
    hostel_budget: t.u32(),
    placement_budget: t.u32(),
    welfare_budget: t.u32(),
    ballots_revealed: t.u32(),
    deals_locked: t.bool(),
    win_at: t.u32(),
    ending: t.string(),
    deadline_micros: t.u64().default(0n),
    event_stage: t.string().default(''),
    stage_deadline_micros: t.u64().default(0n),
    choices_locked: t.u32().default(0),
    reactions_locked: t.u32().default(0),
  }
);

const player = table(
  { name: 'player', public: true },
  {
    identity: t.identity().primaryKey(),
    display_name: t.string(),
    role: t.string(),
    ready: t.bool(),
  }
);

const candidate_profile = table(
  { name: 'candidate_profile', public: true },
  {
    role: t.string().primaryKey(),
    priority_one: t.string(),
    priority_two: t.string(),
  }
);

const endorsement = table(
  { name: 'endorsement', public: true },
  {
    broker_role: t.string().primaryKey(),
    candidate_role: t.string(),
  }
);

const relationship = table(
  {
    name: 'relationship',
    indexes: [
      {
        accessor: 'by_pair',
        algorithm: 'btree',
        columns: ['candidate_role', 'broker_role'],
      },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    candidate_role: t.string(),
    broker_role: t.string(),
    state: t.string(),
  }
);

const deal = table(
  {
    name: 'deal',
    indexes: [
      {
        accessor: 'by_pair',
        algorithm: 'btree',
        columns: ['candidate_role', 'broker_role'],
      },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    candidate_role: t.string(),
    broker_role: t.string(),
    promised_budget: t.u32(),
    promised_project: t.string(),
    requested_support: t.string(),
    status: t.string(),
    from_role: t.string(),
    exposed: t.bool(),
  }
);

const exposed_deal = table(
  { name: 'exposed_deal', public: true },
  {
    id: t.u64().primaryKey(),
    candidate_role: t.string(),
    broker_role: t.string(),
    promised_budget: t.u32(),
    promised_project: t.string(),
    requested_support: t.string(),
  }
);

const hidden_choice = table(
  {
    name: 'hidden_choice',
    indexes: [
      {
        accessor: 'by_event_candidate',
        algorithm: 'btree',
        columns: ['event_id', 'candidate_role'],
      },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    event_id: t.string(),
    candidate_role: t.string(),
    option_index: t.u8(),
    budget_commit: t.u32(),
  }
);

const revealed_choice = table(
  {
    name: 'revealed_choice',
    public: true,
    indexes: [
      {
        accessor: 'by_event',
        algorithm: 'btree',
        columns: ['event_id'],
      },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    event_id: t.string(),
    candidate_role: t.string(),
    option_index: t.u8(),
    budget_commit: t.u32(),
  }
);

const reaction = table(
  {
    name: 'reaction',
    public: true,
    indexes: [
      {
        accessor: 'by_event_pair',
        algorithm: 'btree',
        columns: ['event_id', 'broker_role', 'candidate_role'],
      },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    event_id: t.string(),
    broker_role: t.string(),
    candidate_role: t.string(),
    stance: t.string(),
  }
);

const campus_fact = table(
  { name: 'campus_fact', public: true },
  {
    id: t.u64().primaryKey().autoInc(),
    fact_id: t.string(),
    source_role: t.string(),
  }
);

const feed_item = table(
  { name: 'feed_item', public: true },
  {
    id: t.u64().primaryKey().autoInc(),
    created_at: t.timestamp(),
    body: t.string(),
  }
);

const ballot = table(
  { name: 'ballot' },
  {
    broker_role: t.string().primaryKey(),
    candidate_role: t.string(),
  }
);

const revealed_ballot = table(
  { name: 'revealed_ballot', public: true },
  {
    broker_role: t.string().primaryKey(),
    candidate_role: t.string(),
    matched_endorsement: t.bool(),
  }
);

const broker_result = table(
  { name: 'broker_result', public: true },
  {
    broker_role: t.string().primaryKey(),
    score: t.i32(),
    tier: t.string(),
    deal_honoured: t.bool(),
    had_deal: t.bool(),
    voted_winner: t.bool(),
    min_met: t.bool(),
    secret_met: t.bool(),
    red_line_hit: t.bool(),
    endorsement_betrayal: t.bool(),
  }
);

const phase_timer = table(
  {
    name: 'phase_timer',
    scheduled: (): any => onPhaseTick,
  },
  {
    scheduled_id: t.u64().primaryKey().autoInc(),
    scheduled_at: t.scheduleAt(),
    kind: t.string(),
  }
);

const spacetimedb = schema({
  match_state,
  player,
  candidate_profile,
  endorsement,
  relationship,
  deal,
  exposed_deal,
  hidden_choice,
  revealed_choice,
  reaction,
  campus_fact,
  feed_item,
  ballot,
  revealed_ballot,
  broker_result,
  phase_timer,
});

export default spacetimedb;

type Ctx = ReducerCtx<InferSchema<typeof spacetimedb>>;

function requireMatch(ctx: Ctx) {
  const match = ctx.db.match_state.id.find(MATCH_ID);
  if (!match) throw new SenderError('match is not ready');
  return match;
}

function requirePlayer(ctx: Ctx) {
  const row = ctx.db.player.identity.find(ctx.sender);
  if (!row) throw new SenderError('join the game first');
  return row;
}

function requireRole(ctx: Ctx) {
  const row = requirePlayer(ctx);
  if (!row.role) throw new SenderError('claim a role first');
  return row;
}

function playerByRole(ctx: Ctx, role: string) {
  return [...ctx.db.player.iter()].find(p => p.role === role);
}

function seatedBrokers(ctx: Ctx): string[] {
  return BROKERS.filter(role => playerByRole(ctx, role));
}

function post(ctx: Ctx, body: string) {
  ctx.db.feed_item.insert({ id: 0n, created_at: ctx.timestamp, body });
}

function roleLabel(role: string): string {
  if (role === ROLE.builder) return 'The Builder';
  if (role === ROLE.campusStar) return 'The Campus Star';
  if (role === ROLE.sports) return 'Sports';
  if (role === ROLE.culture) return 'Culture';
  if (role === ROLE.hostel) return 'Hostel & Mess';
  if (role === ROLE.placement) return 'Placement';
  if (role === ROLE.welfare) return 'Welfare';
  return role;
}

function findRelationship(ctx: Ctx, candidateRole: string, brokerRole: string) {
  return [...ctx.db.relationship.by_pair.filter([candidateRole, brokerRole])][0];
}

function setRelationship(
  ctx: Ctx,
  candidateRole: string,
  brokerRole: string,
  state: string
) {
  const existing = findRelationship(ctx, candidateRole, brokerRole);
  if (!existing) {
    ctx.db.relationship.insert({
      id: 0n,
      candidate_role: candidateRole,
      broker_role: brokerRole,
      state,
    });
    return;
  }
  ctx.db.relationship.id.update({ ...existing, state });
}

function withdrawEndorsement(ctx: Ctx, brokerRole: string, silent = false) {
  const row = ctx.db.endorsement.broker_role.find(brokerRole);
  if (!row || !row.candidate_role) return;
  ctx.db.endorsement.broker_role.update({ ...row, candidate_role: '' });
  if (!silent) {
    post(ctx, `${roleLabel(brokerRole)} withdrew their endorsement.`);
  }
}

function pendingDeal(ctx: Ctx, candidateRole: string, brokerRole: string) {
  return [...ctx.db.deal.by_pair.filter([candidateRole, brokerRole])].find(
    row => row.status === DEAL.pending
  );
}

function acceptedDeal(ctx: Ctx, candidateRole: string, brokerRole: string) {
  return [...ctx.db.deal.by_pair.filter([candidateRole, brokerRole])].find(
    row => row.status === DEAL.accepted
  );
}

function clearTimers(ctx: Ctx) {
  for (const row of [...ctx.db.phase_timer.iter()]) {
    ctx.db.phase_timer.scheduled_id.delete(row.scheduled_id);
  }
}

function scheduleIn(ctx: Ctx, micros: bigint, kind: string) {
  clearTimers(ctx);
  ctx.db.phase_timer.insert({
    scheduled_id: 0n,
    scheduled_at: ScheduleAt.time(ctx.timestamp.microsSinceUnixEpoch + micros),
    kind,
  });
}

function seedRelationships(ctx: Ctx) {
  for (const candidateRole of CANDIDATES) {
    for (const brokerRole of BROKERS) {
      let state: string = REL.open;
      if (candidateRole === ROLE.builder && brokerRole === ROLE.placement) {
        state = REL.allied;
      }
      if (candidateRole === ROLE.campusStar && brokerRole === ROLE.culture) {
        state = REL.allied;
      }
      ctx.db.relationship.insert({
        id: 0n,
        candidate_role: candidateRole,
        broker_role: brokerRole,
        state,
      });
    }
  }
}

function seedMatch(ctx: Ctx) {
  if (ctx.db.match_state.id.find(MATCH_ID)) return;
  ctx.db.match_state.insert({
    id: MATCH_ID,
    phase: PHASE.lobby,
    phase_ends_at: ctx.timestamp,
    event_id: '',
    winner_role: '',
    flagship: '',
    sports_budget: 0,
    culture_budget: 0,
    hostel_budget: 0,
    placement_budget: 0,
    welfare_budget: 0,
    ballots_revealed: 0,
    deals_locked: false,
    win_at: 3,
    ending: '',
    deadline_micros: 0n,
    event_stage: '',
    stage_deadline_micros: 0n,
    choices_locked: 0,
    reactions_locked: 0,
  });
  for (const role of CANDIDATES) {
    ctx.db.candidate_profile.insert({
      role,
      priority_one: '',
      priority_two: '',
    });
  }
  for (const role of BROKERS) {
    ctx.db.endorsement.insert({ broker_role: role, candidate_role: '' });
  }
}

function wipeGameplay(ctx: Ctx) {
  clearTimers(ctx);
  for (const row of [...ctx.db.relationship.iter()]) ctx.db.relationship.id.delete(row.id);
  for (const row of [...ctx.db.deal.iter()]) ctx.db.deal.id.delete(row.id);
  for (const row of [...ctx.db.exposed_deal.iter()]) ctx.db.exposed_deal.id.delete(row.id);
  for (const row of [...ctx.db.hidden_choice.iter()]) ctx.db.hidden_choice.id.delete(row.id);
  for (const row of [...ctx.db.revealed_choice.iter()]) ctx.db.revealed_choice.id.delete(row.id);
  for (const row of [...ctx.db.reaction.iter()]) ctx.db.reaction.id.delete(row.id);
  for (const row of [...ctx.db.campus_fact.iter()]) ctx.db.campus_fact.id.delete(row.id);
  for (const row of [...ctx.db.feed_item.iter()]) ctx.db.feed_item.id.delete(row.id);
  for (const row of [...ctx.db.ballot.iter()]) ctx.db.ballot.broker_role.delete(row.broker_role);
  for (const row of [...ctx.db.revealed_ballot.iter()]) {
    ctx.db.revealed_ballot.broker_role.delete(row.broker_role);
  }
  for (const row of [...ctx.db.broker_result.iter()]) {
    ctx.db.broker_result.broker_role.delete(row.broker_role);
  }
  for (const row of [...ctx.db.candidate_profile.iter()]) {
    ctx.db.candidate_profile.role.update({
      ...row,
      priority_one: '',
      priority_two: '',
    });
  }
  for (const row of [...ctx.db.endorsement.iter()]) {
    ctx.db.endorsement.broker_role.update({ ...row, candidate_role: '' });
  }
  for (const row of [...ctx.db.player.iter()]) {
    ctx.db.player.identity.update({ ...row, ready: false });
  }
}

function pickEvent(ctx: Ctx, phase: string): string {
  const pair = EVENT_PAIRS[phase];
  if (!pair) return '';
  return ctx.random() < 0.5 ? pair[0] : pair[1];
}

function enterPhase(ctx: Ctx, phase: string) {
  const match = requireMatch(ctx);
  const eventId = EVENT_PAIRS[phase] ? pickEvent(ctx, phase) : '';
  const isEvent = !!eventId;
  const dealsLocked = phase === PHASE.soapbox || phase === PHASE.election || phase === PHASE.reveal || phase === PHASE.allocation || phase === PHASE.results;
  const duration = isEvent ? EVENT_DISCUSSION_MICROS : (PHASE_MICROS[phase] ?? 0n);
  const until = ctx.timestamp.microsSinceUnixEpoch + duration;
  ctx.db.match_state.id.update({
    ...match,
    phase,
    event_id: eventId,
    phase_ends_at: new Timestamp(until),
    deadline_micros: until,
    deals_locked: dealsLocked,
    event_stage: isEvent ? 'discussion' : '',
    stage_deadline_micros: isEvent ? until : 0n,
    choices_locked: 0,
    reactions_locked: 0,
  });
  if (duration) scheduleIn(ctx, duration, isEvent ? 'event_discussion' : 'phase');
  if (phase === PHASE.manifesto) {
    post(ctx, 'BULLETIN|Asteria Radio: Manifesto night. Two candidates. Five committee heads. No one can fund everyone.');
  } else if (phase === PHASE.everyday) {
    post(ctx, 'BULLETIN|Breaking: an everyday campus fight just hit the lawn. Candidates choose in secret.');
  } else if (phase === PHASE.opportunity) {
    post(ctx, 'BULLETIN|A prestige offer is on the table. Someone will be left out of the photograph.');
  } else if (phase === PHASE.values) {
    post(ctx, 'BULLETIN|Values conflict. This is where coalitions go to die.');
  } else if (phase === PHASE.soapbox) {
    const lines = [...ctx.db.revealed_choice.iter()].map(choice => {
      const line = OPTION_LINE[choice.event_id]?.[choice.option_index] ?? `took option ${choice.option_index + 1}`;
      return `${roleLabel(choice.candidate_role)} ${line}`;
    });
    post(
      ctx,
      `VERDICT|SOAPBOX VERDICT — Deals are locked. ${
        lines.length ? lines.join(' ') : 'No public crisis choices were recorded.'
      } Withdraw, expose, then vote.`
    );
  } else if (phase === PHASE.election) {
    post(ctx, 'BULLETIN|Ballots are open. Secret votes. First to the majority becomes President of Asteria.');
  }
}

function maybeRevealChoices(ctx: Ctx, force = false) {
  const match = requireMatch(ctx);
  if (!match.event_id) return;
  if ([...ctx.db.revealed_choice.by_event.filter(match.event_id)].length > 0) return;
  let hidden = [...ctx.db.hidden_choice.iter()].filter(row => row.event_id === match.event_id);
  if (force) {
    for (const candidateRole of CANDIDATES) {
      if (!playerByRole(ctx, candidateRole)) continue;
      if (hidden.some(row => row.candidate_role === candidateRole)) continue;
      ctx.db.hidden_choice.insert({
        id: 0n,
        event_id: match.event_id,
        candidate_role: candidateRole,
        option_index: 0,
        budget_commit: 0,
      });
    }
    hidden = [...ctx.db.hidden_choice.iter()].filter(row => row.event_id === match.event_id);
  }
  if (hidden.length === 0) return;
  if (hidden.length < 2 && !force) return;
  for (const choice of hidden) {
    ctx.db.revealed_choice.insert({
      id: 0n,
      event_id: choice.event_id,
      candidate_role: choice.candidate_role,
      option_index: choice.option_index,
      budget_commit: choice.budget_commit,
    });
    const option = EVENT_OPTIONS[choice.event_id]?.[choice.option_index];
    if (option) {
      for (const factId of option.facts) {
        ctx.db.campus_fact.insert({ id: 0n, fact_id: factId, source_role: choice.candidate_role });
      }
    }
    post(
      ctx,
      `${roleLabel(choice.candidate_role)} ${OPTION_LINE[choice.event_id]?.[choice.option_index] ?? `took option ${choice.option_index + 1}`}${
        choice.budget_commit > 0 ? ` and floated ₹${choice.budget_commit}L in public` : ''
      }.`
    );
  }
  const title = EVENT_TITLE[match.event_id] ?? 'Campus crisis';
  const same = hidden[0]?.option_index === hidden[1]?.option_index;
  post(
    ctx,
    `VERDICT|CAMPUS VERDICT — ${title}. ${hidden
      .map(choice => {
        const line = OPTION_LINE[choice.event_id]?.[choice.option_index] ?? `took option ${choice.option_index + 1}`;
        return `${roleLabel(choice.candidate_role)} ${line}`;
      })
      .join(same ? ' Both tickets landed in the same place: wait — ' : ' Meanwhile, ')}. ${
      same
        ? 'The campus heard one answer twice. Kingmakers, mark who this actually serves.'
        : 'Two different Asterias were just promised. React. Endorse. Or burn the deal.'
    }`
  );
}

function tryCloseElection(ctx: Ctx, force: boolean = false) {
  const match = requireMatch(ctx);
  if (match.phase !== PHASE.election) return;
  const needed = seatedBrokers(ctx);
  if (needed.length === 0) return;
  const submitted = [...ctx.db.ballot.iter()].filter(row => needed.includes(row.broker_role as typeof BROKERS[number]));
  if (submitted.length < needed.length) {
    if (!force) return;
    // Auto-cast for any uncast ballots when force-advancing or timing out
    for (const brokerRole of needed) {
      if (!ctx.db.ballot.broker_role.find(brokerRole)) {
        const endorsement = ctx.db.endorsement.broker_role.find(brokerRole);
        const fallback = endorsement?.candidate_role || ROLE.builder;
        ctx.db.ballot.insert({ broker_role: brokerRole, candidate_role: fallback });
      }
    }
  }
  ctx.db.match_state.id.update({
    ...match,
    phase: PHASE.reveal,
    ballots_revealed: 0,
    event_stage: '',
    stage_deadline_micros: 0n,
    deadline_micros: 0n,
  });
  scheduleIn(ctx, 400_000n, 'reveal');
  post(ctx, 'Every ballot is in. The count begins.');
}

function revealNextBallot(ctx: Ctx) {
  const match = requireMatch(ctx);
  if (match.phase !== PHASE.reveal) return;
  const order = seatedBrokers(ctx);
  const index = match.ballots_revealed;
  if (index >= order.length) {
    const tallies = { [ROLE.builder]: 0, [ROLE.campusStar]: 0 };
    for (const row of [...ctx.db.revealed_ballot.iter()]) {
      if (row.candidate_role === ROLE.builder) tallies[ROLE.builder] += 1;
      if (row.candidate_role === ROLE.campusStar) tallies[ROLE.campusStar] += 1;
    }
    let winner = match.winner_role;
    if (!winner) {
      if (tallies[ROLE.campusStar] > tallies[ROLE.builder]) winner = ROLE.campusStar;
      else winner = ROLE.builder;
    }
    ctx.db.match_state.id.update({
      ...match,
      phase: PHASE.allocation,
      winner_role: winner,
      deadline_micros: 0n,
    });
    clearTimers(ctx);
    post(ctx, `${roleLabel(winner)} is President. The ₹100L budget is theirs.`);
    return;
  }
  const brokerRole = order[index];
  const hidden = ctx.db.ballot.broker_role.find(brokerRole);
  if (!hidden) return;
  const endorsementRow = ctx.db.endorsement.broker_role.find(brokerRole);
  const matched = endorsementRow?.candidate_role === hidden.candidate_role;
  if (!ctx.db.revealed_ballot.broker_role.find(brokerRole)) {
    ctx.db.revealed_ballot.insert({
      broker_role: brokerRole,
      candidate_role: hidden.candidate_role,
      matched_endorsement: !endorsementRow?.candidate_role || matched,
    });
  }
  const counts = { [ROLE.builder]: 0, [ROLE.campusStar]: 0 };
  for (const row of [...ctx.db.revealed_ballot.iter()]) {
    if (row.candidate_role === ROLE.builder) counts[ROLE.builder] += 1;
    if (row.candidate_role === ROLE.campusStar) counts[ROLE.campusStar] += 1;
  }
  let winner = match.winner_role;
  if (!winner && counts[ROLE.builder] >= match.win_at) winner = ROLE.builder;
  if (!winner && counts[ROLE.campusStar] >= match.win_at) winner = ROLE.campusStar;
  ctx.db.match_state.id.update({
    ...match,
    ballots_revealed: index + 1,
    winner_role: winner,
  });
  post(
    ctx,
    `${roleLabel(brokerRole)} voted for ${roleLabel(hidden.candidate_role)}${
      winner && winner !== match.winner_role ? ` — that locks the presidency.` : '.'
    }`
  );
  scheduleIn(ctx, REVEAL_GAP_MICROS, 'reveal');
}

function budgetFor(match: ReturnType<typeof requireMatch>, role: string): number {
  if (role === ROLE.sports) return match.sports_budget;
  if (role === ROLE.culture) return match.culture_budget;
  if (role === ROLE.hostel) return match.hostel_budget;
  if (role === ROLE.placement) return match.placement_budget;
  if (role === ROLE.welfare) return match.welfare_budget;
  return 0;
}

function resolveGovernment(ctx: Ctx) {
  const match = requireMatch(ctx);
  const facts = new Set([...ctx.db.campus_fact.iter()].map(row => row.fact_id));
  let honoured = 0;
  let accepted = 0;
  for (const brokerRole of BROKERS) {
    const vote = ctx.db.ballot.broker_role.find(brokerRole);
    const endorsementRow = ctx.db.endorsement.broker_role.find(brokerRole);
    const dealRow = match.winner_role
      ? acceptedDeal(ctx, match.winner_role, brokerRole)
      : undefined;
    const allocated = budgetFor(match, brokerRole);
    const minMet = allocated >= (MIN_BUDGET[brokerRole] ?? 99);
    const secretMet = match.flagship === (SECRET_PROJECT[brokerRole] ?? '');
    const lineHit = redLineHit(
      brokerRole,
      facts,
      match.sports_budget,
      match.culture_budget
    );
    const votedWinner = !!vote && vote.candidate_role === match.winner_role;
    const endorsementBetrayal = !!(
      endorsementRow?.candidate_role &&
      vote &&
      endorsementRow.candidate_role !== vote.candidate_role
    );
    let dealHonoured = false;
    let hadDeal = false;
    if (dealRow) {
      hadDeal = true;
      accepted += 1;
      const budgetOk = allocated >= dealRow.promised_budget;
      const projectOk =
        !dealRow.promised_project || dealRow.promised_project === match.flagship;
      dealHonoured = budgetOk && projectOk;
      if (dealHonoured) honoured += 1;
      else setRelationship(ctx, match.winner_role, brokerRole, REL.burned);
    }
    let score = 0;
    if (minMet) score += 2;
    if (secretMet) score += 1;
    if (votedWinner) score += 1;
    if (lineHit) score -= 1;
    if (endorsementBetrayal) score -= 1;
    const tier = score >= 3 ? 'Victory' : score >= 1 ? 'Partial Success' : 'Political Defeat';
    if (ctx.db.broker_result.broker_role.find(brokerRole)) {
      ctx.db.broker_result.broker_role.update({
        broker_role: brokerRole,
        score,
        tier,
        deal_honoured: dealHonoured,
        had_deal: hadDeal,
        voted_winner: votedWinner,
        min_met: minMet,
        secret_met: secretMet,
        red_line_hit: lineHit,
        endorsement_betrayal: endorsementBetrayal,
      });
    } else {
      ctx.db.broker_result.insert({
        broker_role: brokerRole,
        score,
        tier,
        deal_honoured: dealHonoured,
        had_deal: hadDeal,
        voted_winner: votedWinner,
        min_met: minMet,
        secret_met: secretMet,
        red_line_hit: lineHit,
        endorsement_betrayal: endorsementBetrayal,
      });
    }
  }
  const ending = endingLabel(
    honoured,
    accepted,
    match.sports_budget,
    match.culture_budget,
    match.hostel_budget,
    match.placement_budget,
    match.welfare_budget
  );
  ctx.db.match_state.id.update({
    ...requireMatch(ctx),
    phase: PHASE.results,
    ending,
    deadline_micros: 0n,
    event_stage: '',
    stage_deadline_micros: 0n,
  });
  clearTimers(ctx);
  post(ctx, `The budget is public. ${roleLabel(match.winner_role)} leaves office as a ${ending}.`);
}

function beginReactionStage(ctx: Ctx) {
  const match = requireMatch(ctx);
  if (!match.event_id || match.event_stage !== 'discussion') return;
  maybeRevealChoices(ctx, true);
  const current = requireMatch(ctx);
  const until = ctx.timestamp.microsSinceUnixEpoch + EVENT_REACTION_MICROS;
  ctx.db.match_state.id.update({
    ...current,
    phase_ends_at: new Timestamp(until),
    deadline_micros: until,
    event_stage: 'reaction',
    stage_deadline_micros: until,
    reactions_locked: 0,
  });
  scheduleIn(ctx, EVENT_REACTION_MICROS, 'event_reaction');
}

function advanceToNextPhase(ctx: Ctx) {
  const match = requireMatch(ctx);
  const index = PHASE_ORDER.indexOf(match.phase as (typeof PHASE_ORDER)[number]);
  if (index < 0) return;
  const next = PHASE_ORDER[index + 1];
  if (next) enterPhase(ctx, next);
}

function advanceFromTimer(ctx: Ctx, kind: string) {
  const match = requireMatch(ctx);
  if (kind === 'reveal') {
    revealNextBallot(ctx);
    return;
  }
  if (kind === 'event_discussion') {
    beginReactionStage(ctx);
    return;
  }
  if (kind === 'event_reaction') {
    advanceToNextPhase(ctx);
    return;
  }
  if (match.phase === PHASE.lobby || match.phase === PHASE.allocation || match.phase === PHASE.results) {
    return;
  }
  if (match.phase === PHASE.election) {
    tryCloseElection(ctx, true);
    return;
  }
  if (match.phase === PHASE.reveal) {
    revealNextBallot(ctx);
    return;
  }
  if (match.event_id) {
    if (match.event_stage === 'discussion') beginReactionStage(ctx);
    else advanceToNextPhase(ctx);
    return;
  }
  advanceToNextPhase(ctx);
}

export const myRelationship = spacetimedb.view(
  { name: 'my_relationship', public: true },
  t.array(relationship.rowType),
  ctx => {
    const me = ctx.db.player.identity.find(ctx.sender);
    if (!me?.role) return [];
    return [...ctx.db.relationship.iter()].filter(
      row => row.candidate_role === me.role || row.broker_role === me.role
    );
  }
);

export const myDeal = spacetimedb.view(
  { name: 'my_deal', public: true },
  t.array(deal.rowType),
  ctx => {
    const me = ctx.db.player.identity.find(ctx.sender);
    if (!me?.role) return [];
    return [...ctx.db.deal.iter()].filter(
      row => row.candidate_role === me.role || row.broker_role === me.role
    );
  }
);

export const myHiddenChoice = spacetimedb.view(
  { name: 'my_hidden_choice', public: true },
  t.array(hidden_choice.rowType),
  ctx => {
    const me = ctx.db.player.identity.find(ctx.sender);
    if (!me?.role || !isCandidate(me.role)) return [];
    return [...ctx.db.hidden_choice.iter()].filter(row => row.candidate_role === me.role);
  }
);

export const myBallot = spacetimedb.view(
  { name: 'my_ballot', public: true },
  t.array(ballot.rowType),
  ctx => {
    const me = ctx.db.player.identity.find(ctx.sender);
    if (!me?.role || !isBroker(me.role)) return [];
    const row = ctx.db.ballot.broker_role.find(me.role);
    return row ? [row] : [];
  }
);

export const init = spacetimedb.init(ctx => {
  seedMatch(ctx);
});

export const onConnect = spacetimedb.clientConnected(_ctx => {});

export const onDisconnect = spacetimedb.clientDisconnected(_ctx => {});

export const onPhaseTick = spacetimedb.reducer(
  { timer: phase_timer.rowType },
  (ctx, { timer }) => {
    advanceFromTimer(ctx, timer.kind);
  }
);

export const joinGame = spacetimedb.reducer(
  { displayName: t.string() },
  (ctx, { displayName }) => {
    seedMatch(ctx);
    const name = displayName.trim().slice(0, 24) || 'Anonymous';
    const existing = ctx.db.player.identity.find(ctx.sender);
    if (existing) {
      ctx.db.player.identity.update({ ...existing, display_name: name });
      return;
    }
    ctx.db.player.insert({
      identity: ctx.sender,
      display_name: name,
      role: '',
      ready: false,
    });
  }
);

export const claimRole = spacetimedb.reducer(
  { role: t.string() },
  (ctx, { role }) => {
    const match = requireMatch(ctx);
    if (match.phase !== PHASE.lobby) throw new SenderError('roles are locked');
    if (!isCandidate(role) && !isBroker(role)) throw new SenderError('unknown role');
    const me = requirePlayer(ctx);
    const taken = playerByRole(ctx, role);
    if (taken && !taken.identity.equals(ctx.sender)) {
      throw new SenderError('that seat is taken');
    }
    ctx.db.player.identity.update({ ...me, role, ready: false });
  }
);

export const setReady = spacetimedb.reducer(
  { ready: t.bool() },
  (ctx, { ready }) => {
    const match = requireMatch(ctx);
    if (match.phase !== PHASE.lobby) throw new SenderError('match already started');
    const me = requireRole(ctx);
    ctx.db.player.identity.update({ ...me, ready });
  }
);

export const startMatch = spacetimedb.reducer(ctx => {
  const match = requireMatch(ctx);
  if (match.phase !== PHASE.lobby) throw new SenderError('already underway');
  if (!playerByRole(ctx, ROLE.builder) || !playerByRole(ctx, ROLE.campusStar)) {
    throw new SenderError('both candidates must be seated');
  }
  const brokers = seatedBrokers(ctx);
  if (brokers.length !== 5) {
    throw new SenderError('all five committee heads must be seated');
  }
  const seated = [...ctx.db.player.iter()].filter(player => player.role);
  if (seated.length !== 7 || seated.some(player => !player.ready)) {
    throw new SenderError('all seven players must seal their roles');
  }
  wipeGameplay(ctx);
  seedRelationships(ctx);
  ctx.db.match_state.id.update({
    ...requireMatch(ctx),
    winner_role: '',
    flagship: '',
    sports_budget: 0,
    culture_budget: 0,
    hostel_budget: 0,
    placement_budget: 0,
    welfare_budget: 0,
    ballots_revealed: 0,
    deals_locked: false,
    win_at: 3,
    ending: '',
  });
  enterPhase(ctx, PHASE.manifesto);
});

export const resetMatch = spacetimedb.reducer(ctx => {
  wipeGameplay(ctx);
  const match = requireMatch(ctx);
  ctx.db.match_state.id.update({
    ...match,
    phase: PHASE.lobby,
    event_id: '',
    winner_role: '',
    flagship: '',
    sports_budget: 0,
    culture_budget: 0,
    hostel_budget: 0,
    placement_budget: 0,
    welfare_budget: 0,
    ballots_revealed: 0,
    deals_locked: false,
    win_at: 3,
    ending: '',
    phase_ends_at: ctx.timestamp,
    deadline_micros: 0n,
    event_stage: '',
    stage_deadline_micros: 0n,
    choices_locked: 0,
    reactions_locked: 0,
  });
  for (const row of [...ctx.db.player.iter()]) {
    ctx.db.player.identity.update({ ...row, role: '', ready: false });
  }
  post(ctx, 'The room reset. Claim seats again.');
});

export const forceAdvance = spacetimedb.reducer(ctx => {
  requireRole(ctx);
  const match = requireMatch(ctx);
  if (match.phase === PHASE.reveal) {
    revealNextBallot(ctx);
    return;
  }
  if (match.phase === PHASE.election) {
    tryCloseElection(ctx, true);
    return;
  }
  advanceFromTimer(ctx, 'phase');
});

export const setPriorities = spacetimedb.reducer(
  { priorityOne: t.string(), priorityTwo: t.string() },
  (ctx, { priorityOne, priorityTwo }) => {
    const match = requireMatch(ctx);
    if (match.phase !== PHASE.manifesto && match.phase !== PHASE.everyday && match.phase !== PHASE.opportunity) {
      throw new SenderError('manifesto window is closed');
    }
    const me = requireRole(ctx);
    if (!isCandidate(me.role)) throw new SenderError('only candidates set priorities');
    if (!isPriority(priorityOne) || !isPriority(priorityTwo) || priorityOne === priorityTwo) {
      throw new SenderError('pick two different priorities');
    }
    const profile = ctx.db.candidate_profile.role.find(me.role);
    if (!profile) throw new SenderError('missing candidate profile');
    ctx.db.candidate_profile.role.update({
      ...profile,
      priority_one: priorityOne,
      priority_two: priorityTwo,
    });
    post(
      ctx,
      `BULLETIN|${me.display_name} locked a manifesto: ${priorityOne} and ${priorityTwo}. The lawn has their word, not their budget.`
    );
  }
);

export const proposeDeal = spacetimedb.reducer(
  {
    brokerRole: t.string(),
    candidateRole: t.string(),
    promisedBudget: t.u32(),
    promisedProject: t.string(),
    requestedSupport: t.string(),
  },
  (ctx, { brokerRole, candidateRole, promisedBudget, promisedProject, requestedSupport }) => {
    const match = requireMatch(ctx);
    if (match.deals_locked) throw new SenderError('deals are locked');
    if (match.phase === PHASE.lobby || match.phase === PHASE.election || match.phase === PHASE.reveal) {
      throw new SenderError('not a negotiation window');
    }
    const me = requireRole(ctx);
    const candidate = isCandidate(me.role) ? me.role : candidateRole;
    const broker = isBroker(me.role) ? me.role : brokerRole;
    if (!isCandidate(candidate) || !isBroker(broker)) {
      throw new SenderError('deals run between a candidate and a kingmaker');
    }
    if (!validBudgetStep(promisedBudget, 0, 40)) throw new SenderError('budget must be ₹0–40L in 5s');
    if (!isProject(promisedProject)) throw new SenderError('unknown project');
    if (promisedBudget === 0 && !promisedProject) throw new SenderError('offer money or a project');
    if (requestedSupport !== SUPPORT.electoral && requestedSupport !== SUPPORT.endorsement) {
      throw new SenderError('ask for a vote or an endorsement');
    }
    const rel = findRelationship(ctx, candidate, broker);
    if (!rel || rel.state === REL.burned) throw new SenderError('that relationship is burned');
    const existing = pendingDeal(ctx, candidate, broker);
    if (existing) ctx.db.deal.id.delete(existing.id);
    ctx.db.deal.insert({
      id: 0n,
      candidate_role: candidate,
      broker_role: broker,
      promised_budget: promisedBudget,
      promised_project: promisedProject,
      requested_support: requestedSupport,
      status: DEAL.pending,
      from_role: me.role,
      exposed: false,
    });
  }
);

export const counterDeal = spacetimedb.reducer(
  {
    dealId: t.u64(),
    promisedBudget: t.u32(),
    promisedProject: t.string(),
    requestedSupport: t.string(),
  },
  (ctx, { dealId, promisedBudget, promisedProject, requestedSupport }) => {
    const match = requireMatch(ctx);
    if (match.deals_locked) throw new SenderError('deals are locked');
    const me = requireRole(ctx);
    const row = ctx.db.deal.id.find(dealId);
    if (!row || row.status !== DEAL.pending) throw new SenderError('no pending deal');
    if (row.from_role === me.role) throw new SenderError('wait for the other side');
    if (me.role !== row.candidate_role && me.role !== row.broker_role) {
      throw new SenderError('not your deal');
    }
    if (!validBudgetStep(promisedBudget, 0, 40)) throw new SenderError('budget must be ₹0–40L in 5s');
    if (!isProject(promisedProject)) throw new SenderError('unknown project');
    if (promisedBudget === 0 && !promisedProject) throw new SenderError('offer money or a project');
    if (requestedSupport !== SUPPORT.electoral && requestedSupport !== SUPPORT.endorsement) {
      throw new SenderError('ask for a vote or an endorsement');
    }
    ctx.db.deal.id.update({
      ...row,
      promised_budget: promisedBudget,
      promised_project: promisedProject,
      requested_support: requestedSupport,
      from_role: me.role,
    });
  }
);

export const acceptDeal = spacetimedb.reducer(
  { dealId: t.u64() },
  (ctx, { dealId }) => {
    const match = requireMatch(ctx);
    if (match.deals_locked) throw new SenderError('deals are locked');
    const me = requireRole(ctx);
    const row = ctx.db.deal.id.find(dealId);
    if (!row || row.status !== DEAL.pending) throw new SenderError('no pending deal');
    if (row.from_role === me.role) throw new SenderError('you already tabled this');
    if (me.role !== row.candidate_role && me.role !== row.broker_role) {
      throw new SenderError('not your deal');
    }
    const previous = acceptedDeal(ctx, row.candidate_role, row.broker_role);
    if (previous) ctx.db.deal.id.update({ ...previous, status: DEAL.rejected });
    ctx.db.deal.id.update({ ...row, status: DEAL.accepted });
    setRelationship(ctx, row.candidate_role, row.broker_role, REL.allied);
  }
);

export const rejectDeal = spacetimedb.reducer(
  { dealId: t.u64() },
  (ctx, { dealId }) => {
    const match = requireMatch(ctx);
    if (match.deals_locked) throw new SenderError('deals are locked');
    const me = requireRole(ctx);
    const row = ctx.db.deal.id.find(dealId);
    if (!row || row.status !== DEAL.pending) throw new SenderError('no pending deal');
    if (me.role !== row.candidate_role && me.role !== row.broker_role) {
      throw new SenderError('not your deal');
    }
    ctx.db.deal.id.update({ ...row, status: DEAL.rejected });
  }
);

export const exposeDeal = spacetimedb.reducer(
  { dealId: t.u64() },
  (ctx, { dealId }) => {
    const match = requireMatch(ctx);
    if (match.deals_locked) throw new SenderError('too late to expose');
    const me = requireRole(ctx);
    const row = ctx.db.deal.id.find(dealId);
    if (!row || row.status !== DEAL.accepted) throw new SenderError('only accepted deals can leak');
    if (me.role !== row.candidate_role && me.role !== row.broker_role) {
      throw new SenderError('not your deal');
    }
    ctx.db.deal.id.update({ ...row, exposed: true });
    ctx.db.exposed_deal.insert({
      id: row.id,
      candidate_role: row.candidate_role,
      broker_role: row.broker_role,
      promised_budget: row.promised_budget,
      promised_project: row.promised_project,
      requested_support: row.requested_support,
    });
    setRelationship(ctx, row.candidate_role, row.broker_role, REL.burned);
    withdrawEndorsement(ctx, row.broker_role, true);
    post(
      ctx,
      `A private deal just leaked: ${roleLabel(row.candidate_role)} promised ${roleLabel(row.broker_role)} ₹${row.promised_budget}L${
        row.promised_project ? ` and ${row.promised_project}` : ''
      }.`
    );
  }
);

export const submitChoice = spacetimedb.reducer(
  { optionIndex: t.u8(), budgetCommit: t.u32() },
  (ctx, { optionIndex, budgetCommit }) => {
    const match = requireMatch(ctx);
    if (!match.event_id) throw new SenderError('no live event');
    if (match.event_stage !== 'discussion') throw new SenderError('the decision window is closed');
    const me = requireRole(ctx);
    if (!isCandidate(me.role)) throw new SenderError('only candidates choose');
    const options = EVENT_OPTIONS[match.event_id];
    if (!options || optionIndex > 2) throw new SenderError('pick one of the three options');
    if (!validBudgetStep(budgetCommit, 0, 20)) throw new SenderError('commitment must be ₹0–20L in 5s');
    const existing = [...ctx.db.hidden_choice.by_event_candidate.filter([match.event_id, me.role])][0];
    if (existing) throw new SenderError('your choice is locked');
    if ([...ctx.db.revealed_choice.by_event.filter(match.event_id)].length > 0) {
      throw new SenderError('choices already revealed');
    }
    ctx.db.hidden_choice.insert({
      id: 0n,
      event_id: match.event_id,
      candidate_role: me.role,
      option_index: optionIndex,
      budget_commit: budgetCommit,
    });
    const locked = [...ctx.db.hidden_choice.iter()].filter(
      row => row.event_id === match.event_id
    ).length;
    ctx.db.match_state.id.update({ ...match, choices_locked: locked });
  }
);

export const reactToCandidate = spacetimedb.reducer(
  { candidateRole: t.string(), stance: t.string() },
  (ctx, { candidateRole, stance }) => {
    const match = requireMatch(ctx);
    if (!match.event_id) throw new SenderError('no live event');
    if (match.event_stage !== 'reaction') throw new SenderError('reactions are not open');
    if ([...ctx.db.revealed_choice.by_event.filter(match.event_id)].length === 0) {
      throw new SenderError('wait for the reveal');
    }
    const me = requireRole(ctx);
    if (!isBroker(me.role)) throw new SenderError('only kingmakers react');
    if (!isCandidate(candidateRole)) throw new SenderError('react to a candidate');
    if (stance !== 'approve' && stance !== 'disapprove' && stance !== 'none') {
      throw new SenderError('approve, disapprove, or pass');
    }
    const existing = [...ctx.db.reaction.by_event_pair.filter([match.event_id, me.role, candidateRole])][0];
    if (existing) ctx.db.reaction.id.update({ ...existing, stance });
    else {
      ctx.db.reaction.insert({
        id: 0n,
        event_id: match.event_id,
        broker_role: me.role,
        candidate_role: candidateRole,
        stance,
      });
    }
    const reactionsLocked = [...ctx.db.reaction.iter()].filter(
      row => row.event_id === match.event_id
    ).length;
    ctx.db.match_state.id.update({
      ...requireMatch(ctx),
      reactions_locked: reactionsLocked,
    });
    if (stance === 'none') return;
    const rel = findRelationship(ctx, candidateRole, me.role);
    if (!rel) return;
    const next = nextRelationship(rel.state, stance === 'approve');
    if (next !== rel.state) setRelationship(ctx, candidateRole, me.role, next);
    if (rel.state === REL.allied && next === REL.open) {
      const endorsementRow = ctx.db.endorsement.broker_role.find(me.role);
      if (endorsementRow?.candidate_role === candidateRole) {
        withdrawEndorsement(ctx, me.role);
      }
    }
    post(
      ctx,
      `${roleLabel(me.role)} ${stance === 'approve' ? 'backed' : 'hit'} ${roleLabel(candidateRole)} in public.`
    );
  }
);

export const endorseCandidate = spacetimedb.reducer(
  { candidateRole: t.string() },
  (ctx, { candidateRole }) => {
    const match = requireMatch(ctx);
    if (match.phase === PHASE.election || match.phase === PHASE.reveal || match.phase === PHASE.allocation || match.phase === PHASE.results) {
      throw new SenderError('endorsements are closed');
    }
    const me = requireRole(ctx);
    if (!isBroker(me.role)) throw new SenderError('only kingmakers endorse');
    if (!isCandidate(candidateRole)) throw new SenderError('endorse a candidate');
    const rel = findRelationship(ctx, candidateRole, me.role);
    if (!rel || rel.state !== REL.allied) throw new SenderError('you must be Allied first');
    const row = ctx.db.endorsement.broker_role.find(me.role);
    if (!row) throw new SenderError('missing endorsement row');
    ctx.db.endorsement.broker_role.update({ ...row, candidate_role: candidateRole });
    post(ctx, `${roleLabel(me.role)} publicly endorsed ${roleLabel(candidateRole)}.`);
  }
);

export const withdrawMyEndorsement = spacetimedb.reducer(ctx => {
  const match = requireMatch(ctx);
  if (match.phase === PHASE.reveal || match.phase === PHASE.allocation || match.phase === PHASE.results) {
    throw new SenderError('too late');
  }
  const me = requireRole(ctx);
  if (!isBroker(me.role)) throw new SenderError('only kingmakers withdraw');
  if (ctx.db.ballot.broker_role.find(me.role)) throw new SenderError('ballot already in');
  withdrawEndorsement(ctx, me.role);
});

export const castBallot = spacetimedb.reducer(
  { candidateRole: t.string() },
  (ctx, { candidateRole }) => {
    const match = requireMatch(ctx);
    if (match.phase !== PHASE.election) throw new SenderError('ballots are not open');
    const me = requireRole(ctx);
    if (!isBroker(me.role)) throw new SenderError('only kingmakers vote');
    if (!isCandidate(candidateRole)) throw new SenderError('vote for a candidate');
    if (ctx.db.ballot.broker_role.find(me.role)) throw new SenderError('ballot already locked');
    ctx.db.ballot.insert({ broker_role: me.role, candidate_role: candidateRole });
    tryCloseElection(ctx);
  }
);

export const submitAllocation = spacetimedb.reducer(
  {
    sportsBudget: t.u32(),
    cultureBudget: t.u32(),
    hostelBudget: t.u32(),
    placementBudget: t.u32(),
    welfareBudget: t.u32(),
    flagship: t.string(),
  },
  (ctx, args) => {
    const match = requireMatch(ctx);
    if (match.phase !== PHASE.allocation) throw new SenderError('not allocation yet');
    const me = requireRole(ctx);
    if (me.role !== match.winner_role) throw new SenderError('only the President allocates');
    const budgets = [
      args.sportsBudget,
      args.cultureBudget,
      args.hostelBudget,
      args.placementBudget,
      args.welfareBudget,
    ];
    if (budgets.some(value => !validBudgetStep(value, 0, 100))) {
      throw new SenderError('every line must be ₹0–100L in 5s');
    }
    const total = budgets.reduce((sum, value) => sum + value, 0);
    if (total !== 100) throw new SenderError('the budget must total exactly ₹100L');
    if (
      args.flagship !== PROJECT.carnival &&
      args.flagship !== PROJECT.commons &&
      args.flagship !== PROJECT.careerLab &&
      args.flagship !== PROJECT.renewal
    ) {
      throw new SenderError('pick one flagship project');
    }
    ctx.db.match_state.id.update({
      ...match,
      sports_budget: args.sportsBudget,
      culture_budget: args.cultureBudget,
      hostel_budget: args.hostelBudget,
      placement_budget: args.placementBudget,
      welfare_budget: args.welfareBudget,
      flagship: args.flagship,
    });
    resolveGovernment(ctx);
  }
);
