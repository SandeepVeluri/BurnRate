import { Fragment } from 'react';
import type { Phase } from '../game/types';

interface Props {
  round: number;
  phase: Phase;
}

const PHASES: Phase[] = ['event', 'actions', 'market', 'revenue'];
const PHASE_LABELS: Record<Phase, string> = {
  event: 'Event',
  actions: 'Actions',
  market: 'Market',
  revenue: 'Revenue',
  endgame: 'End',
};

export function RoundTracker({ round, phase }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '10px 20px',
        background: 'var(--color-territory-bg)',
        borderBottom: '1px solid var(--color-territory-border)',
      }}
    >
      {/* Round track */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
          Round
        </span>
        <div style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                background: i + 1 === round ? 'var(--color-player-p1)' : (i + 1 < round ? 'rgba(255,255,255,0.1)' : 'transparent'),
                border: i + 1 === round ? 'none' : '1px solid rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: i + 1 === round ? '#fff' : (i + 1 < round ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.25)'),
                fontFamily: 'monospace',
                fontSize: 10,
                fontWeight: i + 1 === round ? 700 : 400,
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--color-territory-border)' }} />

      {/* Phase strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginRight: 4 }}>
          Phase
        </span>
        {PHASES.map((p, i) => (
          <Fragment key={p}>
            <div
              style={{
                padding: '3px 10px',
                borderRadius: 4,
                background: p === phase ? 'rgba(255,255,255,0.12)' : 'transparent',
                border: p === phase ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
                color: p === phase ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: p === phase ? 700 : 400,
              }}
            >
              {PHASE_LABELS[p]}
            </div>
            {i < PHASES.length - 1 && (
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 10 }}>›</span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
