import { cn } from "@/lib/cn";

type LandscapeVariant = "meadow" | "dawn" | "grove" | "dusk";

const PALETTES: Record<
  LandscapeVariant,
  {
    sky: [string, string];
    haze: string;
    far: string;
    mid: string;
    near: string;
    tree: string;
    sun: string;
  }
> = {
  meadow: {
    sky: ["#d7e4ef", "#f3ead4"],
    haze: "#e7d9b8",
    far: "#9eb58a",
    mid: "#6f8f62",
    near: "#3e5c3a",
    tree: "#2f4a2d",
    sun: "#f3e0a8",
  },
  dawn: {
    sky: ["#f3d3c4", "#f7ead0"],
    haze: "#f0c9a8",
    far: "#c4b07a",
    mid: "#8fa36c",
    near: "#4e6a45",
    tree: "#3a5236",
    sun: "#f6c48a",
  },
  grove: {
    sky: ["#cfdccf", "#e8ead6"],
    haze: "#c9d4b4",
    far: "#88a07a",
    mid: "#5d7c55",
    near: "#314a32",
    tree: "#243826",
    sun: "#e4ddb4",
  },
  dusk: {
    sky: ["#cbb7a8", "#e6d3b8"],
    haze: "#d2b48c",
    far: "#8c9a70",
    mid: "#5a6e4e",
    near: "#2d3e2c",
    tree: "#1f2c1f",
    sun: "#e8b48a",
  },
};

export function Landscape({
  id,
  variant,
  kenBurns = false,
  className,
}: {
  id: string;
  variant: LandscapeVariant;
  kenBurns?: boolean;
  className?: string;
}) {
  const palette = PALETTES[variant];
  const sky = `${id}-sky`;
  const soft = `${id}-soft`;

  return (
    <div className={cn("overflow-hidden", className)} aria-hidden="true">
      <div className={cn("h-full w-full", kenBurns && "landscape-kenburns")}>
        <svg
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.sky[0]} />
              <stop offset="100%" stopColor={palette.sky[1]} />
            </linearGradient>
            <filter id={soft}>
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
          <rect width="1200" height="800" fill={`url(#${sky})`} />
          <circle
            cx="940"
            cy="170"
            r="90"
            fill={palette.sun}
            opacity="0.85"
            filter={`url(#${soft})`}
          />
          <ellipse
            cx="280"
            cy="260"
            rx="220"
            ry="70"
            fill={palette.haze}
            opacity="0.45"
            filter={`url(#${soft})`}
          />
          <ellipse
            cx="820"
            cy="240"
            rx="260"
            ry="80"
            fill={palette.haze}
            opacity="0.35"
            filter={`url(#${soft})`}
          />
          <path
            d="M0 430 C180 360 310 400 470 390 C650 378 780 320 1200 370 L1200 800 L0 800 Z"
            fill={palette.far}
            opacity="0.85"
          />
          <path
            d="M0 500 C220 430 390 510 560 470 C760 420 940 500 1200 460 L1200 800 L0 800 Z"
            fill={palette.mid}
          />
          <path
            d="M0 610 C160 560 340 640 520 600 C760 545 980 640 1200 580 L1200 800 L0 800 Z"
            fill={palette.near}
          />
          <ellipse cx="180" cy="560" rx="28" ry="70" fill={palette.tree} />
          <ellipse cx="210" cy="530" rx="46" ry="54" fill={palette.tree} />
          <ellipse cx="980" cy="540" rx="32" ry="78" fill={palette.tree} />
          <ellipse cx="1018" cy="510" rx="50" ry="58" fill={palette.tree} />
          <ellipse
            cx="640"
            cy="720"
            rx="420"
            ry="90"
            fill={palette.near}
            opacity="0.45"
            filter={`url(#${soft})`}
          />
        </svg>
      </div>
    </div>
  );
}
