

interface Props {
  subsidyZone: Record<string, number>;
}

export function SubsidyZone({ subsidyZone }: Props) {
  const total = Object.values(subsidyZone).reduce((s, v) => s + v, 0);
  const hasSubsidy = total > 0;

  return (
    <div
      style={{
        background: hasSubsidy ? 'rgba(255,210,50,0.12)' : 'rgba(255,255,255,0.03)',
        border: hasSubsidy ? '1px solid rgba(255,210,50,0.35)' : '1px dashed rgba(255,255,255,0.1)',
        borderRadius: 4,
        padding: '3px 6px',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        minHeight: 20,
      }}
      title="Subsidy zone — cash placed this round"
    >
      <span style={{ fontSize: 10, color: hasSubsidy ? '#ffd232' : 'var(--color-text-secondary)' }}>
        {hasSubsidy ? `$${total} subsidized` : 'No subsidy'}
      </span>
    </div>
  );
}
