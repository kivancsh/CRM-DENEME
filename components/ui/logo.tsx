import { cn } from "@/lib/utils";
import appConfig from "@/app.config";

/**
 * Wholesale brand mark — a bespoke inline-SVG logomark (a stacked-boxes / order
 * grid: a 2×2 carton grid with one box lifting off the stack, in an
 * indigo gradient) + the wordmark. No external image. The setup can swap
 * `appConfig.name` for the wordmark; drop a real file at public/logo.svg if you
 * have one.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8 shrink-0", className)}
      aria-hidden
      fill="none"
    >
      <defs>
        <linearGradient id="wh-mark" x1="4" y1="3" x2="28" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="oklch(60% 0.16 262)" />
          <stop offset="1" stopColor="oklch(50% 0.17 285)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#wh-mark)" />
      {/* order grid — three settled cartons */}
      <rect x="7" y="16.5" width="7" height="7" rx="1.6" fill="#fff" fillOpacity="0.35" />
      <rect x="15.5" y="16.5" width="7" height="7" rx="1.6" fill="#fff" fillOpacity="0.55" />
      <rect x="7" y="8" width="7" height="7" rx="1.6" fill="#fff" fillOpacity="0.55" />
      {/* the lifting / reordered carton + arrow notch */}
      <rect x="15.5" y="6.4" width="8.4" height="8.4" rx="1.8" fill="#fff" />
      <path
        d="M19.7 8.8 V12.4 M18 10.6 L19.7 8.8 L21.4 10.6"
        stroke="url(#wh-mark)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  withWordmark = true,
  withChevron = false,
  onDark = false,
}: {
  className?: string;
  withWordmark?: boolean;
  /** Render a small chevron after the wordmark (matches the sidebar header). */
  withChevron?: boolean;
  /** Use light wordmark on a dark surface (e.g. the auth brand panel). */
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shadow-pill" />
      {withWordmark && (
        <span className="inline-flex items-center gap-1.5">
          <span
            className={cn(
              "font-display text-[17px] font-bold tracking-[-0.02em]",
              onDark ? "text-white" : "text-foreground",
            )}
          >
            {appConfig.name}
          </span>
          {withChevron && (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-muted-foreground" aria-hidden>
              <path d="M5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          )}
        </span>
      )}
    </span>
  );
}
