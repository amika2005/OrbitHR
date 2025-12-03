interface SparklineProps {
  data?: number[];
  color?: "emerald" | "blue" | "zinc";
  className?: string;
}

export function Sparkline({ 
  data = [20, 35, 25, 45, 30, 50, 40, 60], 
  color = "emerald",
  className = ""
}: SparklineProps) {
  const width = 100;
  const height = 32;
  const padding = 2;

  // Normalize data to fit within height
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const colorMap = {
    emerald: "stroke-emerald-500 dark:stroke-emerald-400",
    blue: "stroke-blue-500 dark:stroke-blue-400",
    zinc: "stroke-zinc-300 dark:stroke-zinc-600"
  };

  return (
    <svg 
      width={width} 
      height={height} 
      className={className}
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className={colorMap[color]}
      />
    </svg>
  );
}
