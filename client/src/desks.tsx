import { useEffect, useState, type ReactNode } from 'react';
import {
  CANDIDATES,
  COMMITTEE_HEADS,
  PRIORITIES,
  PROJECTS,
  ROLE,
  ROLE_META,
  isCandidate,
  projectLabel,
  roleTitle,
} from './data';
import {
  CINEMA,
  DESK,
  FLAGSHIP,
  MIN_ASK,
  WANT,
  compassNeedle,
  dealPrices,
  faceState,
} from './cinema';
import { FLOOR, RED_LINE_FACTS } from './storyteller';
import {
  ROLE_ICON_COMPONENT,
  IconClock,
  IconAlert,
  IconRadio,
  IconStamp,
  IconCheck,
  IconCross,
  IconDeal,
  IconBuilder,
  IconStar,
  IconBallot,
} from './icons';

type Player = { role: string; displayName: string };
type Profile = { role: string; priorityOne: string; priorityTwo: string };
type Deal = {
  id: bigint;
  candidateRole: string;
  brokerRole: string;
  fromRole: string;
  status: string;
  promisedBudget: number;
  promisedProject: string;
  requestedSupport: string;
};
type Rel = { candidateRole: string; brokerRole: string; state: string };
type Endo = { candidateRole: string; brokerRole: string };
type Choice = { id: bigint; candidateRole: string; eventId: string; optionIndex: number; budgetCommit: number };
type Ballot = { brokerRole: string; candidateRole: string; matchedEndorsement?: boolean };

export type DeskCtx = {
  profiles: readonly Profile[];
  deals: readonly Deal[];
  relationships: readonly Rel[];
  endorsements: readonly Endo[];
  revealedChoices: readonly Choice[];
};

export type Actions = {
  run: (label: string, fn: () => Promise<void>) => Promise<void>;
  proposeDeal: (values: {
    brokerRole: string;
    candidateRole: string;
    promisedBudget: number;
    promisedProject: string;
    requestedSupport: string;
  }) => void;
  acceptDeal: (id: bigint) => void;
  rejectDeal: (id: bigint) => void;
  setPriorities: (a: string, b: string) => void;
  endorse: (candidateRole: string) => void;
  withdraw: () => void;
  submitChoice: (optionIndex: number, budgetCommit: number) => void;
  react: (candidateRole: string, stance: string) => void;
  vote: (candidateRole: string) => void;
  allocate: (values: {
    sportsBudget: number;
    cultureBudget: number;
    hostelBudget: number;
    placementBudget: number;
    welfareBudget: number;
    flagship: string;
  }) => void;
};

function RoleIcon({ role, size = 18 }: { role: string; size?: number }) {
  const Comp = ROLE_ICON_COMPONENT[role];
  if (!Comp) return null;
  return <Comp size={size} />;
}

function leanCtx(input: DeskCtx): Parameters<typeof compassNeedle>[1] {
  return input;
}

export function IncomingInterrupt({
  deals,
  onAccept,
  onReject,
}: {
  deals: readonly Deal[];
  onAccept: (id: bigint) => void;
  onReject: (id: bigint) => void;
}) {
  if (!deals.length) return null;
  const deal = deals[0];

  return (
    <div className="interrupt-overlay">
      <div className="interrupt-modal">
        <div className="interrupt-header">
          <IconAlert size={16} />
          <span>INCOMING COALITION PACT</span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          {roleTitle(deal.fromRole)} proposes a formal agreement
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Seeking your {isCandidate(deal.fromRole) ? 'committee ballot' : 'candidate pledge'} in the coming election.
        </p>

        <div className="interrupt-offer-val">
          ₹{deal.promisedBudget}L
        </div>
        {deal.promisedProject && (
          <p style={{ fontSize: '13px', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '20px' }}>
            Guaranteed Project: {projectLabel(deal.promisedProject)}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
          <button className="btn-primary-action" onClick={() => onAccept(deal.id)}>
            <IconCheck size={16} /> ACCEPT PACT
          </button>
          <button className="btn-secondary-action" onClick={() => onReject(deal.id)}>
            <IconCross size={16} /> REJECT
          </button>
        </div>
      </div>
    </div>
  );
}

function CinemaStage({
  eventId,
  children,
}: {
  eventId: string;
  children: ReactNode;
}) {
  const scene = CINEMA[eventId];
  if (!scene) return null;
  return (
    <section className="cinema-container" key={eventId}>
      <div className="cinema-kicker-row">
        <IconAlert size={14} />
        <span>{scene.kicker}</span>
      </div>
      <h1 className="cinema-headline">{scene.headline}</h1>
      <p className="cinema-sting">{scene.sting}</p>
      {children}
    </section>
  );
}

function Compass({ headRole, ctx }: { headRole: string; ctx: DeskCtx }) {
  const needle = compassNeedle(headRole, leanCtx(ctx));
  const markerLeftPercent = Math.max(5, Math.min(95, needle.ratio));

  return (
    <div className="compass-panel">
      <div className="compass-header">
        <span className="compass-caption">POLITICAL FORECAST & CANDIDATE LEAN</span>
        <span className={`compass-status-pill lean-${needle.lean}`}>{needle.label}</span>
      </div>

      <div className="compass-arena">
        <div className={`candidate-node ${needle.lean === 'builder' ? 'favored-left' : ''}`}>
          <div className="candidate-icon-box">
            <IconBuilder size={22} />
          </div>
          <div className="candidate-node-info">
            <strong>The Builder</strong>
            <em>Infrastructure & Tech</em>
          </div>
        </div>

        <div className="gauge-visual">
          <div className="gauge-track">
            <div className="gauge-gradient-fill" />
            <div className="gauge-marker" style={{ left: `${markerLeftPercent}%` }} />
          </div>
          <div className="gauge-readout">
            <span>BUILDER ADVANTAGE</span>
            <span style={{ color: '#fff', fontWeight: 700 }}>{needle.ratio}% FAVORABILITY</span>
            <span>STAR ADVANTAGE</span>
          </div>
        </div>

        <div className={`candidate-node ${needle.lean === 'campus_star' ? 'favored-right' : ''}`}>
          <div className="candidate-icon-box">
            <IconStar size={22} />
          </div>
          <div className="candidate-node-info">
            <strong>The Campus Star</strong>
            <em>Cultural & Student Base</em>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceRow({
  headRole,
  value,
  onChange,
}: {
  headRole: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="prices-selector">
      {dealPrices(headRole).map((n, i) => (
        <button
          key={n}
          type="button"
          className={`price-card-btn ${value === n ? 'active' : ''}`}
          onClick={() => onChange(n)}
        >
          <span className="price-tag-sub">
            {i === 0 ? 'Minimum Floor' : i === 1 ? 'Standard Ask' : 'Maximum Leverage'}
          </span>
          <span className="price-amount">₹{n}L</span>
        </button>
      ))}
    </div>
  );
}

function VictoryMeter({
  role,
  match,
  facts,
  voted,
  endorsed,
  result,
}: {
  role: string;
  match: {
    phase: string;
    winnerRole: string;
    flagship: string;
    sportsBudget: number;
    cultureBudget: number;
    hostelBudget: number;
    placementBudget: number;
    welfareBudget: number;
  };
  facts: readonly { factId: string }[];
  voted: boolean;
  endorsed: boolean;
  result?: { score: number; tier: string; minMet: boolean; secretMet: boolean; redLineHit: boolean };
}) {
  const floor = FLOOR[role] ?? 20;
  const flagship = FLAGSHIP[role] ?? '';
  const allocated =
    role === ROLE.sports
      ? match.sportsBudget
      : role === ROLE.culture
        ? match.cultureBudget
        : role === ROLE.hostel
          ? match.hostelBudget
          : role === ROLE.placement
            ? match.placementBudget
            : match.welfareBudget;
  const settled = match.phase === 'results' || (match.phase === 'allocation' && allocated > 0);
  const floorMet = settled ? allocated >= floor : null;
  const flagMet = match.phase === 'results' ? match.flagship === flagship : null;
  const redFacts = RED_LINE_FACTS[role] ?? [];
  const redHit =
    result?.redLineHit ??
    (role === ROLE.sports && settled
      ? match.sportsBudget < match.cultureBudget
      : redFacts.some(id => facts.some(f => f.factId === id)));
  const backed =
    match.phase === 'results' && result
      ? result.score >= 0 && voted
      : voted
        ? 'sealed'
        : endorsed
          ? 'public'
          : null;

  const row = (
    key: string,
    pts: string,
    label: string,
    state: 'yes' | 'no' | 'wait' | 'warn'
  ) => (
    <li key={key} className={`win-row win-${state}`}>
      <span className="win-pts">{pts}</span>
      <span className="win-label">{label}</span>
      <span className="win-state">
        {state === 'yes' ? 'SECURED' : state === 'no' ? 'LOST' : state === 'warn' ? 'AT RISK' : 'OPEN'}
      </span>
    </li>
  );

  return (
    <section className="win-meter">
      <div className="win-meter-head">
        <span>DEPARTMENT WIN · NEED 3 PTS</span>
        {result && <strong>{result.tier.toUpperCase()} · {result.score} PTS</strong>}
      </div>
      <ul>
        {row(
          'floor',
          '+2',
          `Floor ₹${floor}L`,
          floorMet === true ? 'yes' : floorMet === false ? 'no' : 'wait'
        )}
        {row(
          'flag',
          '+1',
          `Flagship · ${projectLabel(flagship)}`,
          flagMet === true ? 'yes' : flagMet === false ? 'no' : 'wait'
        )}
        {row(
          'vote',
          '+1',
          backed === 'sealed' ? 'Ballot sealed' : backed === 'public' ? 'Publicly backing' : 'Back the winner',
          match.phase === 'results' ? (result && !result.redLineHit && voted ? 'yes' : 'wait') : backed ? 'wait' : 'wait'
        )}
        {row('red', '−1', wantRedLine(role), redHit ? 'warn' : 'wait')}
      </ul>
    </section>
  );
}

function wantRedLine(role: string): string {
  if (role === ROLE.sports) return 'Red line · Sports ≥ Culture';
  if (role === ROLE.culture) return 'Red line · No 11 PM curfew';
  if (role === ROLE.hostel) return 'Red line · No compulsory fee';
  if (role === ROLE.placement) return 'Red line · Clean recruiter week';
  return 'Red line · No predatory fees';
}

export function HeadDesk({
  me,
  match,
  players,
  incoming,
  hiddenChoices,
  myBallots,
  reactions,
  revealedBallots,
  results,
  facts,
  ctx,
  actions,
  flash,
}: {
  me: Player;
  match: {
    phase: string;
    eventId: string;
    winnerRole: string;
    dealsLocked: boolean;
    flagship: string;
    sportsBudget: number;
    cultureBudget: number;
    hostelBudget: number;
    placementBudget: number;
    welfareBudget: number;
    ending: string;
  };
  players: readonly Player[];
  incoming: readonly Deal[];
  hiddenChoices: readonly { eventId: string }[];
  myBallots: readonly unknown[];
  reactions: readonly { brokerRole: string; candidateRole: string; eventId: string; stance: string }[];
  revealedBallots: readonly Ballot[];
  results: readonly {
    brokerRole: string;
    score: number;
    tier: string;
    hadDeal: boolean;
    dealHonoured: boolean;
    minMet: boolean;
    secretMet: boolean;
    redLineHit: boolean;
    endorsementBetrayal: boolean;
  }[];
  facts: readonly { factId: string }[];
  ctx: DeskCtx;
  actions: Actions;
  flash: boolean;
}) {
  const desk = DESK[me.role];
  const want = WANT[me.role];
  const scene = match.eventId ? CINEMA[match.eventId] : undefined;
  const crisisRevealed = ctx.revealedChoices.some(row => row.eventId === match.eventId);
  const myReact = reactions.filter(row => row.brokerRole === me.role && row.eventId === match.eventId);
  const [target, setTarget] = useState<string>(ROLE.builder);
  const [price, setPrice] = useState(MIN_ASK[me.role] ?? 25);
  const myEndo = ctx.endorsements.find(row => row.brokerRole === me.role);
  const voted = myBallots.length > 0;

  const sell = (candidateRole: string) =>
    actions.proposeDeal({
      brokerRole: me.role,
      candidateRole,
      promisedBudget: price,
      promisedProject: FLAGSHIP[me.role] ?? '',
      requestedSupport: 'electoral',
    });

  const showCinema =
    !!scene && ['everyday', 'opportunity', 'values'].includes(match.phase) && !crisisRevealed;

  return (
    <div className={`head-desk-view scene-in ${flash ? 'slam' : ''}`} key={match.phase}>
      <IncomingInterrupt deals={incoming} onAccept={actions.acceptDeal} onReject={actions.rejectDeal} />

      <header className="want-card">
        <div className="want-meta">
          <span className="want-room-badge">
            <RoleIcon role={me.role} size={15} />
            {desk?.room}
          </span>
          <span className="want-role-pill">{desk?.title}</span>
        </div>
        <h2 className="want-title">{want?.mission}</h2>
        <p className="want-sub">{desk?.subtext}</p>
        <div className="want-condition-box">
          <span className="want-condition-label">VITAL CONDITION</span>
          <span className="want-condition-text">{want?.condition}</span>
        </div>
      </header>

      <VictoryMeter
        role={me.role}
        match={match}
        facts={facts}
        voted={voted}
        endorsed={!!myEndo}
        result={results.find(row => row.brokerRole === me.role)}
      />

      <Compass headRole={me.role} ctx={ctx} />

      {showCinema && scene && (
        <CinemaStage eventId={match.eventId}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Candidates are actively registering their private policy directives. Observe their stances.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {CANDIDATES.map(role => {
              const locked = hiddenChoices.some(row => row.eventId === match.eventId);
              const occupant = players.find(p => p.role === role);
              return (
                <div
                  key={role}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <RoleIcon role={role} size={20} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: '#fff' }}>
                      {roleTitle(role)}
                    </strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {occupant?.displayName ?? '—'}
                    </span>
                  </div>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: locked ? 'var(--accent-emerald)' : 'var(--accent-gold)',
                    }}
                  >
                    {locked ? 'SUBMITTED' : 'CONSIDERING…'}
                  </span>
                </div>
              );
            })}
          </div>
        </CinemaStage>
      )}

      {scene && crisisRevealed && match.phase !== 'election' && (
        <section className="verb-panel">
          <div className="verb-title">
            <IconStamp size={18} />
            EVALUATE CANDIDATE CRISIS DIRECTIVES
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Public response to candidate choices. Did their resolution protect your department?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {CANDIDATES.map(role => {
              const choice = ctx.revealedChoices.find(
                row => row.candidateRole === role && row.eventId === match.eventId
              );
              const door = scene.doors.find(item => item.optionIndex === choice?.optionIndex);
              const stamped = myReact.find(row => row.candidateRole === role);
              return (
                <article
                  key={role}
                  style={{
                    padding: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <RoleIcon role={role} size={18} />
                    <strong style={{ fontSize: '15px', color: '#fff' }}>{roleTitle(role)}</strong>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '12px', minHeight: '36px' }}>
                    {door ? door.label : 'No policy registered.'}
                  </p>
                  {stamped ? (
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        background:
                          stamped.stance === 'approve'
                            ? 'rgba(16,185,129,0.15)'
                            : 'rgba(239,68,68,0.15)',
                        color:
                          stamped.stance === 'approve'
                            ? 'var(--accent-emerald)'
                            : 'var(--accent-crimson)',
                      }}
                    >
                      {stamped.stance === 'approve' ? 'PROTECTS OUR INTERESTS' : 'DAMAGES OUR PEOPLE'}
                    </span>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        className="btn-secondary-action"
                        style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#6ee7b7' }}
                        onClick={() => actions.react(role, 'approve')}
                      >
                        APPROVE
                      </button>
                      <button
                        className="btn-secondary-action"
                        style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5' }}
                        onClick={() => actions.react(role, 'disapprove')}
                      >
                        CONDEMN
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {match.phase === 'election' && (
        <section className="verb-panel">
          <div className="verb-title">
            <IconDeal size={18} />
            CONFIDENTIAL PRESIDENTIAL BALLOT
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Cast your secret vote. Once deposited in the ballot vault, it cannot be altered.
          </p>
          {voted ? (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-emerald)',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
              }}
            >
              BALLOT SECURELY SEALED IN THE VAULT
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {CANDIDATES.map(role => (
                <button
                  key={role}
                  className="btn-primary-action"
                  style={{ padding: '16px', fontSize: '15px' }}
                  onClick={() => actions.vote(role)}
                >
                  <RoleIcon role={role} size={20} /> VOTE FOR {roleTitle(role).toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {match.phase === 'reveal' && <CountStage match={match} ballots={revealedBallots} />}

      {match.phase === 'allocation' && (
        <section className="verb-panel">
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Elected President {roleTitle(match.winnerRole)} is dividing the ₹100L treasury. Awaiting gazette publication…
          </p>
        </section>
      )}

      {match.phase === 'results' && <Finale match={match} results={results} players={players} />}

      {['manifesto', 'everyday', 'opportunity', 'values', 'soapbox'].includes(match.phase) &&
        !match.dealsLocked && (
          <section className="verb-panel">
            <div className="verb-title">
              <IconDeal size={18} />
              COALITION NEGOTIATION TABLE
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Select a candidate to pledge your vote in exchange for binding budget guarantees.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {CANDIDATES.map(role => {
                const occupant = players.find(p => p.role === role);
                const mine = myEndo?.candidateRole === role;
                const isSelected = target === role;
                return (
                  <button
                    key={role}
                    type="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      background: isSelected ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? 'var(--accent-gold)' : 'var(--glass-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: isSelected ? '0 0 16px var(--accent-gold-glow)' : 'none',
                    }}
                    onClick={() => setTarget(role)}
                  >
                    <RoleIcon role={role} size={24} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block', fontSize: '14px', color: '#fff' }}>
                        {roleTitle(role)}
                      </strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {occupant?.displayName ?? '—'}
                      </span>
                    </div>
                    {mine && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          fontWeight: 800,
                          color: 'var(--accent-emerald)',
                          padding: '2px 8px',
                          background: 'rgba(16,185,129,0.12)',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        BACKED
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <PriceRow headRole={me.role} value={price} onChange={setPrice} />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginTop: '16px' }}>
              <button className="btn-primary-action" onClick={() => sell(target)}>
                PROPOSE PACT · ₹{price}L ALLOCATION
              </button>
              <button
                className="btn-secondary-action"
                onClick={() =>
                  myEndo?.candidateRole === target ? actions.withdraw() : actions.endorse(target)
                }
              >
                {myEndo?.candidateRole === target ? 'RETRACT ENDORSEMENT' : 'PUBLIC ENDORSEMENT'}
              </button>
            </div>
          </section>
        )}
    </div>
  );
}

export function CandidateDesk({
  me,
  match,
  players,
  incoming,
  hiddenChoices,
  ctx,
  actions,
  flash,
  revealedBallots,
  results,
}: {
  me: Player;
  match: {
    phase: string;
    eventId: string;
    winnerRole: string;
    dealsLocked: boolean;
    flagship: string;
    sportsBudget: number;
    cultureBudget: number;
    hostelBudget: number;
    placementBudget: number;
    welfareBudget: number;
    ending: string;
  };
  players: readonly Player[];
  incoming: readonly Deal[];
  hiddenChoices: readonly { eventId: string }[];
  ctx: DeskCtx;
  actions: Actions;
  flash: boolean;
  revealedBallots: readonly Ballot[];
  results: readonly {
    brokerRole: string;
    score: number;
    tier: string;
    hadDeal: boolean;
    dealHonoured: boolean;
    minMet: boolean;
    secretMet: boolean;
    redLineHit: boolean;
    endorsementBetrayal: boolean;
  }[];
}) {
  const desk = DESK[me.role];
  const myProfile = ctx.profiles.find(row => row.role === me.role);
  const scene = match.eventId ? CINEMA[match.eventId] : undefined;
  const hasChosen = hiddenChoices.some(row => row.eventId === match.eventId);
  const crisisRevealed = ctx.revealedChoices.some(row => row.eventId === match.eventId);
  const [p1, setP1] = useState('placement');
  const [p2, setP2] = useState('hostel');
  const [head, setHead] = useState<string>(ROLE.sports);
  const [price, setPrice] = useState(MIN_ASK[ROLE.sports] ?? 25);

  const securedCount = COMMITTEE_HEADS.filter(role => {
    const state = faceState(role, me.role, leanCtx(ctx));
    const endo = ctx.endorsements.some(row => row.brokerRole === role && row.candidateRole === me.role);
    const hasDeal = ctx.deals.some(deal => deal.brokerRole === role && deal.candidateRole === me.role && deal.status === 'accepted');
    return state === 'allied' || endo || hasDeal;
  }).length;

  const showDoors =
    !!scene &&
    ['everyday', 'opportunity', 'values'].includes(match.phase) &&
    !hasChosen &&
    !crisisRevealed;

  const promise = (brokerRole: string) =>
    actions.proposeDeal({
      brokerRole,
      candidateRole: me.role,
      promisedBudget: price,
      promisedProject: FLAGSHIP[brokerRole] ?? '',
      requestedSupport: 'electoral',
    });

  return (
    <div className={`candidate-desk-view scene-in ${flash ? 'slam' : ''}`} key={match.phase}>
      <IncomingInterrupt deals={incoming} onAccept={actions.acceptDeal} onReject={actions.rejectDeal} />

      <header className="want-card">
        <div className="want-meta">
          <span className="want-room-badge">
            <RoleIcon role={me.role} size={15} />
            {desk?.room}
          </span>
          <span className="want-role-pill">{desk?.title}</span>
        </div>
        <h2 className="want-title">{desk?.directive}</h2>
        <p className="want-sub">{desk?.subtext}</p>
        <div className="want-condition-box">
          <span className="want-condition-label">PRESIDENTIAL CRITERIA</span>
          <span className="want-condition-text">
            Assemble 3 confirmed secret committee ballots. Treasury ₹100L will force tough budget compromises later.
          </span>
        </div>
      </header>

      {/* Coalition Progress Simulation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            COALITION PROGRESS
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 800,
              color: securedCount >= 3 ? 'var(--emerald)' : 'var(--gold)',
              padding: '2px 8px',
              background: securedCount >= 3 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
              borderRadius: 'var(--radius-full)',
            }}
          >
            {securedCount >= 3 ? 'MAJORITY THRESHOLD SECURED (3/3)' : `${securedCount} OF 3 VOTES CONFIRMED`}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[1, 2, 3].map(slot => (
            <div
              key={slot}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: slot <= securedCount ? 'var(--gold)' : 'rgba(255,255,255,0.15)',
                boxShadow: slot <= securedCount ? '0 0 8px var(--gold-glow)' : 'none',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>

      <div className="candidate-vote-grid">
        {COMMITTEE_HEADS.map(role => {
          const occupant = players.find(p => p.role === role);
          const state = faceState(role, me.role, leanCtx(ctx));
          const endo = ctx.endorsements.some(
            row => row.brokerRole === role && row.candidateRole === me.role
          );
          const isSelected = head === role;

          return (
            <button
              key={role}
              type="button"
              className={`committee-face-card ${state} ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                setHead(role);
                setPrice(MIN_ASK[role] ?? 20);
              }}
            >
              <div className="face-icon-badge">
                <RoleIcon role={role} size={18} />
              </div>
              <span className="face-name">{roleTitle(role).split(' ')[0]}</span>
              <span className="face-cost">Ask: ₹{MIN_ASK[role]}L</span>
              <span className="status-tag">{endo ? 'ENDORSED' : state}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {occupant?.displayName ?? '—'}
              </span>
            </button>
          );
        })}
      </div>

      {match.phase === 'manifesto' && !myProfile?.priorityOne && (
        <section className="verb-panel">
          <div className="verb-title">
            <IconStamp size={18} />
            SELECT TWO PILLAR PROMISES FOR YOUR MANIFESTO
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Signal institutional priorities to win department trust early.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '16px' }}>
            {PRIORITIES.map(item => {
              const on = p1 === item.id || p2 === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px',
                    background: on ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${on ? 'var(--accent-gold)' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: on ? '#fff' : 'var(--text-secondary)',
                  }}
                  onClick={() => {
                    if (p1 === item.id) return;
                    if (p2 === item.id) return;
                    setP1(p2);
                    setP2(item.id);
                  }}
                >
                  <RoleIcon role={item.id} size={20} />
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
          <button
            className="btn-primary-action"
            disabled={p1 === p2}
            onClick={() => actions.setPriorities(p1, p2)}
          >
            CONFIRM MANIFESTO PILLARS
          </button>
        </section>
      )}

      {showDoors && scene && (
        <CinemaStage eventId={match.eventId}>
          <div className="door-grid">
            {scene.doors.map(door => (
              <button
                key={door.label}
                type="button"
                className="decision-door-btn primary-gate"
                onClick={() => actions.submitChoice(door.optionIndex, 0)}
              >
                <span className="door-title">{door.label}</span>
                <span className="door-consequence">{door.sub}</span>
              </button>
            ))}
          </div>
        </CinemaStage>
      )}

      {hasChosen && scene && !crisisRevealed && (
        <div className="verb-panel">
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Your policy resolution is locked in the dispatcher. Awaiting emergency radio broadcast…
          </p>
        </div>
      )}

      {['manifesto', 'everyday', 'opportunity', 'values', 'soapbox'].includes(match.phase) &&
        !showDoors &&
        !match.dealsLocked && (
          <section className="verb-panel">
            <div className="verb-title">
              <IconDeal size={18} />
              COALITION OFFER TO {roleTitle(head).toUpperCase()}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Target Objective: {WANT[head]?.mission}
            </p>
            <PriceRow headRole={head} value={price} onChange={setPrice} />
            <button
              className="btn-primary-action"
              style={{ marginTop: '16px' }}
              onClick={() => promise(head)}
            >
              TRANSMIT FORMAL PACT (₹{price}L)
            </button>
          </section>
        )}

      {match.phase === 'election' && (
        <div className="verb-panel">
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Five committee secretaries are currently casting secret ballots in the vault.
          </p>
        </div>
      )}

      {match.phase === 'reveal' && <CountStage match={match} ballots={revealedBallots} />}

      {match.phase === 'allocation' && me.role === match.winnerRole && (
        <MandateForm onSubmit={actions.allocate} />
      )}

      {match.phase === 'allocation' && me.role !== match.winnerRole && (
        <div className="verb-panel">
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            President {roleTitle(match.winnerRole)} is determining official budget allocations…
          </p>
        </div>
      )}

      {match.phase === 'results' && <Finale match={match} results={results} players={players} />}
    </div>
  );
}

export function QuietLobby({
  meRole,
  players,
  onClaim,
  onStart,
}: {
  meRole: string;
  players: readonly Player[];
  onClaim: (role: string) => void;
  onStart: () => void;
}) {
  const c = CANDIDATES.filter(role => players.some(p => p.role === role)).length;
  const h = COMMITTEE_HEADS.filter(role => players.some(p => p.role === role)).length;
  const ready = c === 2 && (h === 3 || h === 5);

  return (
    <section className="lobby-container">
      <div className="lobby-hero">
        <h1 className="lobby-hero-title">TAKE A SEAT</h1>
        <p className="lobby-hero-sub">
          Candidates need 3 votes. Committees win their department.
        </p>
      </div>

      <div className="lobby-tier-heading">PRESIDENTIAL CANDIDATE SEATS (2 REQUIRED)</div>
      <div className="tickets-grid">
        {CANDIDATES.map(role => {
          const occupant = players.find(p => p.role === role);
          const isMine = meRole === role;
          const isTaken = !!occupant;

          return (
            <button
              key={role}
              type="button"
              className={`ticket-card ticket-${role === ROLE.builder ? 'builder' : 'star'} ${isMine ? 'claimed-by-me' : ''}`}
              disabled={isTaken && !isMine}
              onClick={() => !isTaken && onClaim(role)}
            >
              <div className="ticket-top">
                <div className="ticket-icon">
                  <RoleIcon role={role} size={24} />
                </div>
                <span className={`ticket-badge ${isMine ? 'mine' : isTaken ? 'held' : 'open'}`}>
                  {isMine ? 'YOUR SEAT' : isTaken ? 'OCCUPIED' : 'OPEN'}
                </span>
              </div>
              <h2 className="ticket-title">{roleTitle(role)}</h2>
              <p className="ticket-desc">{ROLE_META[role].blurb.split('.')[0]}.</p>
              <span className={`seat-chip ${isMine ? 'mine' : isTaken ? 'held' : 'open'}`}>
                {isMine ? 'YOU' : isTaken ? occupant.displayName : 'TAKE SEAT'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="lobby-tier-heading">COMMITTEE HEAD BLOCS (3 TO 5 REQUIRED)</div>
      <div className="committee-heads-lobby-grid">
        {COMMITTEE_HEADS.map(role => {
          const occupant = players.find(p => p.role === role);
          const isMine = meRole === role;
          const isTaken = !!occupant;

          return (
            <button
              key={role}
              type="button"
              className={`head-lobby-card head-${role} ${isMine ? 'claimed-by-me' : ''}`}
              disabled={isTaken && !isMine}
              onClick={() => !isTaken && onClaim(role)}
            >
              <div className="head-lobby-icon">
                <RoleIcon role={role} size={20} />
              </div>
              <strong className="head-lobby-name">{roleTitle(role).split(' ')[0]}</strong>
              <span className="head-lobby-trait">{WANT[role]?.short}</span>
              <span className="head-lobby-cost">₹{MIN_ASK[role]}L floor</span>
              <span className={`seat-chip ${isMine ? 'mine' : isTaken ? 'held' : 'open'}`}>
                {isMine ? 'YOU' : isTaken ? occupant.displayName : 'TAKE SEAT'}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>
          READINESS STATUS: <strong style={{ color: ready ? 'var(--accent-emerald)' : 'var(--accent-gold)' }}>
            {c}/2 CANDIDATES · {h}/5 COMMITTEE HEADS
          </strong>
        </div>
        <button
          className="btn-primary-action"
          style={{ width: 'auto', padding: '14px 32px' }}
          disabled={!ready}
          onClick={onStart}
        >
          COMMENCE ELECTION
        </button>
      </div>
    </section>
  );
}

function CountStage({
  match,
  ballots,
}: {
  match: { winnerRole: string };
  ballots: readonly Ballot[];
}) {
  return (
    <section className="verb-panel">
      <div className="verb-title">
        <IconBallot size={18} />
        BALLOT VAULT TALLY
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', margin: '16px 0' }}>
        {ballots.map(row => (
          <div
            key={row.brokerRole}
            style={{
              padding: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '6px' }}>
              <RoleIcon role={row.brokerRole} size={18} />
            </div>
            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
              {roleTitle(row.brokerRole).split(' ')[0]}
            </span>
            <strong style={{ display: 'block', fontSize: '13px', color: '#fff', marginTop: '4px' }}>
              {roleTitle(row.candidateRole ?? '')}
            </strong>
          </div>
        ))}
      </div>
      {match.winnerRole && (
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid var(--accent-gold)',
            borderRadius: 'var(--radius-md)',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
          }}
        >
          VICTOR ELECTED: {roleTitle(match.winnerRole).toUpperCase()}
        </div>
      )}
    </section>
  );
}

function MandateForm({
  onSubmit,
}: {
  onSubmit: (values: {
    sportsBudget: number;
    cultureBudget: number;
    hostelBudget: number;
    placementBudget: number;
    welfareBudget: number;
    flagship: string;
  }) => void;
}) {
  const [sports, setSports] = useState(20);
  const [culture, setCulture] = useState(20);
  const [hostel, setHostel] = useState(20);
  const [placement, setPlacement] = useState(20);
  const [welfare, setWelfare] = useState(20);
  const [flagship, setFlagship] = useState('carnival');
  const total = sports + culture + hostel + placement + welfare;

  const line = (role: string, value: number, set: (n: number) => void) => (
    <div key={role} style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RoleIcon role={role} size={16} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{roleTitle(role)}</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800, color: 'var(--gold)' }}>
          ₹{value}L
        </span>
      </div>
      <PriceRow headRole={role} value={value} onChange={set} />
    </div>
  );

  return (
    <section className="verb-panel">
      <div className="verb-title">
        <IconDeal size={18} />
        OFFICIAL TREASURY ALLOCATION (₹100L EXACT)
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
        Divide the ₹100L treasury across all 5 departments. Current Allocation:{' '}
        <strong style={{ color: total === 100 ? 'var(--emerald)' : 'var(--crimson)' }}>
          ₹{total}L / ₹100L
        </strong>
      </p>

      {/* Visual Treasury Breakdown Bar */}
      <div style={{ marginBottom: '22px' }}>
        <div
          style={{
            height: '16px',
            width: '100%',
            background: 'rgba(0,0,0,0.5)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            display: 'flex',
            border: `1px solid ${total === 100 ? 'var(--emerald)' : total > 100 ? 'var(--crimson)' : 'var(--glass-border)'}`,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ width: `${sports}%`, background: '#f59e0b', transition: 'width 0.3s ease' }} title={`Sports: ₹${sports}L`} />
          <div style={{ width: `${culture}%`, background: '#a855f7', transition: 'width 0.3s ease' }} title={`Culture: ₹${culture}L`} />
          <div style={{ width: `${hostel}%`, background: '#3b82f6', transition: 'width 0.3s ease' }} title={`Hostel: ₹${hostel}L`} />
          <div style={{ width: `${placement}%`, background: '#10b981', transition: 'width 0.3s ease' }} title={`Placement: ₹${placement}L`} />
          <div style={{ width: `${welfare}%`, background: '#ef4444', transition: 'width 0.3s ease' }} title={`Welfare: ₹${welfare}L`} />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            marginTop: '6px',
            color: 'var(--text-muted)',
          }}
        >
          <span style={{ color: '#f59e0b' }}>SPORTS: ₹{sports}L</span>
          <span style={{ color: '#a855f7' }}>CULTURE: ₹{culture}L</span>
          <span style={{ color: '#3b82f6' }}>HOSTEL: ₹{hostel}L</span>
          <span style={{ color: '#10b981' }}>CAREER: ₹{placement}L</span>
          <span style={{ color: '#ef4444' }}>WELFARE: ₹{welfare}L</span>
        </div>
      </div>

      {line(ROLE.sports, sports, setSports)}
      {line(ROLE.culture, culture, setCulture)}
      {line(ROLE.hostel, hostel, setHostel)}
      {line(ROLE.placement, placement, setPlacement)}
      {line(ROLE.welfare, welfare, setWelfare)}

      <div style={{ marginTop: '20px', marginBottom: '16px' }}>
        <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          SELECT COMMISSIONED FLAGSHIP PROJECT
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {PROJECTS.map(project => (
            <button
              key={project.id}
              type="button"
              className={`price-card-btn ${flagship === project.id ? 'active' : ''}`}
              onClick={() => setFlagship(project.id)}
            >
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{project.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="btn-primary-action"
        disabled={total !== 100}
        onClick={() =>
          onSubmit({
            sportsBudget: sports,
            cultureBudget: culture,
            hostelBudget: hostel,
            placementBudget: placement,
            welfareBudget: welfare,
            flagship,
          })
        }
      >
        PUBLISH OFFICIAL MANDATE (₹{total}L)
      </button>
    </section>
  );
}

function Finale({
  match,
  results,
  players,
}: {
  match: {
    winnerRole: string;
    flagship: string;
    sportsBudget: number;
    cultureBudget: number;
    hostelBudget: number;
    placementBudget: number;
    welfareBudget: number;
  };
  results: readonly {
    brokerRole: string;
    tier: string;
    dealHonoured: boolean;
    hadDeal: boolean;
    minMet: boolean;
    secretMet: boolean;
    redLineHit: boolean;
  }[];
  players: readonly Player[];
}) {
  return (
    <section className="verb-panel">
      <div className="verb-title">
        <IconStar size={18} />
        ELECTION OUTCOME & DEPARTMENT SETTLEMENTS
      </div>
      <div
        style={{
          padding: '20px',
          background: 'rgba(245,158,11,0.1)',
          border: '1px solid var(--accent-gold)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-gold)' }}>
          PRESIDENT ELECTED
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: '6px 0' }}>
          {roleTitle(match.winnerRole)}
        </h2>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Flagship Commissioned: <strong>{projectLabel(match.flagship)}</strong>
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {results.map(row => (
          <article
            key={row.brokerRole}
            style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              <RoleIcon role={row.brokerRole} size={22} />
            </div>
            <strong style={{ display: 'block', fontSize: '13px', color: '#fff' }}>
              {roleTitle(row.brokerRole).split(' ')[0]}
            </strong>
            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 8px' }}>
              {players.find(p => p.role === row.brokerRole)?.displayName ?? '—'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 800,
                color: row.secretMet && !row.redLineHit ? 'var(--accent-emerald)' : 'var(--accent-crimson)',
              }}
            >
              {row.tier}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SlimBriefing({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="verb-panel" style={{ maxWidth: '640px', margin: '60px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-gold)', letterSpacing: '0.12em' }}>
          ASTERIA INSTITUTE OF TECHNOLOGY
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 800, color: '#fff', margin: '8px 0' }}>
          POSTER WAR
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          The Presidential election is here. 2 Candidates. 5 Committee Heads. ₹100L Treasury.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '14px', color: '#cbd5e1' }}>
        <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
          <strong style={{ color: '#fff' }}>If you are a Committee Head:</strong> You protect one departmental mandate. Sell your vote to whichever candidate will honor it.
        </div>
        <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
          <strong style={{ color: '#fff' }}>If you are a Candidate:</strong> You need 3 out of 5 votes to win. ₹100L cannot satisfy everyone—compromise and strategic betrayal are inevitable.
        </div>
      </div>

      <button className="btn-primary-action" onClick={onEnter}>
        ENTER THE ELECTION
      </button>
    </section>
  );
}

export function SlimHud({
  phase,
  clock,
  urgent,
  onSkip,
  onReset,
}: {
  phase: string;
  clock: string;
  urgent: boolean;
  onSkip: () => void;
  onReset: () => void;
}) {
  const label: Record<string, string> = {
    lobby: 'ELECTION CHAMBER',
    manifesto: 'MANIFESTO PACTS',
    everyday: 'DORMITORY CRISIS',
    opportunity: 'CAMPUS PRESTIGE',
    values: 'VALUES & GOVERNANCE',
    soapbox: 'FINAL RALLY',
    election: 'SECRET BALLOT',
    reveal: 'BALLOT COUNT',
    allocation: 'BUDGET MANDATE',
    results: 'COUNCIL AFTERMATH',
  };

  return (
    <header className="slim-hud">
      <div className="hud-left">
        <span className="hud-brand">POSTER WAR</span>
        <div className="hud-badge">
          <span className="hud-pulse" />
          <span>{label[phase] ?? phase.toUpperCase()}</span>
        </div>
      </div>

      <div className="hud-right">
        {phase !== 'lobby' && (
          <div className={`hud-timer-badge ${urgent ? 'urgent' : ''}`}>
            <IconClock size={16} />
            <span>{clock}</span>
          </div>
        )}
        <button type="button" className="hud-action-btn" onClick={onSkip}>
          ADVANCE
        </button>
        <button type="button" className="hud-action-btn" onClick={onReset}>
          RESET
        </button>
      </div>
    </header>
  );
}

export function useCinemaEnter(eventId: string) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!eventId) {
      setOn(false);
      return;
    }
    setOn(true);
  }, [eventId]);
  return on;
}
