import { useState } from 'react';
import { useStore } from './game/store';
import { PlayerSetup } from './components/PlayerSetup';
import { Board } from './components/Board';
import { RoundTracker } from './components/RoundTracker';
import { PaletteLegend } from './components/ui/PaletteLegend';
import { ActionBar } from './components/ActionBar';
import type { PlayerColor } from './game/types';

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

  if (game.phase === 'endgame') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-board-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <h1 style={{ fontFamily: 'monospace', color: 'var(--color-text-primary)', fontSize: 32 }}>Game Over</h1>
        <p style={{ fontFamily: 'monospace', color: 'var(--color-text-secondary)', fontSize: 16 }}>10 rounds complete.</p>
        <button
          onClick={() => useStore.setState({ screen: 'setup', game: null })}
          style={{
            padding: '10px 24px', borderRadius: 8,
            background: 'var(--color-player-p1)', color: '#fff',
            fontFamily: 'monospace', fontSize: 14, fontWeight: 700,
            border: 'none', cursor: 'pointer',
          }}
        >
          New Game
        </button>
      </div>
    );
  }

  const currentPlayer = game.players[game.currentPlayerIndex];

  // Compute valid targets for subsidize targeting mode
  const pricedByCurrentPlayer = game.pricedThisRound[currentPlayer?.id] ?? [];
  const validTargets = game.phase === 'actions' && targeting
    ? game.territories
        .filter(
          (t) =>
            !t.saturated &&
            currentPlayer.cash >= 3 &&
            !pricedByCurrentPlayer.includes(t.id)
        )
        .map((t) => t.id)
    : [];

  function handleSubsidizeClick() {
    setTargeting(true);
  }

  function handleCancelTargeting() {
    setTargeting(false);
  }

  function handleTerritoryClick(id: string) {
    if (targeting && validTargets.includes(id)) {
      subsidize(id);
      setTargeting(false);
    }
  }

  function handleWait() {
    wait();
    setTargeting(false);
  }

  // Last 5 log entries (most recent last)
  const recentLog = game.log.slice(-5);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-board-bg)', display: 'flex', flexDirection: 'column' }}>
      <RoundTracker round={game.round} phase={game.phase} />

      {/* Phase controller banner */}
      {game.phase !== 'actions' && (
        <div
          style={{
            padding: '10px 20px',
            background: 'var(--color-territory-bg)',
            borderBottom: '2px solid var(--color-territory-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {game.phase === 'event' && (
            <>
              <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                No event this round
              </span>
              <button
                onClick={drawEvent}
                style={{
                  padding: '7px 18px', borderRadius: 6, border: 'none',
                  background: 'var(--color-player-p2)', color: '#fff',
                  fontFamily: 'monospace', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Draw Event Card →
              </button>
            </>
          )}

          {game.phase === 'market' && (
            <>
              <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                Market phase — resolve market
              </span>
              <button
                onClick={runMarketPhase}
                style={{
                  padding: '7px 18px', borderRadius: 6, border: 'none',
                  background: 'var(--color-player-p3)', color: '#fff',
                  fontFamily: 'monospace', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Continue →
              </button>
            </>
          )}

          {game.phase === 'revenue' && (
            <>
              <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                Revenue phase (full revenue in step 5)
              </span>
              <button
                onClick={runRevenuePhase}
                style={{
                  padding: '7px 18px', borderRadius: 6, border: 'none',
                  background: 'var(--color-player-p4)', color: '#fff',
                  fontFamily: 'monospace', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Next Round →
              </button>
            </>
          )}
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto' }}>
        <Board
          territories={game.territories}
          players={game.players}
          highlightedTerritories={targeting ? validTargets : []}
          onTerritoryClick={targeting ? handleTerritoryClick : undefined}
        />
      </div>

      {/* Game log */}
      <div
        style={{
          padding: '6px 20px',
          background: 'var(--color-board-bg)',
          borderTop: '1px solid var(--color-territory-border)',
          maxHeight: 100,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {recentLog.length === 0 ? (
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text-secondary)' }}>
            — no events yet —
          </span>
        ) : (
          recentLog.map((entry, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text-secondary)', display: 'flex', gap: 8 }}>
              <span style={{ color: 'var(--color-cell-filled)', minWidth: 60 }}>
                R{entry.round} {entry.phase.slice(0, 3).toUpperCase()}
              </span>
              <span>{entry.message}</span>
            </div>
          ))
        )}
      </div>

      {/* Actions phase: show ActionBar */}
      {game.phase === 'actions' && (
        <ActionBar
          currentPlayer={currentPlayer}
          actionsRemaining={game.actionsRemaining}
          territories={game.territories}
          subsidizedThisRound={game.subsidizedThisRound}
          targeting={targeting}
          validTargets={validTargets}
          onSubsidize={handleSubsidizeClick}
          onWait={handleWait}
          onSelectTerritory={handleTerritoryClick}
          onCancelTargeting={handleCancelTargeting}
        />
      )}

      {/* Players status bar */}
      <div
        style={{
          padding: '10px 20px',
          background: 'var(--color-territory-bg)',
          borderTop: '1px solid var(--color-territory-border)',
          display: 'flex',
          gap: 20,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {game.players.map((p) => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 6,
              border: `2px solid var(--color-player-${p.color})`,
              background: game.players[game.currentPlayerIndex].id === p.id && game.phase === 'actions'
                ? 'rgba(255,255,255,0.06)' : 'transparent',
            }}
          >
            <div style={{
              width: 10, height: 10, borderRadius: 2,
              background: `var(--color-player-${p.color})`,
            }} />
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-text-primary)', fontWeight: 700 }}>
              {p.name}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-text-secondary)' }}>
              ${p.cash}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text-secondary)' }}>
              {p.flagsRemaining}⚑
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text-secondary)' }}>
              {p.firstMoverTokens.length}★
            </span>
          </div>
        ))}

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={() => useStore.setState({ screen: 'setup', game: null })}
            style={{
              padding: '6px 14px',
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
