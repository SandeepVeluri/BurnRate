import { useState } from 'react';

interface Swatch {
  label: string;
  cssVar?: string;
  hex?: string;
  textClass?: string;
  borderStyle?: string;
  fillStyle?: string;
  shape?: 'circle' | 'square' | 'diamond';
}

interface Group {
  title: string;
  items: Swatch[];
}

const groups: Group[] = [
  {
    title: 'Customer Stages',
    items: [
      { label: 'Unaware', cssVar: '--color-stage-unaware' },
      { label: 'Aware',   cssVar: '--color-stage-aware' },
      { label: 'Adopter', cssVar: '--color-stage-adopter' },
      { label: 'Loyal',   cssVar: '--color-stage-loyal' },
    ],
  },
  {
    title: 'Players',
    items: [
      { label: 'Player 1 — Magenta', cssVar: '--color-player-p1' },
      { label: 'Player 2 — Teal',    cssVar: '--color-player-p2' },
      { label: 'Player 3 — Purple',  cssVar: '--color-player-p3' },
      { label: 'Player 4 — Lime',    cssVar: '--color-player-p4' },
    ],
  },
  {
    title: 'Event Categories',
    items: [
      { label: 'Macro Economy',  cssVar: '--color-event-macro' },
      { label: 'Market Shift',   cssVar: '--color-event-market' },
      { label: 'Behavior',       cssVar: '--color-event-behavior' },
      { label: 'Black Swan',     cssVar: '--color-event-swan' },
    ],
  },
  {
    title: 'Pricing Tiers (greyscale)',
    items: [
      { label: 'Free — empty',      cssVar: '--color-tier-free-fill',     borderStyle: '2px dashed #555' },
      { label: 'Discount — 25%',    cssVar: '--color-tier-discount-fill' },
      { label: 'Market — 50%',      cssVar: '--color-tier-market-fill' },
      { label: 'Premium — 75%',     cssVar: '--color-tier-premium-fill' },
    ],
  },
];

export function PaletteLegend() {
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        background: '#0d0d1a',
        border: '1px solid var(--color-territory-border)',
        borderRadius: 8,
        fontFamily: 'monospace',
        fontSize: 11,
        color: 'var(--color-text-primary)',
        width: open ? 220 : 'auto',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          padding: '6px 10px',
          background: '#1a1a2e',
          border: 'none',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'monospace',
          fontSize: 11,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>COLOR KEY</span>
        <span>{open ? '▼' : '▲'}</span>
      </button>

      {open && (
        <div style={{ padding: '8px 10px' }}>
          {groups.map((group) => (
            <div key={group.title} style={{ marginBottom: 10 }}>
              <div style={{ color: 'var(--color-text-secondary)', marginBottom: 4, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                {group.title}
              </div>
              {group.items.map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 3,
                      flexShrink: 0,
                      background: item.cssVar ? `var(${item.cssVar})` : item.hex ?? 'transparent',
                      border: item.borderStyle ?? (item.cssVar === '--color-stage-unaware' ? '1px solid #aaa' : '1px solid transparent'),
                    }}
                  />
                  <span style={{ color: 'var(--color-text-primary)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ marginBottom: 10 }}>
            <div style={{ color: 'var(--color-text-secondary)', marginBottom: 4, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
              Neutral Markers
            </div>
            {[
              { sym: '●', label: 'Loyalty pip (black dot)' },
              { sym: '★', label: 'First Mover token' },
              { sym: '−4', label: 'Dilution token' },
              { sym: '$', label: 'Subsidy marker' },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <div style={{ width: 16, textAlign: 'center', fontSize: 13, flexShrink: 0 }}>{m.sym}</div>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
