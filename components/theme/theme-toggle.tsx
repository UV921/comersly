"use client";

import { cn } from "@/lib/cn";
import { useTheme, type Theme } from "./theme-provider";

const OPTIONS: Array<{ value: Theme; label: string }> = [
  { value: "light", label: "Nature" },
  { value: "dark", label: "Dark" },
];

export function ThemeToggle({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface p-0.5",
        compact ? "text-[11px]" : "text-xs",
      )}
      role="radiogroup"
      aria-label="Color theme"
    >
      {OPTIONS.map((option) => {
        const selected = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(option.value)}
            className={cn(
              "rounded-full px-2.5 py-1 font-medium transition-colors",
              selected
                ? "bg-ink text-ink-fg"
                : "text-muted hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
