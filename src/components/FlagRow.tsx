
import type { PlayerColor } from '../game/types';

interface Props {
  flags: string[];
  playerColors: Record<string, PlayerColor>;
}

const PLAYER_COLOR_CSS_VAR: Record<PlayerColor, string> = {
  p1: 'var(--color-player-p1)',
  p2: 'var(--color-player-p2)',
  p3: 'var(--color-player-p3)',
  p4: 'var(--color-player-p4)',
};

export function FlagRow({ flags, playerColors }: Props) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: 4 }, (_, i) => {
        const playerId = flags[i];
        const color = playerId && playerColors[playerId]
          ? PLAYER_COLOR_CSS_VAR[playerColors[playerId]]
          : null;

        return (
          <div
            key={i}
            style={{
              width: 18,
              height: 18,
              borderRadius: 3,
              background: color ?? 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
            }}
            title={playerId ? `Player flag` : 'Empty slot'}
          >
            {color && <span style={{ color: '#fff', fontSize: 9 }}>⚑</span>}
          </div>
        );
      })}
    </div>
  );
}
