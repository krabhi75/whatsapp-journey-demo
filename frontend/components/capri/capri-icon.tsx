export function CapriIcon({
  name,
  filled,
  className = '',
  size = 24,
}: {
  name: string;
  filled?: boolean;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? 'filled' : ''} ${className}`}
      style={{ fontSize: size }}
    >
      {name}
    </span>
  );
}
