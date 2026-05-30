
import type { Territory as TerritoryType, PlayerColor } from '../game/types';
import { AdoptionTrack } from './AdoptionTrack';
import { CustomerSlot } from './CustomerSlot';
import { FlagRow } from './FlagRow';
import { SubsidyZone } from './SubsidyZone';

interface Props {
  territory: TerritoryType;
  playerColors: Record<string, PlayerColor>;
  highlighted?: boolean;
  onClick?: () => void;
}

export function Territory({ territory, playerColors, highlighted, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--color-territory-bg)',
        border: highlighted
          ? '2px solid #ffd232'
          : '1px solid var(--color-territory-border)',
        borderRadius: 8,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.15s',
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div>
        <div style={{
          fontWeight: 700,
          fontSize: 13,
          color: 'var(--color-text-primary)',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
          {territory.name}
        </div>
        <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 1 }}>
          {territory.vertical}
        </div>
      </div>

      {/* Adoption track */}
      <div>
        <div style={{ fontSize: 9, color: 'var(--color-text-secondary)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Adoption
        </div>
        <AdoptionTrack filled={territory.adoptionFilled} saturated={territory.saturated} />
      </div>

      {/* Customer slots */}
      <div>
        <div style={{ fontSize: 9, color: 'var(--color-text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Customers
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {territory.customers.map((c) => (
            <CustomerSlot key={c.id} customer={c} playerColors={playerColors} />
          ))}
        </div>
      </div>

      {/* Flag row */}
      <div>
        <div style={{ fontSize: 9, color: 'var(--color-text-secondary)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Operators
        </div>
        <FlagRow flags={territory.flags} playerColors={playerColors} />
      </div>

      {/* Subsidy zone */}
      <SubsidyZone subsidyZone={territory.subsidyZone} />
    </div>
  );
}
