

interface Props {
  filled: number;
  saturated: boolean;
}

export function AdoptionTrack({ filled, saturated }: Props) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          title={`Cell ${i + 1}`}
          style={{
            flex: 1,
            height: 10,
            borderRadius: 2,
            background: i < filled
              ? (saturated ? 'var(--color-stage-loyal)' : 'var(--color-cell-filled)')
              : 'var(--color-cell-empty)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />
      ))}
      {saturated && (
        <span style={{ fontSize: 9, color: 'var(--color-stage-loyal)', marginLeft: 4, fontWeight: 700, whiteSpace: 'nowrap' }}>
          SAT
        </span>
      )}
    </div>
  );
}
