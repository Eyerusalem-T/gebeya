export default function LineChart({ points, label }) {
  const real = points.filter((p) => p.value != null);
  if (real.length < 2) return <p className="empty">Not enough weekly data for a trend yet.</p>;
  const W = 640, H = 230, P = 38;
  const vals = real.map((p) => p.value);
  const min = Math.min(...vals), span = Math.max(...vals) - min || 1;
  const x = (i) => P + (i * (W - 2 * P)) / (points.length - 1);
  const y = (v) => H - P - ((v - min) / span) * (H - 2 * P);
  const line = points.map((p, i) => (p.value == null ? null : `${x(i)},${y(p.value)}`)).filter(Boolean).join(' ');
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <polyline points={line} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          {p.value != null && <circle cx={x(i)} cy={y(p.value)} r="5" fill="var(--accent)" />}
          {p.value != null && <text x={x(i)} y={y(p.value) - 11} textAnchor="middle" fontSize="12" fill="currentColor">{Math.round(p.value)}</text>}
          <text x={x(i)} y={H - 10} textAnchor="middle" fontSize="12" fill="var(--mut)">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}
