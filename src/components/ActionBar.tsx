import type { CSSProperties } from 'react';
import type { Player, Territory } from '../game/types';

interface Props {
  currentPlayer: Player;
  actionsRemaining: number;
  territories: Territory[];
  subsidizedThisRound: Record<string, string[]>;
  targeting: boolean;
  validTargets: string[];
  onSubsidize: () => void;
  onWait: () => void;
  onSelectTerritory: (id: string) => void;
  onCancelTargeting: () => void;
}

const btnBase: CSSProperties = {
  padding: '8px 18px',
  borderRadius: 6,
  border: '1px solid var(--color-territory-border)',
  fontFamily: 'monospace',
  fontSize: 13,
  cursor: 'pointer',
  fontWeight: 700,
  transition: 'opacity 0.15s',
};

const btnDisabled: CSSProperties = {
  ...btnBase,
  opacity: 0.4,
  cursor: 'not-allowed',
  background: 'var(--color-territory-bg)',
  color: 'var(--color-text-secondary)',
};


const btnNeutral: CSSProperties = {
  ...btnBase,
  background: 'var(--color-territory-bg)',
  color: 'var(--color-text-primary)',
};

export function ActionBar({
  currentPlayer,
  actionsRemaining,
  territories: _territories,
  targeting,
  onSubsidize,
  onWait,
  onCancelTargeting,
}: Props) {
  return (
    <div
      style={{
        padding: '10px 20px',
        background: 'var(--color-territory-bg)',
        borderTop: '2px solid var(--color-territory-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      {/* Current player indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 3,
            background: `var(--color-player-${currentPlayer.color})`,
          }}
        />
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}
        >
          {currentPlayer.name}
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-text-secondary)' }}>
          ${currentPlayer.cash}
        </span>
      </div>

      {/* Actions remaining */}
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          marginRight: 8,
        }}
      >
        {actionsRemaining} action{actionsRemaining !== 1 ? 's' : ''} remaining
      </span>

      {targeting ? (
        <>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#ffd232',
              fontWeight: 700,
            }}
          >
            ↑ Click a highlighted territory to subsidize
          </span>
          <button style={btnNeutral} onClick={onCancelTargeting}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            style={{
              ...btnBase,
              background:
                currentPlayer.cash >= 3
                  ? `var(--color-player-${currentPlayer.color})`
                  : 'var(--color-territory-bg)',
              color: currentPlayer.cash >= 3 ? '#fff' : 'var(--color-text-secondary)',
              opacity: currentPlayer.cash >= 3 ? 1 : 0.4,
              cursor: currentPlayer.cash >= 3 ? 'pointer' : 'not-allowed',
            }}
            onClick={currentPlayer.cash >= 3 ? onSubsidize : undefined}
            title={currentPlayer.cash < 3 ? 'Need $3 to subsidize' : 'Place $3 in a territory subsidy zone'}
          >
            Subsidize ($3)
          </button>

          <button style={btnNeutral} onClick={onWait}>
            Wait (+$2)
          </button>

          <button
            style={btnDisabled}
            disabled
            title="Coming in step 5"
          >
            Raise (Step 5)
          </button>

          <button
            style={btnDisabled}
            disabled
            title="Coming in step 5"
          >
            Price (Step 5)
          </button>
        </>
      )}
    </div>
  );
}
