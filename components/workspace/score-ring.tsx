export function ScoreRing({
  value,
  max = 100,
  color = "var(--accent)",
  label,
}: {
  value: number;
  max?: number;
  color?: string;
  label?: string;
}) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const fraction = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;
  const dash = circumference * fraction;

  return (
    <svg viewBox="0 0 72 72" className="h-16 w-16 shrink-0" aria-hidden>
      <circle
        cx="36"
        cy="36"
        r={radius}
        fill="none"
        stroke="var(--border)"
        strokeWidth="7"
      />
      <circle
        cx="36"
        cy="36"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        transform="rotate(-90 36 36)"
      />
      <text
        x="36"
        y={label ? 34 : 40}
        textAnchor="middle"
        className="fill-foreground"
        fontSize="11"
        fontWeight="700"
      >
        {Math.round(value)}
      </text>
      {label ? (
        <text
          x="36"
          y="46"
          textAnchor="middle"
          className="fill-muted"
          fontSize="7"
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
}
