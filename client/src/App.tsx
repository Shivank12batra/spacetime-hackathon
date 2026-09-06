import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducer, useSpacetimeDB, useTable } from 'spacetimedb/react';
import { useCampusAudio } from './AudioManager';
import { CampusBackdrop } from './GameAssets';
import {
  AudioSettings,
  BoardTopbar,
  LobbyBoard,
  MainStage,
  Registration,
  RoleDossier,
  StoryOnboarding,
  VictoryCelebration,
  type CampusActions,
  type MatchView,
  type PlayerView,
} from './CampusUI';
import { reducers, tables } from './module_bindings';
import { GAME_TITLE, roleTitle, seatLabel } from './world';

function deadlineMs(match?: { deadlineMicros?: bigint }) {
  if (!match?.deadlineMicros || match.deadlineMicros <= 0n) return 0;
  return Number(match.deadlineMicros / 1000n);
}

function useCountdown(endsAtMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);
  if (!endsAtMs) return '--:--';
  const remaining = Math.max(0, endsAtMs - now);
  const total = Math.ceil(remaining / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

const EMPTY_MATCH: MatchView = {
  phase: 'lobby',
  eventId: '',
  eventStage: '',
  deadlineMicros: 0n,
  choicesLocked: 0,
  reactionsLocked: 0,
  dealsLocked: false,
  winnerRole: '',
  flagship: '',
  sportsBudget: 0,
  cultureBudget: 0,
  hostelBudget: 0,
  placementBudget: 0,
  welfareBudget: 0,
  ballotsRevealed: 0,
  winAt: 3,
  ending: '',
};

export function App() {
  const { isActive, identity, connectionError } = useSpacetimeDB();
  const [matches] = useTable(tables.matchState);
  const [players] = useTable(tables.player);
  const [profiles] = useTable(tables.candidateProfile);
  const [endorsements] = useTable(tables.endorsement);
  const [feed] = useTable(tables.feedItem);
  const [facts] = useTable(tables.campusFact);
  const [choices] = useTable(tables.revealedChoice);
  const [reactions] = useTable(tables.reaction);
  const [ballots] = useTable(tables.revealedBallot);
  const [results] = useTable(tables.brokerResult);
  const [exposedDeals] = useTable(tables.exposedDeal);
  const [relationships] = useTable(tables.myRelationship);
  const [deals] = useTable(tables.myDeal);
  const [hiddenChoices] = useTable(tables.myHiddenChoice);
  const [myBallots] = useTable(tables.myBallot);

  const joinGame = useReducer(reducers.joinGame);
  const claimRole = useReducer(reducers.claimRole);
  const setReady = useReducer(reducers.setReady);
  const startMatch = useReducer(reducers.startMatch);
  const resetMatch = useReducer(reducers.resetMatch);
  const forceAdvance = useReducer(reducers.forceAdvance);
  const setPriorities = useReducer(reducers.setPriorities);
  const proposeDeal = useReducer(reducers.proposeDeal);
  const counterDeal = useReducer(reducers.counterDeal);
  const acceptDeal = useReducer(reducers.acceptDeal);
  const rejectDeal = useReducer(reducers.rejectDeal);
  const exposeDeal = useReducer(reducers.exposeDeal);
  const submitChoice = useReducer(reducers.submitChoice);
  const reactToCandidate = useReducer(reducers.reactToCandidate);
  const endorseCandidate = useReducer(reducers.endorseCandidate);
  const withdrawMyEndorsement = useReducer(reducers.withdrawMyEndorsement);
  const castBallot = useReducer(reducers.castBallot);
  const submitAllocation = useReducer(reducers.submitAllocation);

  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const projector = query.get('view') === 'board';
  const autoName = query.get('join');
  const autoRole = query.get('role');
  const autoReady = query.get('ready') === '1';
  const audio = useCampusAudio();
  const [briefed, setBriefed] = useState(projector || !!autoName);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dossierSeen, setDossierSeen] = useState(false);
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);
  const [relationshipNotice, setRelationshipNotice] = useState('');

  const match = (matches[0] ?? EMPTY_MATCH) as MatchView;
  const me = useMemo(
    () => players.find(player => identity && player.identity.isEqual(identity)),
    [players, identity]
  );
  const clock = useCountdown(deadlineMs(match));

  const run = useCallback(async (label: string, action: () => Promise<void>) => {
    setError('');
    try {
      await action();
    } catch (caught) {
      setError(caught instanceof Error ? `${label}: ${caught.message}` : `${label} failed`);
    }
  }, []);

  const actions: CampusActions = {
    claimRole: role => {
      audio.cue('paper');
      void run('Claim role', () => claimRole({ role }));
    },
    setReady: ready => {
      audio.cue(ready ? 'stamp' : 'paper');
      void run('Seal role', () => setReady({ ready }));
    },
    start: () => {
      audio.cue('radio');
      void run('Start match', () => startMatch());
    },
    reset: () => void run('Reset', () => resetMatch()),
    advance: () => void run('Advance', () => forceAdvance()),
    setPriorities: (priorityOne, priorityTwo) => {
      audio.cue('pin');
      void run('Manifesto', () => setPriorities({ priorityOne, priorityTwo }));
    },
    submitChoice: (optionIndex, budgetCommit) => {
      audio.cue('stamp');
      void run('Decision', () => submitChoice({ optionIndex, budgetCommit }));
    },
    react: (candidateRole, stance) => {
      audio.cue('stamp');
      void run('Reaction', () => reactToCandidate({ candidateRole, stance }));
    },
    endorse: candidateRole => {
      audio.cue('stamp');
      void run('Endorsement', () => endorseCandidate({ candidateRole }));
    },
    withdraw: () => void run('Withdraw endorsement', () => withdrawMyEndorsement()),
    vote: candidateRole => {
      audio.cue('ballot');
      void run('Ballot', () => castBallot({ candidateRole }));
    },
    propose: values => {
      audio.cue('paper');
      void run('Private offer', () => proposeDeal(values));
    },
    counter: values => void run('Counter-offer', () => counterDeal(values)),
    accept: dealId => {
      audio.cue('stamp');
      void run('Accept deal', () => acceptDeal({ dealId }));
    },
    reject: dealId => void run('Reject deal', () => rejectDeal({ dealId })),
    expose: dealId => {
      audio.cue('radio');
      void run('Expose deal', () => exposeDeal({ dealId }));
    },
    allocate: values => {
      audio.cue('winner');
      void run('Final allocation', () => submitAllocation(values));
    },
  };

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    Object.assign(window, {
      __campusWhispersAdvance: () => forceAdvance(),
      __campusWhispersReset: () => resetMatch(),
    });
  }, [forceAdvance, resetMatch]);

  useEffect(() => {
    if (!isActive || !autoName || me || projector) return;
    void run('Automatic join', () => joinGame({ displayName: autoName }));
  }, [isActive, autoName, me, projector, joinGame, run]);

  useEffect(() => {
    if (!me || !autoRole || me.role === autoRole || projector) return;
    void run('Automatic role', () => claimRole({ role: autoRole }));
  }, [me, autoRole, projector, claimRole, run]);

  useEffect(() => {
    if (!me || !autoReady || !me.role || me.ready || projector) return;
    void run('Seal role', () => setReady({ ready: true }));
  }, [me, autoReady, projector, setReady, run]);

  const previousPhase = useRef(match.phase);
  useEffect(() => {
    if (previousPhase.current === match.phase) return;
    previousPhase.current = match.phase;
    if (match.phase === 'reveal') audio.cue('ballot');
    else if (match.phase === 'allocation' || match.phase === 'results') audio.cue('winner');
    else audio.cue('radio');
  }, [match.phase, audio]);

  const previousStage = useRef(match.eventStage);
  useEffect(() => {
    if (previousStage.current === match.eventStage) return;
    previousStage.current = match.eventStage;
    if (match.eventStage === 'reaction') audio.cue('radio');
  }, [match.eventStage, audio]);

  const previousBallots = useRef(ballots.length);
  useEffect(() => {
    if (ballots.length > previousBallots.current) audio.cue('ballot');
    previousBallots.current = ballots.length;
  }, [ballots.length, audio]);

  const previousRelationships = useRef<Map<string, string> | null>(null);
  useEffect(() => {
    const next = new Map(
      relationships.map(row => [`${row.candidateRole}:${row.brokerRole}`, row.state])
    );
    const previous = previousRelationships.current;
    if (previous) {
      for (const row of relationships) {
        const key = `${row.candidateRole}:${row.brokerRole}`;
        const before = previous.get(key);
        if (before && before !== row.state) {
          setRelationshipNotice(
            `${roleTitle(row.brokerRole)} and ${roleTitle(row.candidateRole)}: ${before} → ${row.state}. The latest public action changed this relationship.`
          );
          window.setTimeout(() => setRelationshipNotice(''), 5200);
          break;
        }
      }
    }
    previousRelationships.current = next;
  }, [relationships]);

  useEffect(() => {
    if (match.phase === 'lobby') {
      setDossierSeen(false);
      setCelebrationDismissed(false);
    }
  }, [match.phase]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [briefed, me?.role, match.phase, match.eventStage]);

  if (connectionError) {
    return (
      <main className="cw-enter">
        <div className="cw-enter-card">
          <span className="cw-stamp">Connection notice</span>
          <h1 className="cw-display">The board went quiet.</h1>
          <p className="cw-enter-copy">{String(connectionError)}</p>
        </div>
      </main>
    );
  }

  if (!isActive) {
    return (
      <main className="cw-enter">
        <div className="cw-enter-card">
          <span className="cw-stamp">Asteria Institute</span>
          <h1 className="cw-display">{GAME_TITLE}</h1>
          <p className="cw-enter-copy">Unlocking the common room…</p>
        </div>
      </main>
    );
  }

  if (!briefed && !projector) {
    return (
      <div className="cw-app">
        <CampusBackdrop />
        <StoryOnboarding
          cue={audio.cue}
          onActivate={() => void audio.enter()}
          onDone={() => {
            if (match.phase !== 'lobby') {
              void run('Reset', () => resetMatch());
            }
            setBriefed(true);
          }}
        />
      </div>
    );
  }

  if (!me && !projector) {
    return (
      <div className="cw-app">
        <CampusBackdrop />
        <Registration name={name} onName={setName} onJoin={() => void run('Join', () => joinGame({ displayName: name }))} />
      </div>
    );
  }

  if (match.phase === 'lobby') {
    if (projector) {
      return (
        <div className="cw-app">
          <CampusBackdrop />
          <BoardTopbar match={match} clock={clock} audio={audio} projector onSettings={() => setSettingsOpen(true)} />
          <main className="cw-board">
            <section className="cw-notice-sequence cw-grid">
              <article className="cw-paper cw-pin cw-story-note">
                <span className="cw-stamp">Public common board</span>
                <h1 className="cw-title" style={{ margin: '1rem 0' }}>Nominations are still open.</h1>
                <p className="cw-copy">{players.filter(player => player.role).length}/7 seats claimed · {players.filter(player => player.ready).length}/7 seals set</p>
              </article>
            </section>
          </main>
          {settingsOpen && <AudioSettings audio={audio} onClose={() => setSettingsOpen(false)} />}
        </div>
      );
    }
    return (
      <div className="cw-app">
        <CampusBackdrop />
        <LobbyBoard me={me as PlayerView} players={players} actions={actions} />
      </div>
    );
  }

  return (
    <div className="cw-app">
      <CampusBackdrop />
      <BoardTopbar match={match} clock={clock} audio={audio} projector={projector} onSettings={() => setSettingsOpen(true)} />
      <div className="cw-board">
        {error && <div className="cw-error" role="alert">{error}</div>}
        <MainStage
          match={match}
          me={me as PlayerView | undefined}
          players={players}
          profiles={profiles}
          endorsements={endorsements}
          relationships={relationships}
          deals={deals}
          hiddenChoices={hiddenChoices}
          choices={choices}
          reactions={reactions}
          facts={facts}
          feed={feed}
          ballots={ballots}
          myBallots={myBallots}
          results={results}
          exposedDeals={exposedDeals}
          actions={actions}
          projector={projector}
        />
      </div>
      {!projector && me && !dossierSeen && (
        <RoleDossier role={me.role} cue={audio.cue} onClose={() => setDossierSeen(true)} />
      )}
      {relationshipNotice && <div className="cw-relation-notice" role="status">{relationshipNotice}</div>}
      {match.phase === 'results' && match.winnerRole && !celebrationDismissed && (
        <VictoryCelebration
          winnerName={seatLabel(match.winnerRole, players.find(player => player.role === match.winnerRole)?.displayName)}
          ending={match.ending}
          personal={me?.role === match.winnerRole}
          onClose={() => setCelebrationDismissed(true)}
        />
      )}
      {settingsOpen && <AudioSettings audio={audio} onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
