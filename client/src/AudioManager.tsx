import { useCallback, useEffect, useRef, useState } from 'react';

type AudioBus = {
  context: AudioContext;
  master: GainNode;
  ambience: GainNode;
  effects: GainNode;
  ambienceSource: AudioBufferSourceNode;
};

function makeAmbience(context: AudioContext): AudioBuffer {
  const seconds = 6;
  const buffer = context.createBuffer(2, context.sampleRate * seconds, context.sampleRate);
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    let drift = 0;
    for (let index = 0; index < data.length; index += 1) {
      const white = Math.random() * 2 - 1;
      drift = drift * 0.985 + white * 0.015;
      const distantRoom = Math.sin(index / 1790 + channel * 0.8) * 0.03;
      data[index] = drift * 0.17 + distantRoom;
    }
  }
  return buffer;
}

function buildBus(): AudioBus {
  const context = new AudioContext();
  const master = context.createGain();
  const ambience = context.createGain();
  const effects = context.createGain();
  const filter = context.createBiquadFilter();
  const ambienceSource = context.createBufferSource();

  master.gain.value = 0.72;
  ambience.gain.value = 0.2;
  effects.gain.value = 0.34;
  filter.type = 'lowpass';
  filter.frequency.value = 1050;
  filter.Q.value = 0.5;
  ambienceSource.buffer = makeAmbience(context);
  ambienceSource.loop = true;
  ambienceSource.connect(filter).connect(ambience).connect(master);
  effects.connect(master);
  master.connect(context.destination);
  ambienceSource.start();

  return { context, master, ambience, effects, ambienceSource };
}

function tone(
  bus: AudioBus,
  frequency: number,
  duration: number,
  gain: number,
  type: OscillatorType = 'sine',
  delay = 0
) {
  const now = bus.context.currentTime + delay;
  const oscillator = bus.context.createOscillator();
  const envelope = bus.context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(gain, now + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(envelope).connect(bus.effects);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

export type CampusAudio = {
  enabled: boolean;
  muted: boolean;
  ambience: number;
  effects: number;
  enter: () => Promise<void>;
  toggleMute: () => void;
  setAmbience: (value: number) => void;
  setEffects: (value: number) => void;
  cue: (name: 'paper' | 'pin' | 'stamp' | 'radio' | 'ballot' | 'winner') => void;
};

export function useCampusAudio(): CampusAudio {
  const bus = useRef<AudioBus | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [muted, setMuted] = useState(() => localStorage.getItem('cw_muted') === '1');
  const [ambience, setAmbienceState] = useState(0.2);
  const [effects, setEffectsState] = useState(0.34);

  const enter = useCallback(async () => {
    if (!bus.current) bus.current = buildBus();
    await bus.current.context.resume();
    setEnabled(true);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(current => {
      const next = !current;
      localStorage.setItem('cw_muted', next ? '1' : '0');
      return next;
    });
  }, []);

  const setAmbience = useCallback((value: number) => {
    setAmbienceState(value);
    if (bus.current) {
      bus.current.ambience.gain.setTargetAtTime(value, bus.current.context.currentTime, 0.08);
    }
  }, []);

  const setEffects = useCallback((value: number) => {
    setEffectsState(value);
    if (bus.current) {
      bus.current.effects.gain.setTargetAtTime(value, bus.current.context.currentTime, 0.04);
    }
  }, []);

  const cue = useCallback((name: 'paper' | 'pin' | 'stamp' | 'radio' | 'ballot' | 'winner') => {
    const active = bus.current;
    if (!active || muted) return;
    if (name === 'paper') {
      tone(active, 160, 0.11, 0.07, 'triangle');
    } else if (name === 'pin') {
      tone(active, 1280, 0.08, 0.12, 'sine');
      tone(active, 660, 0.1, 0.07, 'triangle', 0.025);
    } else if (name === 'stamp') {
      tone(active, 92, 0.14, 0.2, 'square');
    } else if (name === 'ballot') {
      tone(active, 310, 0.12, 0.09, 'triangle');
      tone(active, 205, 0.16, 0.07, 'sine', 0.08);
    } else if (name === 'winner') {
      tone(active, 392, 0.35, 0.09);
      tone(active, 523, 0.42, 0.1, 'sine', 0.16);
      tone(active, 659, 0.5, 0.11, 'sine', 0.34);
    } else {
      active.ambience.gain.setTargetAtTime(0.06, active.context.currentTime, 0.05);
      tone(active, 740, 0.12, 0.1, 'sine');
      tone(active, 988, 0.2, 0.08, 'sine', 0.12);
      tone(active, 587, 0.28, 0.08, 'triangle', 0.27);
      window.setTimeout(() => {
        if (bus.current && !muted) {
          bus.current.ambience.gain.setTargetAtTime(ambience, bus.current.context.currentTime, 0.5);
        }
      }, 1100);
    }
  }, [ambience, muted]);

  useEffect(() => {
    if (!bus.current) return;
    bus.current.master.gain.setTargetAtTime(muted ? 0.0001 : 0.72, bus.current.context.currentTime, 0.06);
  }, [muted]);

  useEffect(() => () => {
    bus.current?.ambienceSource.stop();
    void bus.current?.context.close();
  }, []);

  return {
    enabled,
    muted,
    ambience,
    effects,
    enter,
    toggleMute,
    setAmbience,
    setEffects,
    cue,
  };
}
