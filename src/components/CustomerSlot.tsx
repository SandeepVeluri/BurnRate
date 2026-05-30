
import type { Customer, PlayerColor } from '../game/types';

interface Props {
  customer: Customer;
  playerColors: Record<string, PlayerColor>;
}

const STAGE_CSS_VAR: Record<string, string> = {
  unaware: 'var(--color-stage-unaware)',
  aware:   'var(--color-stage-aware)',
  adopter: 'var(--color-stage-adopter)',
  loyal:   'var(--color-stage-loyal)',
};

const PLAYER_COLOR_CSS_VAR: Record<PlayerColor, string> = {
  p1: 'var(--color-player-p1)',
  p2: 'var(--color-player-p2)',
  p3: 'var(--color-player-p3)',
  p4: 'var(--color-player-p4)',
};

export function CustomerSlot({ customer, playerColors }: Props) {
  const tokenColor = STAGE_CSS_VAR[customer.stage] ?? 'var(--color-stage-unaware)';
  const ownerColor =
    customer.ownerId && playerColors[customer.ownerId]
      ? PLAYER_COLOR_CSS_VAR[playerColors[customer.ownerId]]
      : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {/* Loyalty pips above token */}
      <div style={{ display: 'flex', gap: 2, height: 6, alignItems: 'center' }}>
        {Array.from({ length: customer.loyaltyPips }, (_, i) => (
          <div
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--color-loyalty-pip)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>

      {/* Token circle */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: tokenColor,
          border: customer.stage === 'unaware' ? '1px solid #aaa' : '2px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 9,
          color: customer.stage === 'unaware' || customer.stage === 'aware' ? '#333' : '#fff',
          fontWeight: 700,
          position: 'relative',
        }}
        title={`${customer.stage}${customer.ownerId ? ` (owned)` : ''}`}
      >
        {customer.stage === 'adopter' && 'A'}
        {customer.stage === 'loyal' && 'L'}
      </div>

      {/* Owner square below token */}
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 2,
          background: ownerColor ?? 'transparent',
          border: ownerColor ? 'none' : '1px solid transparent',
        }}
      />
    </div>
  );
}
