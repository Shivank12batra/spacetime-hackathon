import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducer, useSpacetimeDB, useTable } from 'spacetimedb/react';
import { reducers, tables } from './module_bindings';
import { DESK } from './cinema';
import { CandidateDesk, HeadDesk, QuietLobby, SlimHud, type Actions } from './desks';
import { isCandidate, isCommitteeHead } from './data';
import { IconRadio } from './icons';
import { StorytellerCard, StorytellerOpen } from './scenes';
import { Atmosphere } from './Atmosphere';

function deadlineMs(match?: {
  deadlineMicros?: bigint;
  phaseEndsAt?: { microsSinceUnixEpoch?: bigint; __timestamp_micros_since_unix_epoch__?: bigint };
}) {
  if (!match) return 0;
  if (match.deadlineMicros && match.deadlineMicros > 0n) {
    return Number(match.deadlineMicros / 1000n);
  }
  const raw =
    match.phaseEndsAt?.microsSinceUnixEpoch ??
    match.phaseEndsAt?.__timestamp_micros_since_unix_epoch__;
  return raw ? Number(BigInt(raw) / 1000n) : 0;
}

function useCountdown(endsAtMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);
  if (!endsAtMs) return '--:--';
  const remaining = endsAtMs - now;
  if (remaining <= 0) return '0:00';
  const total = Math.floor(remaining / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

export function App() {
  const { isActive, identity, token, connectionError } = useSpacetimeDB();
  const [matches] = useTable(tables.matchState);
  const [players] = useTable(tables.player);
  const [profiles] = useTable(tables.candidateProfile);
  const [endorsements] = useTable(tables.endorsement);
  const [feed] = useTable(tables.feedItem);
  const [facts] = useTable(tables.campusFact);
  const [revealedChoices] = useTable(tables.revealedChoice);
  const [reactions] = useTable(tables.reaction);
  const [revealedBallots] = useTable(tables.revealedBallot);
  const [results] = useTable(tables.brokerResult);
  const [relationships] = useTable(tables.myRelationship);
  const [deals] = useTable(tables.myDeal);
  const [hiddenChoices] = useTable(tables.myHiddenChoice);
  const [myBallots] = useTable(tables.myBallot);

  const joinGame = useReducer(reducers.joinGame);
  const claimRole = useReducer(reducers.claimRole);
  const startMatch = useReducer(reducers.startMatch);
  const resetMatch = useReducer(reducers.resetMatch);
  const forceAdvance = useReducer(reducers.forceAdvance);
  const setPriorities = useReducer(reducers.setPriorities);
  const proposeDeal = useReducer(reducers.proposeDeal);
  const acceptDeal = useReducer(reducers.acceptDeal);
  const rejectDeal = useReducer(reducers.rejectDeal);
  const submitChoice = useReducer(reducers.submitChoice);
  const reactToCandidate = useReducer(reducers.reactToCandidate);
  const endorseCandidate = useReducer(reducers.endorseCandidate);
  const withdrawMyEndorsement = useReducer(reducers.withdrawMyEndorsement);
  const castBallot = useReducer(reducers.castBallot);
  const submitAllocation = useReducer(reducers.submitAllocation);

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [flash, setFlash] = useState(false);
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const seatKey = params.get('as') || 'default';
  const autoName = params.get('join');
  const autoRole = params.get('role');
  const [briefed, setBriefed] = useState(
    () => sessionStorage.getItem('km_brief') === '1' || !!autoName
  );
  const [announce, setAnnounce] = useState<string | null>(null);
  const prevPhase = useRef('lobby');
  const dismissAnnounce = useCallback(() => setAnnounce(null), []);

  useEffect(() => {
    if (token) localStorage.setItem(`kingmaker_token_${seatKey}`, token);
  }, [token, seatKey]);

  const match = matches[0] ?? {
    phase: 'lobby',
    phaseEndsAt: undefined,
    eventId: '',
    winnerRole: '',
    flagship: '',
    sportsBudget: 0,
    cultureBudget: 0,
    hostelBudget: 0,
    placementBudget: 0,
    welfareBudget: 0,
    ballotsRevealed: 0,
    dealsLocked: false,
    winAt: 3,
    ending: '',
    id: 0n,
    deadlineMicros: 0n,
  };

  const me = useMemo(
    () => players.find(player => identity && player.identity.isEqual(identity)),
    [players, identity]
  );
  const clock = useCountdown(deadlineMs(match));
  const phase = match.phase ?? 'lobby';

  useEffect(() => {
    if (phase === prevPhase.current) return;
    prevPhase.current = phase;
    if (phase === 'lobby') {
      setAnnounce(null);
      return;
    }
    setAnnounce(phase);
  }, [phase]);

  const latestVerdict = [...feed]
    .sort((a, b) => Number(b.id - a.id))
    .find(item => item.body.startsWith('VERDICT|'));

  useEffect(() => {
    if (!latestVerdict) return;
    setFlash(true);
    const spoken = latestVerdict.body.replace(/^VERDICT\|/, '');
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(spoken);
      utterance.rate = 0.92;
      utterance.pitch = 0.82;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
    const timer = window.setTimeout(() => setFlash(false), 1800);
    return () => window.clearTimeout(timer);
  }, [latestVerdict?.id]);

  useEffect(() => {
    if (!isActive || !autoName || me) return;
    void joinGame({ displayName: autoName }).catch(err => {
      setError(err instanceof Error ? err.message : 'Join failed');
    });
  }, [isActive, autoName, me, joinGame]);

  useEffect(() => {
    if (!me || !autoRole || me.role === autoRole) return;
    void claimRole({ role: autoRole }).catch(err => {
      setError(err instanceof Error ? err.message : 'Claim failed');
    });
  }, [me, autoRole, claimRole]);

  async function run(label: string, fn: () => Promise<void>) {
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? `${label}: ${err.message}` : `${label} failed`);
    }
  }

  const actions: Actions = {
    run,
    proposeDeal: values => run('Deal', () => proposeDeal(values)),
    acceptDeal: id => run('Accept', () => acceptDeal({ dealId: id })),
    rejectDeal: id => run('Reject', () => rejectDeal({ dealId: id })),
    setPriorities: (priorityOne, priorityTwo) =>
      run('Poster', () => setPriorities({ priorityOne, priorityTwo })),
    endorse: candidateRole => run('Back', () => endorseCandidate({ candidateRole })),
    withdraw: () => run('Unstamp', () => withdrawMyEndorsement()),
    submitChoice: (optionIndex, budgetCommit) =>
      run('Line', () => submitChoice({ optionIndex, budgetCommit })),
    react: (candidateRole, stance) => run('Stamp', () => reactToCandidate({ candidateRole, stance })),
    vote: candidateRole => run('Vote', () => castBallot({ candidateRole })),
    allocate: values => run('Mandate', () => submitAllocation(values)),
  };

  if (connectionError) {
    return (
      <div className="app">
        <Atmosphere phase="lobby" />
        <div className="stage">
          <h1 className="title-line">Campus is dark.</h1>
          <p className="muted">{String(connectionError)}</p>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="app">
        <Atmosphere phase="lobby" />
        <div className="stage title-seq">
          <p className="title-kicker">ASTERIA INSTITUTE</p>
          <h1 className="title-line">Walking onto the lawn…</h1>
        </div>
      </div>
    );
  }

  if (!briefed) {
    return (
      <div className="app">
        <Atmosphere phase="lobby" />
        <StorytellerOpen
          onEnter={() => {
            sessionStorage.setItem('km_brief', '1');
            setBriefed(true);
          }}
        />
      </div>
    );
  }

  const urgent = clock.startsWith('0:') && Number(clock.slice(2)) <= 10;
  const incoming = deals.filter(deal => deal.status === 'pending' && deal.fromRole !== me?.role);
  const deskTheme = me?.role && DESK[me.role] ? DESK[me.role].theme : 'lobby';
  const ctx = { profiles, deals, relationships, endorsements, revealedChoices };

  return (
    <div className={`app desk-app ${flash ? 'radio-slam' : ''}`} data-phase={phase} data-desk={deskTheme}>
      <Atmosphere phase={phase} flash={flash} />
      <SlimHud
        phase={phase}
        clock={clock}
        urgent={urgent}
        onSkip={() => run('Skip', () => forceAdvance())}
        onReset={() => run('Reset', () => resetMatch())}
      />
      {error && <p className="error-banner">{error}</p>}
      {announce && <StorytellerCard phase={announce} onDone={dismissAnnounce} />}
      <div className="stage">
      {flash && latestVerdict && (
        <div className="radio-blast">
          <div className="radio-blast-tag">
            <IconRadio size={15} />
            <span>CAMPUS RADIO SPECIAL BULLETIN</span>
          </div>
          <p className="radio-blast-msg">{latestVerdict.body.replace(/^VERDICT\|/, '')}</p>
        </div>
      )}

      {!me && (
        <section className="verb-panel" style={{ maxWidth: '440px', margin: '60px auto', textAlign: 'center' }}>
          <div className="verb-title" style={{ justifyContent: 'center' }}>
            REGISTRATION DESK
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
            Enter your candidate or committee identity to enter the chamber.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder="e.g. Kabir or Priya"
            />
            <button
              className="btn-primary-action"
              style={{ width: 'auto', padding: '12px 24px' }}
              onClick={() => run('Join', () => joinGame({ displayName: name }))}
            >
              JOIN
            </button>
          </div>
        </section>
      )}

      {me && phase === 'lobby' && (
        <div className="scene-in" key="lobby">
          <QuietLobby
            meRole={me.role}
            players={players}
            onClaim={role => run('Claim', () => claimRole({ role }))}
            onStart={() => run('Start', () => startMatch())}
          />
        </div>
      )}

      {me && phase !== 'lobby' && isCommitteeHead(me.role) && (
        <HeadDesk
          me={me}
          match={match}
          players={players}
          incoming={incoming}
          hiddenChoices={hiddenChoices}
          myBallots={myBallots}
          reactions={reactions}
          revealedBallots={revealedBallots}
          results={results}
          facts={facts}
          ctx={ctx}
          actions={actions}
          flash={flash}
        />
      )}

      {me && phase !== 'lobby' && isCandidate(me.role) && (
        <CandidateDesk
          me={me}
          match={match}
          players={players}
          incoming={incoming}
          hiddenChoices={hiddenChoices}
          ctx={ctx}
          actions={actions}
          flash={flash}
          revealedBallots={revealedBallots}
          results={results}
        />
      )}

      {me && phase !== 'lobby' && !isCandidate(me.role) && !isCommitteeHead(me.role) && (
        <p className="watch-line">You are on the lawn. Claim a seat next match.</p>
      )}

      {/* facts kept subscribed so the client cache stays warm */}
      <span hidden>{facts.length}</span>
      </div>
    </div>
  );
}
