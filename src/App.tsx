
import { useStore } from './game/store';
import { PlayerSetup } from './components/PlayerSetup';
import { Board } from './components/Board';
import { RoundTracker } from './components/RoundTracker';
import { PaletteLegend } from './components/ui/PaletteLegend';
import type { PlayerColor } from './game/types';

function App() {
  const { screen, game, initGame } = useStore();

  if (screen === 'setup' || !game) {
    return (
      <>
        <PlayerSetup onStart={(players: Array<{ name: string; color: PlayerColor }>) => initGame(players)} />
        <PaletteLegend />
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-board-bg)', display: 'flex', flexDirection: 'column' }}>
      <RoundTracker round={game.round} phase={game.phase} />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <Board
          territories={game.territories}
          players={game.players}
        />
      </div>

      {/* Players status bar */}
      <div
        style={{
          padding: '10px 250px 10px 20px',
          background: 'var(--color-territory-bg)',
          borderTop: '1px solid var(--color-territory-border)',
          display: 'flex',
          gap: 20,
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
              padding: '6px 12px',
              borderRadius: 6,
              border: `2px solid var(--color-player-${p.color})`,
              background: game.players[game.currentPlayerIndex].id === p.id
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

export default App
