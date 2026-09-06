import { useState, type CSSProperties, type ReactNode } from 'react';
import type { CampusAudio } from './AudioManager';
import { CandidatePortrait, EventIllustration } from './GameAssets';
import {
  CANDIDATES,
  COMMITTEE_HEADS,
  EVENTS,
  FACT_LABELS,
  GAME_TITLE,
  INSTITUTE,
  OPENING_NOTICES,
  PHASES,
  PRIORITIES,
  PROJECTS,
  ROLES,
  RULE_NOTICES,
  isCandidate,
  isCommitteeHead,
  priorityLabel,
  projectLabel,
  manifestoLines,
  roleTitle,
  seatLabel,
  choiceCredibility,
} from './world';

export type MatchView = {
  phase: string;
  eventId: string;
  eventStage: string;
  deadlineMicros: bigint;
  choicesLocked: number;
  reactionsLocked: number;
  dealsLocked: boolean;
  winnerRole: string;
  flagship: string;
  sportsBudget: number;
  cultureBudget: number;
  hostelBudget: number;
  placementBudget: number;
  welfareBudget: number;
  ballotsRevealed: number;
  winAt: number;
  ending: string;
};

export type PlayerView = {
  displayName: string;
  role: string;
  ready: boolean;
};

export type ProfileView = { role: string; priorityOne: string; priorityTwo: string };
export type EndorsementView = { brokerRole: string; candidateRole: string };
export type RelationshipView = { candidateRole: string; brokerRole: string; state: string };
export type DealView = {
  id: bigint;
  candidateRole: string;
  brokerRole: string;
  promisedBudget: number;
  promisedProject: string;
  requestedSupport: string;
  status: string;
  fromRole: string;
  exposed: boolean;
};
export type ChoiceView = {
  eventId: string;
  candidateRole: string;
  optionIndex: number;
  budgetCommit: number;
};
export type ReactionView = {
  eventId: string;
  brokerRole: string;
  candidateRole: string;
  stance: string;
};
export type FactView = { id: bigint; factId: string; sourceRole: string };
export type FeedView = { id: bigint; body: string };
export type BallotView = {
  brokerRole: string;
  candidateRole: string;
  matchedEndorsement: boolean;
};
export type ResultView = {
  brokerRole: string;
  score: number;
  tier: string;
  dealHonoured: boolean;
  hadDeal: boolean;
  votedWinner: boolean;
  minMet: boolean;
  secretMet: boolean;
  redLineHit: boolean;
  endorsementBetrayal: boolean;
};
export type ExposedDealView = {
  id: bigint;
  candidateRole: string;
  brokerRole: string;
  promisedBudget: number;
  promisedProject: string;
  requestedSupport: string;
};

function nameFor(players: readonly PlayerView[] | undefined, role: string) {
  return seatLabel(role, players?.find(player => player.role === role)?.displayName);
}

export type CampusActions = {
  claimRole: (role: string) => void;
  setReady: (ready: boolean) => void;
  start: () => void;
  reset: () => void;
  advance: () => void;
  setPriorities: (one: string, two: string) => void;
  submitChoice: (optionIndex: number, budget: number) => void;
  react: (candidateRole: string, stance: string) => void;
  endorse: (candidateRole: string) => void;
  withdraw: () => void;
  vote: (candidateRole: string) => void;
  propose: (values: {
    brokerRole: string;
    candidateRole: string;
    promisedBudget: number;
    promisedProject: string;
    requestedSupport: string;
  }) => void;
  counter: (values: {
    dealId: bigint;
    promisedBudget: number;
    promisedProject: string;
    requestedSupport: string;
  }) => void;
  accept: (id: bigint) => void;
  reject: (id: bigint) => void;
  expose: (id: bigint) => void;
  allocate: (values: {
    sportsBudget: number;
    cultureBudget: number;
    hostelBudget: number;
    placementBudget: number;
    welfareBudget: number;
    flagship: string;
  }) => void;
};

export function EnterGate({ onEnter }: { onEnter: () => void }) {
  return (
    <main className="cw-enter">
      <div className="cw-enter-card">
        <span className="cw-stamp">{INSTITUTE} · Election Month</span>
        <h1 className="cw-display">{GAME_TITLE}</h1>
        <p className="cw-enter-copy">
          The common room is still awake. Seven names are about to decide what campus becomes next.
          Enter with sound for the full notice-board and campus-radio experience.
        </p>
        <button className="cw-btn" onClick={onEnter}>Enter the common room</button>
        <p className="cw-label" style={{ marginTop: '1.2rem' }}>Sound can be changed or muted at any time</p>
      </div>
    </main>
  );
}

export function StoryOnboarding({
  onDone,
  onActivate,
  cue,
}: {
  onDone: () => void;
  onActivate: () => void;
  cue: CampusAudio['cue'];
}) {
  const [step, setStep] = useState(0);
  const total = OPENING_NOTICES.length + 2;

  function move(next: number) {
    onActivate();
    cue(next >= total ? 'stamp' : 'paper');
    if (next >= total) onDone();
    else setStep(next);
  }

  let content: ReactNode;
  if (step < OPENING_NOTICES.length) {
    const notice = OPENING_NOTICES[step];
    content = (
      <>
        <span className="cw-stamp">{notice.stamp}</span>
        <h2 className="cw-title">{notice.title}</h2>
        <p className="cw-copy">{notice.body}</p>
      </>
    );
  } else if (step === OPENING_NOTICES.length) {
    content = (
      <>
        <span className="cw-stamp">How election night works</span>
        <h2 className="cw-title" style={{ margin: '1.2rem 0' }}>Five things to remember</h2>
        <div className="cw-archive" style={{ textAlign: 'left' }}>
          {RULE_NOTICES.map(rule => (
            <div className="cw-archive-item" key={rule.number}>
              <strong>{rule.number} · {rule.title}</strong>
              <span>{rule.body}</span>
            </div>
          ))}
        </div>
      </>
    );
  } else {
    content = (
      <>
        <span className="cw-stamp">Choose your side</span>
        <h2 className="cw-title" style={{ margin: '1.2rem 0' }}>Two ways to hold power</h2>
        <div className="cw-reveal-grid" style={{ textAlign: 'left' }}>
          <div>
            <p className="cw-hand">Stand for President</p>
            <p className="cw-copy">Win three secret votes. Promise selectively. Decide which allies still matter after victory.</p>
          </div>
          <div>
            <p className="cw-hand">Lead a Committee</p>
            <p className="cw-copy">Sell one decisive vote. Protect your budget, private project, and red line—even if your candidate loses.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <main className="cw-board">
      <section className="cw-notice-sequence cw-grid">
        <article className="cw-paper cw-pin cw-story-note" key={step}>
          {content}
          <div className="cw-story-controls">
            {step > 0 && <button className="cw-btn cw-btn-secondary" onClick={() => move(step - 1)}>Back</button>}
            <button className="cw-btn" onClick={() => move(step + 1)}>
              {step === total - 1 ? 'Go to registration' : 'Next notice'}
            </button>
          </div>
          <p className="cw-label" style={{ color: '#716b5f', marginTop: '1rem' }}>{step + 1} / {total}</p>
        </article>
      </section>
    </main>
  );
}

export function Registration({
  name,
  onName,
  onJoin,
}: {
  name: string;
  onName: (value: string) => void;
  onJoin: () => void;
}) {
  return (
    <main className="cw-board">
      <section className="cw-notice-sequence cw-grid">
        <article className="cw-paper cw-pin cw-story-note">
          <span className="cw-stamp">Election register</span>
          <h2 className="cw-title" style={{ margin: '1.2rem 0' }}>Sign the college roll</h2>
          <p className="cw-copy">Use the name the other six players will recognise across the board.</p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <label className="cw-sr-only" htmlFor="display-name">Your name</label>
            <input
              id="display-name"
              className="cw-input"
              value={name}
              maxLength={24}
              onChange={event => onName(event.target.value)}
              onKeyDown={event => event.key === 'Enter' && name.trim() && onJoin()}
              placeholder="e.g. Kabir or Priya"
              autoFocus
            />
            <button className="cw-btn" disabled={!name.trim()} onClick={onJoin}>Sign in</button>
          </div>
        </article>
      </section>
    </main>
  );
}

export function LobbyBoard({
  me,
  players,
  actions,
}: {
  me: PlayerView;
  players: readonly PlayerView[];
  actions: CampusActions;
}) {
  const allSeated = [...CANDIDATES, ...COMMITTEE_HEADS].every(role => players.some(player => player.role === role));
  const everyoneReady = allSeated && players.filter(player => player.role).every(player => player.ready);
  const mySeat = me.role ? ROLES[me.role] : undefined;

  return (
    <main className="cw-board cw-lobby" data-phase="lobby">
      <div className="cw-board-scribbles" aria-hidden="true">
        <span>FEST AUDITIONS<br />ROOM 204</span>
        <span>BLOCK C WI-FI<br />COMPLAINT #47</span>
        <span>MESS MENU<br />UPDATED?</span>
      </div>
      <div className="cw-grid">
        <header className="cw-lobby-heading">
          <span className="cw-label">Asteria Institute · Nominations desk</span>
          <h1 className="cw-display">Choose where you stand.</h1>
          <p>
            Click a card to take that seat. Two candidates need three votes. Five committee heads need their departments to survive.
          </p>
        </header>
        <section className="cw-role-grid">
          {[...CANDIDATES, ...COMMITTEE_HEADS].map((role, index) => {
            const meta = ROLES[role];
            const owner = players.find(player => player.role === role);
            const mine = me.role === role;
            return (
              <button
                className="cw-paper cw-pin cw-role-card"
                data-kind={meta.kind}
                data-role={role}
                data-mine={mine || undefined}
                data-ready={owner?.ready || undefined}
                disabled={!!owner && !mine}
                key={role}
                onClick={() => {
                  if (mine && me.ready) return;
                  actions.claimRole(role);
                }}
                style={{
                  '--tilt': `${(index % 2 ? 1 : -1) * (0.35 + (index % 3) * 0.2)}deg`,
                  '--i': index,
                } as CSSProperties}
              >
                {mine && <span className="cw-yours">Your seat</span>}
                <span className="cw-card-kind">{meta.kind === 'candidate' ? 'Presidential ticket' : 'Committee ballot'}</span>
                {meta.kind === 'candidate' && (
                  <span className="cw-candidate-art">
                    <CandidatePortrait role={role} />
                    <span className="cw-candidate-number">0{index + 1}</span>
                  </span>
                )}
                {meta.kind !== 'candidate' && <span className="cw-role-mark">{meta.mark}</span>}
                <span className="cw-role-copy">
                  <strong>{meta.title}</strong>
                  <p className="cw-copy">{meta.publicBrief}</p>
                </span>
                <span className="cw-role-owner">
                  {mine ? 'Sealed to you' : owner ? `${owner.displayName} · ${owner.ready ? 'sealed' : 'unsealed'}` : 'Click to claim'}
                </span>
                {owner?.ready && <span className="cw-wax-seal" aria-label="Role sealed">Sealed</span>}
              </button>
            );
          })}
        </section>
        <section className="cw-paper cw-lobby-desk">
          <div>
            <strong>{mySeat ? mySeat.title : 'No role selected'}</strong>
            <p className="cw-copy" style={{ margin: '0.25rem 0 0' }}>
              {me.ready ? 'Your seat is sealed. Click another open card to move, or break the seal if you need to wait.' : 'Click any open card. That claim also seals your role.'}
            </p>
          </div>
          <div className="cw-actions" style={{ margin: 0 }}>
            {me.role && me.ready && (
              <button className="cw-btn cw-btn-secondary" onClick={() => actions.setReady(false)}>
                Break my seal
              </button>
            )}
            {me.role && !me.ready && (
              <button className="cw-btn" onClick={() => actions.setReady(true)}>
                Seal my role
              </button>
            )}
            <button className="cw-btn" disabled={!everyoneReady} onClick={actions.start}>
              {everyoneReady ? 'Open election night' : `${players.filter(player => player.ready).length}/7 sealed`}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export function RoleDossier({
  role,
  onClose,
  cue,
}: {
  role: string;
  onClose: () => void;
  cue: CampusAudio['cue'];
}) {
  const meta = ROLES[role];
  if (!meta) return null;
  return (
    <div className="cw-modal" role="dialog" aria-modal="true" aria-label="Private role dossier">
      <article className="cw-paper cw-pin cw-modal-paper">
        <span className="cw-stamp">Private · destroy after reading</span>
        <p className="cw-hand" style={{ marginBottom: '0.4rem' }}>For {meta.title} only</p>
        <h2 className="cw-title">{meta.privateGoal}</h2>
        <div className="cw-archive" style={{ marginTop: '1.4rem' }}>
          {meta.minimum !== undefined && (
            <div className="cw-archive-item"><strong>Public demand</strong>At least ₹{meta.minimum}L for your committee.</div>
          )}
          <div className="cw-archive-item"><strong>Your red line</strong>{meta.redLine}</div>
          <div className="cw-archive-item"><strong>How you win</strong>{meta.winCondition}</div>
          <div className="cw-archive-item"><strong>Remember</strong>What you say aloud is politics. Only actions recorded on the board become part of the simulation.</div>
        </div>
        <button className="cw-btn" style={{ marginTop: '1.5rem' }} onClick={() => { cue('stamp'); onClose(); }}>
          I understand my mandate
        </button>
      </article>
    </div>
  );
}

export function BoardTopbar({
  match,
  clock,
  audio,
  projector,
  onSettings,
}: {
  match: MatchView;
  clock: string;
  audio: CampusAudio;
  projector: boolean;
  onSettings: () => void;
}) {
  const phase = PHASES[match.phase] ?? PHASES.lobby;
  const urgent = clock.startsWith('0:') && Number(clock.slice(2)) <= 10;
  return (
    <header className="cw-topbar" data-phase={match.phase}>
      <div className="cw-brand"><span className="cw-brand-mark">CW</span><span>{GAME_TITLE}</span></div>
      <div className="cw-phase"><small>{phase.eyebrow}{match.eventStage ? ` · ${match.eventStage}` : ''}</small><strong>{phase.title}</strong></div>
      <div className="cw-audio">
        {projector && <span className="cw-label">Public board</span>}
        <button className="cw-icon-btn" aria-label={audio.muted ? 'Unmute' : 'Mute'} onClick={audio.toggleMute}>
          {audio.muted ? '×' : '♪'}
        </button>
        <button className="cw-icon-btn" aria-label="Audio settings" onClick={onSettings}>••</button>
        <time className="cw-clock" data-urgent={urgent}>{clock}</time>
      </div>
    </header>
  );
}

export function AudioSettings({ audio, onClose }: { audio: CampusAudio; onClose: () => void }) {
  return (
    <div className="cw-modal" role="dialog" aria-modal="true" aria-label="Audio settings">
      <article className="cw-paper cw-modal-paper">
        <span className="cw-stamp">Common room sound desk</span>
        <h2 className="cw-title" style={{ margin: '1rem 0' }}>Sound & access</h2>
        <label className="cw-copy">Campus ambience
          <input type="range" min="0" max="0.45" step="0.01" value={audio.ambience} onChange={event => audio.setAmbience(Number(event.target.value))} style={{ width: '100%' }} />
        </label>
        <label className="cw-copy">Event effects
          <input type="range" min="0" max="0.6" step="0.01" value={audio.effects} onChange={event => audio.setEffects(Number(event.target.value))} style={{ width: '100%' }} />
        </label>
        <div className="cw-actions">
          <button className="cw-btn cw-btn-secondary" onClick={audio.toggleMute}>{audio.muted ? 'Unmute all' : 'Mute all'}</button>
          <button className="cw-btn" onClick={onClose}>Close</button>
        </div>
      </article>
    </div>
  );
}

export function VictoryCelebration({
  winnerName,
  ending,
  personal,
  onClose,
}: {
  winnerName: string;
  ending: string;
  personal: boolean;
  onClose: () => void;
}) {
  const pieces = Array.from({ length: 72 }, (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    delay: `${(index % 12) * 0.09}s`,
    duration: `${2.6 + (index % 7) * 0.23}s`,
    rotation: `${(index * 71) % 360}deg`,
    color: ['#e2b34f', '#8f2940', '#f4ead0', '#34705a', '#31577a'][index % 5],
  }));
  return (
    <div className="cw-victory" role="dialog" aria-modal="true" aria-labelledby="victory-title">
      <div className="cw-confetti" aria-hidden="true">
        {pieces.map(piece => (
          <i
            key={piece.id}
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              background: piece.color,
              rotate: piece.rotation,
            }}
          />
        ))}
      </div>
      <div className="cw-victory-rays" aria-hidden="true" />
      <article className="cw-paper cw-victory-card">
        <div className="cw-victory-seal">A</div>
        <span className="cw-stamp">Asteria Institute · Final Gazette</span>
        <p className="cw-victory-kicker">{personal ? 'You won the presidency' : 'President elected'}</p>
        <h1 className="cw-display" id="victory-title">{winnerName}</h1>
        <p className="cw-victory-office">Student Council President</p>
        <div className="cw-victory-rule"><span /><b>₹100L mandate allocated</b><span /></div>
        <p className="cw-hand">{ending || 'A new campus government begins.'}</p>
        <button className="cw-btn" onClick={onClose}>See what every promise cost</button>
      </article>
    </div>
  );
}

function DecisionCard({
  choice,
  reactions,
  players,
}: {
  choice: ChoiceView;
  reactions: readonly ReactionView[];
  players?: readonly PlayerView[];
}) {
  const event = EVENTS[choice.eventId];
  return (
    <article className="cw-paper cw-decision" data-candidate={choice.candidateRole}>
      <span className="cw-stamp">{nameFor(players, choice.candidateRole)}</span>
      <h3 style={{ margin: '1rem 0 0.4rem' }}>{event?.options[choice.optionIndex] ?? `Option ${choice.optionIndex + 1}`}</h3>
      {choice.budgetCommit > 0 && <p className="cw-hand">Public commitment: ₹{choice.budgetCommit}L</p>}
      <div className="cw-reaction-stamps">
        {reactions.filter(row => row.candidateRole === choice.candidateRole && row.stance !== 'none').map(row => (
          <span className="cw-reaction" data-stance={row.stance} key={`${row.brokerRole}-${row.candidateRole}`}>
            {roleTitle(row.brokerRole)} · {row.stance === 'approve' ? 'approved' : 'opposed'}
          </span>
        ))}
      </div>
    </article>
  );
}

function CandidateChoiceTray({
  eventId,
  locked,
  onSubmit,
}: {
  eventId: string;
  locked: boolean;
  onSubmit: (index: number, budget: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [budget, setBudget] = useState(0);
  const event = EVENTS[eventId];
  if (!event) return null;
  if (locked) {
    return <div className="cw-action-tray cw-paper"><strong>Response sealed.</strong> The other candidate cannot see it. The board opens both at the deadline.</div>;
  }
  return (
    <section className="cw-action-tray cw-paper">
      <span className="cw-label" style={{ color: '#716b5f' }}>Your private action · choose one</span>
      <div className="cw-options">
        {event.options.map((option, index) => (
          <button className="cw-option" aria-pressed={selected === index} key={option} onClick={() => setSelected(index)}>
            <span className="cw-option-number">0{index + 1}</span><span>{option}</span>
          </button>
        ))}
      </div>
      <div className="cw-commit-row">
        <label className="cw-commit-field">
          <span>Public budget promise</span>
          <select className="cw-select" value={budget} onChange={event => setBudget(Number(event.target.value))}>
            {[0, 5, 10, 15, 20].map(value => <option value={value} key={value}>{value ? `₹${value}L` : 'No commitment'}</option>)}
          </select>
        </label>
        <button className="cw-btn" disabled={selected === null} onClick={() => selected !== null && onSubmit(selected, budget)}>Seal response</button>
      </div>
    </section>
  );
}

export function EventStage({
  match,
  me,
  players,
  choices,
  hiddenChoices,
  reactions,
  actions,
  projector,
}: {
  match: MatchView;
  me?: PlayerView;
  players?: readonly PlayerView[];
  choices: readonly ChoiceView[];
  hiddenChoices: readonly { eventId: string; candidateRole: string }[];
  reactions: readonly ReactionView[];
  actions: CampusActions;
  projector: boolean;
}) {
  const event = EVENTS[match.eventId];
  if (!event) return null;
  const eventChoices = choices.filter(choice => choice.eventId === match.eventId);
  const eventReactions = reactions.filter(reaction => reaction.eventId === match.eventId);
  const locked = !!me && hiddenChoices.some(choice => choice.eventId === match.eventId && choice.candidateRole === me.role);
  const possibleReactions = Math.max(1, 2 * 5);
  const progress = match.eventStage === 'reaction'
    ? `${Math.min(match.reactionsLocked, possibleReactions)}/${possibleReactions} reactions recorded`
    : `${Math.min(match.choicesLocked, 2)}/2 candidate responses sealed`;

  return (
    <>
      <section className="cw-event" data-stage={match.eventStage}>
        <article className="cw-paper cw-pin cw-event-note" data-event={match.eventId}>
          <div className="cw-event-hero">
            <EventIllustration eventId={match.eventId} />
            <div className="cw-event-copy">
              <p className="cw-event-desk">{event.desk}</p>
              <h1 className="cw-title">{event.title}</h1>
              <p className="cw-event-body">{event.body}</p>
              <p className="cw-stakes">What is at stake: {event.stakes}</p>
            </div>
          </div>
          <div className="cw-instruction">
            <strong>{match.eventStage === 'reaction' ? 'The decisions are public. Committee heads react now.' : 'Discuss openly. Candidates decide in private.'}</strong>
            <span className="cw-progress">{progress}</span>
          </div>
          {match.eventStage === 'reaction' && (
            <>
              <div className="cw-reveal-grid">
                {eventChoices.map(choice => <DecisionCard choice={choice} reactions={eventReactions} players={players} key={choice.candidateRole} />)}
              </div>
              {!projector && me && isCommitteeHead(me.role) && (
                <div className="cw-options">
                  {eventChoices.map(choice => {
                    const mine = eventReactions.find(row => row.brokerRole === me.role && row.candidateRole === choice.candidateRole);
                    return (
                      <div className="cw-paper" style={{ padding: '0.85rem' }} key={choice.candidateRole}>
                        <strong>React to {nameFor(players, choice.candidateRole)}</strong>
                        <div className="cw-actions">
                          <button className="cw-btn" disabled={!!mine} onClick={() => actions.react(choice.candidateRole, 'approve')}>Helps us</button>
                          <button className="cw-btn cw-btn-danger" disabled={!!mine} onClick={() => actions.react(choice.candidateRole, 'disapprove')}>Burns us</button>
                          <button className="cw-btn cw-btn-secondary" disabled={!!mine} onClick={() => actions.react(choice.candidateRole, 'none')}>No public position</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </article>
      </section>
      {!projector && me && isCandidate(me.role) && match.eventStage === 'discussion' && (
        <CandidateChoiceTray eventId={match.eventId} locked={locked} onSubmit={actions.submitChoice} />
      )}
    </>
  );
}

function ManifestoStage({
  me,
  players,
  profiles,
  actions,
  projector,
}: {
  me?: PlayerView;
  players?: readonly PlayerView[];
  profiles: readonly ProfileView[];
  actions: CampusActions;
  projector: boolean;
}) {
  const [one, setOne] = useState(PRIORITIES[0].id);
  const [two, setTwo] = useState(PRIORITIES[1].id);
  const mine = profiles.find(profile => profile.role === me?.role);
  return (
    <section className="cw-event">
      <article className="cw-paper cw-pin cw-event-note">
        <span className="cw-stamp">Election committee · manifesto register</span>
        <h1 className="cw-title" style={{ marginTop: '1rem' }}>What will your campaign defend?</h1>
        <p className="cw-event-body">Every public priority is a promise the five committee heads can use against you later.</p>
        <div className="cw-reveal-grid">
          {CANDIDATES.map(role => {
            const profile = profiles.find(item => item.role === role);
            return (
              <div className="cw-paper cw-decision" data-candidate={role} key={role}>
                <CandidatePortrait role={role} />
                <span>
                  <strong>{nameFor(players, role)}</strong>
                  <ul className="cw-manifesto-list">
                    {manifestoLines(role, profile?.priorityOne, profile?.priorityTwo).map(line => <li key={line}>{line}</li>)}
                  </ul>
                </span>
              </div>
            );
          })}
        </div>
        {!projector && me && isCandidate(me.role) && !mine?.priorityOne && (
          <div className="cw-actions">
            <select className="cw-select" value={one} onChange={event => setOne(event.target.value)}>
              {PRIORITIES.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}
            </select>
            <select className="cw-select" value={two} onChange={event => setTwo(event.target.value)}>
              {PRIORITIES.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}
            </select>
            <button className="cw-btn" disabled={one === two} onClick={() => actions.setPriorities(one, two)}>Pin manifesto</button>
          </div>
        )}
      </article>
    </section>
  );
}

function ElectionStage({
  me,
  players,
  myBallots,
  actions,
  projector,
}: {
  me?: PlayerView;
  players: readonly PlayerView[];
  myBallots: readonly { brokerRole: string; candidateRole: string }[];
  actions: CampusActions;
  projector: boolean;
}) {
  const submitted = myBallots.some(ballot => ballot.brokerRole === me?.role);
  return (
    <section className="cw-event">
      <article className="cw-paper cw-pin cw-event-note">
        <span className="cw-stamp">Secret ballot · no amendments</span>
        <h1 className="cw-title" style={{ marginTop: '1rem' }}>One slip. One name.</h1>
        <p className="cw-event-body">Public endorsements do not bind this vote. The first candidate to three becomes President.</p>
        <div className="cw-reveal-grid">
          {CANDIDATES.map(role => (
            <div className="cw-paper cw-decision" data-candidate={role} key={role}>
              <CandidatePortrait role={role} />
              <h3>{nameFor(players, role)}</h3>
              {!projector && me && isCommitteeHead(me.role) && (
                <button className="cw-btn" disabled={submitted} onClick={() => actions.vote(role)}>
                  {submitted ? 'Ballot sealed' : `Vote ${ROLES[role].shortTitle}`}
                </button>
              )}
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function RevealStage({
  ballots,
  match,
  players,
}: {
  ballots: readonly BallotView[];
  match: MatchView;
  players?: readonly PlayerView[];
}) {
  return (
    <section className="cw-event">
      <article className="cw-paper cw-pin cw-event-note">
        <span className="cw-stamp">The returning officer</span>
        <h1 className="cw-title" style={{ marginTop: '1rem' }}>{match.winnerRole ? `${nameFor(players, match.winnerRole)} has the majority.` : 'The ballot box is open.'}</h1>
        <div className="cw-ballot-grid">
          {COMMITTEE_HEADS.map(role => {
            const ballot = ballots.find(item => item.brokerRole === role);
            return (
              <div className="cw-paper cw-ballot" data-revealed={!!ballot} key={role}>
                <strong>{nameFor(players, role)}</strong>
                <p className="cw-hand">{ballot ? `voted ${nameFor(players, ballot.candidateRole)}` : 'sealed'}</p>
                {ballot && !ballot.matchedEndorsement && <span className="cw-stamp">Endorsement betrayed</span>}
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}

function AllocationStage({
  match,
  me,
  players,
  actions,
  projector,
}: {
  match: MatchView;
  me?: PlayerView;
  players?: readonly PlayerView[];
  actions: CampusActions;
  projector: boolean;
}) {
  const [budgets, setBudgets] = useState<Record<string, number>>({
    sports: 20, culture: 20, hostel: 20, placement: 20, welfare: 20,
  });
  const [flagship, setFlagship] = useState(PROJECTS[0].id);
  const total = Object.values(budgets).reduce((sum, value) => sum + value, 0);
  const winner = me?.role === match.winnerRole;
  function adjust(role: string, delta: number) {
    setBudgets(current => ({ ...current, [role]: Math.max(0, Math.min(100, current[role] + delta)) }));
  }
  return (
    <section className="cw-event">
      <article className="cw-paper cw-pin cw-event-note">
        <span className="cw-stamp">President-elect · final mandate</span>
        <div className="cw-mandate-hero">
          <CandidatePortrait role={match.winnerRole} />
          <div>
            <h1 className="cw-title">₹100L. Every promise becomes arithmetic.</h1>
            <p className="cw-event-body">{nameFor(players, match.winnerRole)} now decides which departments—and which alliances—survive the year.</p>
          </div>
        </div>
        {projector || !winner ? (
          <p className="cw-hand">The President is preparing the final allocation in private.</p>
        ) : (
          <>
            <div style={{ marginTop: '1.2rem' }}>
              {COMMITTEE_HEADS.map(role => (
                <div className="cw-budget-row" key={role}>
                  <strong>{ROLES[role].shortTitle}</strong>
                  <button className="cw-btn cw-btn-secondary" onClick={() => adjust(role, -5)}>−</button>
                  <span className="cw-budget-value">₹{budgets[role]}L</span>
                  <button className="cw-btn cw-btn-secondary" onClick={() => adjust(role, 5)}>+</button>
                </div>
              ))}
            </div>
            <label className="cw-copy">Flagship project
              <select className="cw-select" value={flagship} onChange={event => setFlagship(event.target.value)}>
                {PROJECTS.map(project => <option value={project.id} key={project.id}>{project.label}</option>)}
              </select>
            </label>
            <div className="cw-instruction"><strong>Total allocated</strong><span>₹{total}L / ₹100L</span></div>
            <button
              className="cw-btn"
              disabled={total !== 100}
              onClick={() => actions.allocate({
                sportsBudget: budgets.sports,
                cultureBudget: budgets.culture,
                hostelBudget: budgets.hostel,
                placementBudget: budgets.placement,
                welfareBudget: budgets.welfare,
                flagship,
              })}
              style={{ marginTop: '1rem' }}
            >
              Publish the government
            </button>
          </>
        )}
      </article>
    </section>
  );
}

function ResultsStage({
  match,
  players,
  results,
  actions,
  projector,
}: {
  match: MatchView;
  players?: readonly PlayerView[];
  results: readonly ResultView[];
  actions: CampusActions;
  projector: boolean;
}) {
  const budget: Record<string, number> = {
    sports: match.sportsBudget,
    culture: match.cultureBudget,
    hostel: match.hostelBudget,
    placement: match.placementBudget,
    welfare: match.welfareBudget,
  };
  return (
    <section className="cw-event">
      <article className="cw-paper cw-pin cw-event-note">
        <span className="cw-stamp">Final gazette · public record</span>
        <div className="cw-mandate-hero">
          <CandidatePortrait role={match.winnerRole} />
          <div>
            <h1 className="cw-title">{nameFor(players, match.winnerRole)} · {match.ending}</h1>
            <p className="cw-event-body">Flagship: {projectLabel(match.flagship)}. The posters come down; the consequences remain.</p>
          </div>
        </div>
        <div className="cw-result-grid">
          {COMMITTEE_HEADS.map(role => {
            const result = results.find(item => item.brokerRole === role);
            return (
              <div className="cw-paper cw-result-card" key={role}>
                <strong>{nameFor(players, role)}</strong>
                <p className="cw-score">₹{budget[role]}L</p>
                <p className="cw-hand">{result?.tier ?? 'Awaiting result'}</p>
                {result && (
                  <div className="cw-copy">
                    <div>{result.minMet ? '✓' : '×'} Budget floor</div>
                    <div>{result.secretMet ? '✓' : '×'} Private project</div>
                    <div>{result.votedWinner ? '✓' : '×'} Backed the winner</div>
                    {result.redLineHit && <div>× Red line breached</div>}
                    {result.hadDeal && <div>{result.dealHonoured ? '✓ Promise honoured' : '× Promise betrayed'}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!projector && <button className="cw-btn cw-btn-secondary" style={{ marginTop: '1rem' }} onClick={actions.reset}>Return to nominations</button>}
      </article>
    </section>
  );
}

function SoapboxStage({
  players,
  profiles,
  choices,
  endorsements,
  exposedDeals,
}: {
  players?: readonly PlayerView[];
  profiles: readonly ProfileView[];
  choices: readonly ChoiceView[];
  endorsements: readonly EndorsementView[];
  exposedDeals: readonly ExposedDealView[];
}) {
  return (
    <section className="cw-event cw-soapbox">
      <article className="cw-paper cw-pin cw-event-note">
        <span className="cw-stamp">Final rally · 30 seconds · deals locked</span>
        <h1 className="cw-title" style={{ marginTop: '1rem' }}>What they stood for. What they actually did.</h1>
        <div className="cw-soapbox-grid">
          {CANDIDATES.map(role => {
            const profile = profiles.find(item => item.role === role);
            const record = choices.filter(choice => choice.candidateRole === role);
            const marks = record.map(choice => choiceCredibility(choice.eventId, choice.optionIndex, profile?.priorityOne, profile?.priorityTwo));
            const broken = marks.filter(mark => mark.verdict === 'betrayed' || mark.verdict === 'strained');
            return (
              <article className="cw-paper cw-ticket" data-candidate={role} key={role}>
                <header className="cw-ticket-head">
                  <CandidatePortrait role={role} />
                  <div>
                    <span className="cw-stamp">Presidential ticket</span>
                    <h2 className="cw-title">{nameFor(players, role)}</h2>
                    {broken.length > 0 && (
                      <p className="cw-credibility" data-verdict={broken[0].verdict}>
                        {broken.some(mark => mark.verdict === 'betrayed') ? 'Manifesto betrayal on the record' : 'Credibility under strain'}
                      </p>
                    )}
                  </div>
                </header>
                <div className="cw-soapbox-cols">
                  <section>
                    <strong>Stood for</strong>
                    <p className="cw-hand">{profile?.priorityOne ? `First: ${priorityLabel(profile.priorityOne)}` : 'No first priority sealed.'}</p>
                    <p className="cw-copy">{profile?.priorityTwo ? `Second: ${priorityLabel(profile.priorityTwo)}` : 'Second priority unstated.'}</p>
                    <ul className="cw-manifesto-list">
                      {manifestoLines(role, profile?.priorityOne, profile?.priorityTwo).slice(0, 2).map(line => <li key={line}>{line}</li>)}
                    </ul>
                  </section>
                  <section>
                    <strong>Actually did</strong>
                    <div className="cw-record">
                      {record.length === 0 && <p className="cw-copy">No public decisions yet.</p>}
                      {record.map(choice => {
                        const mark = marks.find(item => item.eventId === choice.eventId);
                        return (
                          <div className="cw-record-item" data-verdict={mark?.verdict} key={`${choice.eventId}-${choice.optionIndex}`}>
                            <span>{EVENTS[choice.eventId]?.title ?? choice.eventId}</span>
                            <p>{EVENTS[choice.eventId]?.options[choice.optionIndex] ?? `Option ${choice.optionIndex + 1}`}</p>
                            {mark?.note && <em>{mark.note}</em>}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
                <div className="cw-reaction-stamps">
                  {endorsements.filter(item => item.candidateRole === role).map(item => (
                    <span className="cw-reaction" key={item.brokerRole}>{nameFor(players, item.brokerRole)} endorsed</span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
        {exposedDeals.length > 0 && (
          <div className="cw-leak-strip">
            <strong>Leaked promises</strong>
            {exposedDeals.map(deal => `${nameFor(players, deal.candidateRole)} promised ${nameFor(players, deal.brokerRole)} ₹${deal.promisedBudget}L`).join(' · ')}
          </div>
        )}
      </article>
    </section>
  );
}

function DealComposer({
  role,
  actions,
}: {
  role: string;
  actions: CampusActions;
}) {
  const candidate = isCandidate(role);
  const [otherRole, setOtherRole] = useState(candidate ? COMMITTEE_HEADS[0] : CANDIDATES[0]);
  const [budget, setBudget] = useState(20);
  const [project, setProject] = useState('');
  const [support, setSupport] = useState('electoral');
  return (
    <div className="cw-archive-item">
      <strong>Table a private offer</strong>
      <select className="cw-select" value={otherRole} onChange={event => setOtherRole(event.target.value)}>
        {(candidate ? COMMITTEE_HEADS : CANDIDATES).map(item => <option value={item} key={item}>{roleTitle(item)}</option>)}
      </select>
      <div className="cw-actions">
        <select className="cw-select" value={budget} onChange={event => setBudget(Number(event.target.value))}>
          {[0, 5, 10, 15, 20, 25, 30, 35, 40].map(value => <option value={value} key={value}>₹{value}L</option>)}
        </select>
        <select className="cw-select" value={project} onChange={event => setProject(event.target.value)}>
          <option value="">No project promise</option>
          {PROJECTS.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}
        </select>
        <select className="cw-select" value={support} onChange={event => setSupport(event.target.value)}>
          <option value="electoral">Ask for private support</option>
          <option value="endorsement">Ask for public endorsement</option>
        </select>
      </div>
      <button
        className="cw-btn"
        disabled={budget === 0 && !project}
        onClick={() => actions.propose({
          brokerRole: candidate ? otherRole : role,
          candidateRole: candidate ? role : otherRole,
          promisedBudget: budget,
          promisedProject: project,
          requestedSupport: support,
        })}
        style={{ marginTop: '0.65rem' }}
      >
        Send private note
      </button>
    </div>
  );
}

export function PrivateFolio({
  me,
  match,
  relationships,
  deals,
  endorsements,
  feed,
  actions,
}: {
  me: PlayerView;
  match: MatchView;
  relationships: readonly RelationshipView[];
  deals: readonly DealView[];
  endorsements: readonly EndorsementView[];
  feed: readonly FeedView[];
  actions: CampusActions;
}) {
  const [tab, setTab] = useState<'brief' | 'relations' | 'deals' | 'archive'>('brief');
  const meta = ROLES[me.role];
  const myEndorsement = endorsements.find(item => item.brokerRole === me.role);
  const incomingCount = deals.filter(deal => deal.status === 'pending' && deal.fromRole !== me.role).length;
  return (
    <aside className="cw-paper cw-folio">
      <nav className="cw-folio-tabs" aria-label="Private folio">
        {(['brief', 'relations', 'deals', 'archive'] as const).map(item => (
          <button className="cw-folio-tab" aria-selected={tab === item} onClick={() => setTab(item)} key={item}>
            {item}{item === 'deals' && incomingCount > 0 && <span className="cw-tab-badge">{incomingCount}</span>}
          </button>
        ))}
      </nav>
      {tab === 'brief' && meta && (
        <>
          <span className="cw-stamp">Private folio</span>
          <p className="cw-hand">{meta.title}</p>
          <h3>{meta.privateGoal}</h3>
          <p className="cw-copy"><strong>Red line:</strong> {meta.redLine}</p>
          <p className="cw-copy"><strong>Victory:</strong> {meta.winCondition}</p>
          {myEndorsement?.candidateRole && <button className="cw-btn cw-btn-secondary" onClick={actions.withdraw}>Withdraw endorsement</button>}
        </>
      )}
      {tab === 'relations' && (
        <>
          <span className="cw-stamp">Relationship register</span>
          {relationships.map(row => {
            const other = row.candidateRole === me.role ? row.brokerRole : row.candidateRole;
            return (
              <div className="cw-relationship" data-state={row.state} key={`${row.candidateRole}-${row.brokerRole}`}>
                <span className="cw-relation-avatar">{ROLES[other]?.mark ?? '?'}</span>
                <span className="cw-relation-name">{roleTitle(other)}</span>
                <i className="cw-relation-line" />
                <span className="cw-rel-state" data-state={row.state}>{row.state}</span>
                {isCommitteeHead(me.role) && row.state === 'allied' && !myEndorsement?.candidateRole && (
                  <button className="cw-btn cw-btn-secondary" onClick={() => actions.endorse(row.candidateRole)}>Endorse</button>
                )}
              </div>
            );
          })}
        </>
      )}
      {tab === 'deals' && (
        <div className="cw-archive">
          {!match.dealsLocked && <DealComposer role={me.role} actions={actions} />}
          {deals.length === 0 && <p className="cw-copy">No private notes have crossed your desk.</p>}
          {deals.map(deal => {
            const incoming = deal.fromRole !== me.role && deal.status === 'pending';
            return (
              <div className="cw-archive-item" key={deal.id.toString()}>
                <strong>{roleTitle(deal.candidateRole)} ↔ {roleTitle(deal.brokerRole)} · {deal.status}</strong>
                <span>₹{deal.promisedBudget}L · {projectLabel(deal.promisedProject)} · {deal.requestedSupport}</span>
                {incoming && (
                  <div className="cw-actions">
                    <button className="cw-btn" onClick={() => actions.accept(deal.id)}>Accept</button>
                    <button className="cw-btn cw-btn-secondary" onClick={() => actions.counter({
                      dealId: deal.id,
                      promisedBudget: Math.min(40, deal.promisedBudget + 5),
                      promisedProject: deal.promisedProject,
                      requestedSupport: deal.requestedSupport,
                    })}>Counter +₹5L</button>
                    <button className="cw-btn cw-btn-danger" onClick={() => actions.reject(deal.id)}>Reject</button>
                  </div>
                )}
                {!match.dealsLocked && deal.status === 'accepted' && !deal.exposed && (
                  <button className="cw-btn cw-btn-danger" style={{ marginTop: '0.6rem' }} onClick={() => actions.expose(deal.id)}>Expose this deal</button>
                )}
              </div>
            );
          })}
        </div>
      )}
      {tab === 'archive' && (
        <div className="cw-archive">
          {[...feed].sort((a, b) => Number(b.id - a.id)).slice(0, 12).map(item => {
            const [prefix, text] = item.body.includes('|') ? item.body.split(/\|(.+)/) : ['Record', item.body];
            return <div className="cw-archive-item" key={item.id.toString()}><strong>{prefix}</strong>{text}</div>;
          })}
        </div>
      )}
    </aside>
  );
}

export function PublicArchive({ feed, facts }: { feed: readonly FeedView[]; facts: readonly FactView[] }) {
  const latest = [...feed].sort((a, b) => Number(b.id - a.id)).slice(0, 6);
  return (
    <section className="cw-paper" style={{ padding: '1.2rem', marginTop: '1rem' }}>
      <span className="cw-stamp">What campus remembers</span>
      <div className="cw-archive" style={{ marginTop: '1rem' }}>
        {facts.slice(-5).map(fact => <div className="cw-archive-item" key={fact.id.toString()}><strong>Campus fact</strong>{FACT_LABELS[fact.factId] ?? fact.factId}</div>)}
        {latest.map(item => <div className="cw-archive-item" key={item.id.toString()}>{item.body.replace(/^[A-Z]+\|/, '')}</div>)}
      </div>
    </section>
  );
}

export function MainStage({
  match,
  me,
  players,
  profiles,
  endorsements,
  relationships,
  deals,
  hiddenChoices,
  choices,
  reactions,
  facts,
  feed,
  ballots,
  myBallots,
  results,
  exposedDeals,
  actions,
  projector,
}: {
  match: MatchView;
  me?: PlayerView;
  players: readonly PlayerView[];
  profiles: readonly ProfileView[];
  endorsements: readonly EndorsementView[];
  relationships: readonly RelationshipView[];
  deals: readonly DealView[];
  hiddenChoices: readonly { eventId: string; candidateRole: string }[];
  choices: readonly ChoiceView[];
  reactions: readonly ReactionView[];
  facts: readonly FactView[];
  feed: readonly FeedView[];
  ballots: readonly BallotView[];
  myBallots: readonly { brokerRole: string; candidateRole: string }[];
  results: readonly ResultView[];
  exposedDeals: readonly ExposedDealView[];
  actions: CampusActions;
  projector: boolean;
}) {
  const latestBulletin = [...feed].sort((a, b) => Number(b.id - a.id))[0];
  let stage: ReactNode;
  if (match.phase === 'manifesto') stage = <ManifestoStage me={me} players={players} profiles={profiles} actions={actions} projector={projector} />;
  else if (match.eventId) stage = <EventStage match={match} me={me} players={players} choices={choices} hiddenChoices={hiddenChoices} reactions={reactions} actions={actions} projector={projector} />;
  else if (match.phase === 'soapbox') stage = <SoapboxStage players={players} profiles={profiles} choices={choices} endorsements={endorsements} exposedDeals={exposedDeals} />;
  else if (match.phase === 'election') stage = <ElectionStage me={me} players={players} myBallots={myBallots} actions={actions} projector={projector} />;
  else if (match.phase === 'reveal') stage = <RevealStage ballots={ballots} match={match} players={players} />;
  else if (match.phase === 'allocation') stage = <AllocationStage match={match} me={me} players={players} actions={actions} projector={projector} />;
  else stage = <ResultsStage match={match} players={players} results={results} actions={actions} projector={projector} />;

  return (
    <div className="cw-grid cw-stage-layout" data-projector={projector}>
      <main className="cw-main-stage">
        {latestBulletin && (
          <div className="cw-radio-caption" role="status" aria-live="polite">
            <strong>Campus Radio</strong>{latestBulletin.body.replace(/^[A-Z]+\|/, '')}
          </div>
        )}
        <div className="cw-scene" key={`${match.phase}-${match.eventStage}-${match.eventId}`}>{stage}</div>
        {projector && <PublicArchive feed={feed} facts={facts} />}
      </main>
      {!projector && me && (
        <PrivateFolio
          me={me}
          match={match}
          relationships={relationships}
          deals={deals}
          endorsements={endorsements}
          feed={feed}
          actions={actions}
        />
      )}
    </div>
  );
}
