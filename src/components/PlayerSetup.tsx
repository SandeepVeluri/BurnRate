import { useState } from 'react';
import type { PlayerColor } from '../game/types';

const PLAYER_CONFIGS: Array<{ color: PlayerColor; label: string; cssVar: string }> = [
  { color: 'p1', label: 'Magenta', cssVar: 'var(--color-player-p1)' },
  { color: 'p2', label: 'Teal',    cssVar: 'var(--color-player-p2)' },
  { color: 'p3', label: 'Purple',  cssVar: 'var(--color-player-p3)' },
  { color: 'p4', label: 'Lime',    cssVar: 'var(--color-player-p4)' },
];

interface Props {
  onStart: (players: Array<{ name: string; color: PlayerColor }>) => void;
}

export function PlayerSetup({ onStart }: Props) {
  const [count, setCount] = useState(2);
  const [names, setNames] = useState(['', '', '', '']);

  const handleStart = () => {
    const players = Array.from({ length: count }, (_, i) => ({
      name: names[i].trim() || `Player ${i + 1}`,
      color: PLAYER_CONFIGS[i].color,
    }));
    onStart(players);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-board-bg)',
        padding: 32,
      }}
    >
      <div
        style={{
          background: 'var(--color-territory-bg)',
          border: '1px solid var(--color-territory-border)',
          borderRadius: 12,
          padding: 40,
          maxWidth: 480,
          width: '100%',
        }}
      >
        <h1
          style={{
            color: 'var(--color-text-primary)',
            fontFamily: 'monospace',
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginBottom: 4,
            textAlign: 'center',
          }}
        >
          BURN RATE
        </h1>
        <p
          style={{
            color: 'var(--color-text-secondary)',
            fontFamily: 'monospace',
            fontSize: 11,
            textAlign: 'center',
            marginBottom: 32,
            letterSpacing: 1,
          }}
        >
          Growth Strategy Board Game
        </p>

        {/* Player count */}
        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: 'block',
              color: 'var(--color-text-secondary)',
              fontFamily: 'monospace',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            Number of Players
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: 6,
                  border: count === n ? '2px solid var(--color-text-primary)' : '1px solid var(--color-territory-border)',
                  background: count === n ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'monospace',
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Player name inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {Array.from({ length: count }, (_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Color indicator */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: PLAYER_CONFIGS[i].cssVar,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                }}
                title={`Player ${i + 1} — ${PLAYER_CONFIGS[i].label}`}
              >
                P{i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder={`Player ${i + 1} name`}
                  value={names[i]}
                  onChange={(e) => {
                    const next = [...names];
                    next[i] = e.target.value;
                    setNames(next);
                  }}
                  maxLength={20}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--color-territory-border)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'monospace',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap',
                  width: 52,
                }}
              >
                {PLAYER_CONFIGS[i].label}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleStart}
          style={{
            width: '100%',
            padding: '14px 0',
            borderRadius: 8,
            border: 'none',
            background: 'var(--color-player-p1)',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: 14,
            fontWeight: 900,
            letterSpacing: 2,
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Start Game →
        </button>

        <p style={{
          color: 'var(--color-text-secondary)',
          fontFamily: 'monospace',
          fontSize: 10,
          textAlign: 'center',
          marginTop: 16,
        }}>
          $15 cash · 6 flags · 10 rounds · highest EV wins
        </p>
      </div>
    </div>
  );
}
