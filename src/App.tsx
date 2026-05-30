import { useState } from 'react';
import { useStore } from './game/store';
import { PlayerSetup } from './components/PlayerSetup';
import { Board } from './components/Board';
import { RoundTracker } from './components/RoundTracker';
import { ActionBar } from './components/ActionBar';
import { PaletteLegend } from './components/ui/PaletteLegend';
import type { PlayerColor } from './game/types';

const btnStyle = {
  padding: '8px 20px',
  borderRadius: 6,
  border: 'none',
  fontFamily: 'monospace',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  background: 'var(--color-player-p2)',
  color: '#fff',
};

function App() {
  const { screen, game, initGame, drawEvent, subsidize, wait, runMarketPhase, runRevenuePhase } = useStore();
  const [targeting, setTargeting] = useState(false);

  if (screen === 'setup' || !game) {
    return (
      <>
        <PlayerSetup onStart={(players: Array<{ name: string; color: PlayerColor }>) => initGame(players)} />
        <PaletteLegend />
      </>
    );
  }

  const currentPlayer = game.players[game.currentPlayerIndex];

  const validSubsidizeTargets = game.territories
    .filter((t) => {
      if (t.saturated) return false;
      if (currentPlayer.cash < 3) return false;
      const priced = game.pricedThisRound[currentPlayer.id] ?? [];
      if (priced.includes(t.id)) return false;
      return true;
    })
    .map((t) => t.id);

  const handleSubsidizeClick = () => setTargeting(true);
  const handleCancelTargeting = () => setTargeting(false);
  const handleSelectTerritory = (id: string) => {
    subsidize(id);
    setTargeting(false);
  };

  const recentLog = game.log.slice(-5).reverse();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-board-bg)', display: 'flex', flexDirection: 'column' }}>
      <RoundTracker round={game.round} phase={game.phase} />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <Board
          territories={game.territories}
          players={game.players}
          highlightedTerritories={targeting ? validSubsidizeTargets : []}
          onTerritoryClick={targeting ? handleSelectTerritory : undefined}
        />
      </div>

      {recentLog.length > 0 && (
        <div
          style={{
            padding: '6px 20px',
            background: '#0d0d1a',
            borderTop: '1px solid var(--color-territory-border)',
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
          }}
        >
          {recentLog.map((entry, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'monospace',
                fontSize: 10,
                color: i === 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                whiteSpace: 'nowrap',
              }}
            >
              R{entry.round} {entry.phase}: {entry.message}
            </span>
          ))}
        </div>
      )}

      {game.phase === 'event' && (
        <div style={{ padding: '12px 20px', background: 'var(--color-territory-bg)', borderTop: '2px solid var(--color-territory-border)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-text-secondary)' }}>
            Round {game.round} — Event Phase: No event card active
          </span>
          <button style={btnStyle} onClick={drawEvent}>
            Draw Event Card →
          </button>
        </div>
      )}

      {game.phase === 'actions' && (
        <ActionBar
          currentPlayer={currentPlayer}
          actionsRemaining={game.actionsRemaining}
          territories={game.territories}
          subsidizedThisRound={game.subsidizedThisRound}
          targeting={targeting}
          validTargets={validSubsidizeTargets}
          onSubsidize={handleSubsidizeClick}
          onWait={wait}
          onSelectTerritory={handleSelectTerritory}
          onCancelTargeting={handleCancelTargeting}
        />
      )}

      {game.phase === 'market' && (
        <div style={{ padding: '12px 20px', background: 'var(--color-territory-bg)', borderTop: '2px solid var(--color-territory-border)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-text-secondary)' }}>
            Market Phase — resolve subsidies and upgrade customers
          </span>
          <button style={btnStyle} onClick={runMarketPhase}>
            Resolve Market →
          </button>
        </div>
      )}

      {game.phase === 'revenue' && (
        <div style={{ padding: '12px 20px', background: 'var(--color-territory-bg)', borderTop: '2px solid var(--color-territory-border)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-text-secondary)' }}>
            Revenue Phase — (full revenue coming in step 5)
          </span>
          <button style={btnStyle} onClick={runRevenuePhase}>
            {game.round < 10 ? `Next Round (${game.round + 1}) →` : 'End Game →'}
          </button>
        </div>
      )}

      {game.phase === 'endgame' && (
        <div style={{ padding: '12px 20px', background: 'var(--color-territory-bg)', borderTop: '2px solid var(--color-territory-border)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--color-stage-loyal)' }}>
            Game Over! (Scoring screen coming in step 10)
          </span>
          <button style={{ ...btnStyle, background: 'var(--color-player-p1)' }} onClick={() => useStore.setState({ screen: 'setup', game: null })}>
            New Game
          </button>
        </div>
      )}

      <div
        style={{
          padding: '8px 250px 8px 20px',
          background: '#0d0d1a',
          borderTop: '1px solid var(--color-territory-border)',
          display: 'flex',
          gap: 16,
          alignItems: 'center',
        }}
      >
        {game.players.map((p) => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 10px',
              borderRadius: 6,
              border: `2px solid var(--color-player-${p.color})`,
              background: game.players[game.currentPlayerIndex].id === p.id && game.phase === 'actions'
                ? 'rgba(255,255,255,0.06)' : 'transparent',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 2, background: `var(--color-player-${p.color})` }} />
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text-primary)', fontWeight: 700 }}>
              {p.name}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text-secondary)' }}>
              ${p.cash}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--color-text-secondary)' }}>
              {p.flagsRemaining}⚑
            </span>
            {p.firstMoverTokens.length > 0 && (
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#ffd232' }}>
                {p.firstMoverTokens.length}★
              </span>
            )}
          </div>
        ))}

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={() => useStore.setState({ screen: 'setup', game: null })}
            style={{
              padding: '4px 12px',
              borderRadius: 6,
              border: '1px solid var(--color-territory-border)',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              fontFamily: 'monospace',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            ← New Game
          </button>
        </div>
      </div>

      <PaletteLegend />
    </div>
  );
}

export default App;
