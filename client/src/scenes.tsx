import { useEffect, useState } from 'react';
import { OPENING, PHASE_ANNOUNCE } from './storyteller';
import { IconRadio } from './icons';

export function StorytellerOpen({ onEnter }: { onEnter: () => void }) {
  const [beat, setBeat] = useState(0);
  const last = beat >= OPENING.length - 1;
  const card = OPENING[Math.min(beat, OPENING.length - 1)];

  useEffect(() => {
    if (last) return;
    const id = window.setTimeout(() => setBeat(n => n + 1), 3200);
    return () => window.clearTimeout(id);
  }, [beat, last]);

  return (
    <div className="title-seq">
      <div key={beat}>
        <p className="title-kicker">{card.kicker}</p>
        <h1 className="title-line">{card.line}</h1>
        <div className="title-dots">
          {OPENING.map((_, i) => (
            <i key={i} className={i === beat ? 'on' : ''} />
          ))}
        </div>
        {last ? (
          <button className="btn-primary-action" onClick={onEnter}>
            ENTER THE CHAMBER
          </button>
        ) : (
          <button className="btn-ghost-action" type="button" onClick={() => setBeat(n => n + 1)}>
            CONTINUE
          </button>
        )}
      </div>
    </div>
  );
}

export function StorytellerCard({
  phase,
  onDone,
}: {
  phase: string;
  onDone: () => void;
}) {
  const card = PHASE_ANNOUNCE[phase];
  useEffect(() => {
    const id = window.setTimeout(onDone, 4000);
    return () => window.clearTimeout(id);
  }, [phase, onDone]);

  if (!card) return null;
  return (
    <button type="button" className="storyteller-overlay scene-in" onClick={onDone}>
      <div className="storyteller-card">
        <span className="storyteller-kicker">
          <IconRadio size={14} />
          {card.kicker}
        </span>
        <h1 className="storyteller-line">{card.line}</h1>
        <span className="storyteller-hint">TAP TO CONTINUE</span>
      </div>
    </button>
  );
}
