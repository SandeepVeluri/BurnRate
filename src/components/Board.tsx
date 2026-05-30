
import type { Territory as TerritoryType, Player } from '../game/types';
import { Territory } from './Territory';

interface Props {
  territories: TerritoryType[];
  players: Player[];
  highlightedTerritories?: string[];
  onTerritoryClick?: (id: string) => void;
}

export function Board({ territories, players, highlightedTerritories, onTerritoryClick }: Props) {
  const playerColors = Object.fromEntries(players.map(p => [p.id, p.color]));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        padding: 16,
      }}
    >
      {territories.map((t) => (
        <Territory
          key={t.id}
          territory={t}
          playerColors={playerColors}
          highlighted={highlightedTerritories?.includes(t.id)}
          onClick={onTerritoryClick ? () => onTerritoryClick(t.id) : undefined}
        />
      ))}
    </div>
  );
}
