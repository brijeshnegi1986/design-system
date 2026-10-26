import type { ReactNode } from "react";
import { iconMask, type IconName } from "./icons.js";

export type BannerVariant = "system" | "error" | "announcement";

const VARIANTS: Record<BannerVariant, { classes: string; icon: IconName | null }> = {
  // amber-400 in both modes, so the text is the fixed near-black on-accent.
  system: {
    classes: "border-(--color-border-strong) bg-(--amber-400) text-(--color-content-on-accent)",
    icon: "warning-filled",
  },
  error: {
    classes: "border-(--color-border-error) bg-(--color-status-error) text-(--color-status-error-subtle)",
    icon: "error-filled",
  },
  announcement: {
    classes: "border-(--color-border-subtle) bg-(--color-surface-inverse) text-(--color-content-inverse)",
    icon: null,
  },
};

/** Figma's bul-ai icon: a bulb outlined in the text colour with a sparkle in
 * the brand primary. Two colours, so it's drawn inline rather than as a mask. */
function AnnouncementIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.48214 15.75C6.40051 14.5456 5 12.2943 5 9.71596C5 5.86877 8.11802 2.75 11.9643 2.75C15.8106 2.75 18.9286 5.86877 18.9286 9.71596C18.9286 12.2943 17.5281 14.5456 15.4464 15.75" />
        <path d="M8.30005 15.7V17.55C8.30005 18.4102 8.30005 18.8403 8.3946 19.1932C8.6512 20.1509 9.3992 20.8989 10.3568 21.1555C10.7097 21.25 11.1398 21.25 12 21.25C12.8603 21.25 13.2904 21.25 13.6433 21.1555C14.6009 20.8989 15.3489 20.1509 15.6055 19.1932C15.7 18.8403 15.7 18.4102 15.7 17.55V15.7" />
        <path d="M15.7 15.7L8.29995 15.7" />
        <path d="M15.7 18.475L8.29995 18.475" />
      </g>
      <path
        fill="var(--color-action-primary)"
        d="M12.6728 10.4495L12.2613 11.7037C12.1785 11.956 11.8215 11.956 11.7387 11.7037L11.3272 10.4495C11.2454 10.2002 11.0498 10.0046 10.8005 9.92282L9.54632 9.51129C9.29397 9.42849 9.29397 9.07151 9.54632 8.98871L10.8005 8.57718C11.0498 8.49537 11.2454 8.29983 11.3272 8.05051L11.7387 6.79632C11.8215 6.54397 12.1785 6.54397 12.2613 6.79632L12.6728 8.05051C12.7546 8.29983 12.9502 8.49537 13.1995 8.57718L14.4537 8.98871C14.706 9.07151 14.706 9.42849 14.4537 9.51129L13.1995 9.92282C12.9502 10.0046 12.7546 10.2002 12.6728 10.4495Z"
      />
    </svg>
  );
}

/**
 * The NDS Banner (Figma "Banners", 868:1842): a full-width strip for a
 * message about the whole product or account rather than one section (an
 * outage, a lapsed payment, something new). 8px corners, a 1px edge, 16px
 * across and 8px down, a 20px icon 8px from 14/20 medium text.
 *
 * - system: amber with a warning icon, for a service-level notice.
 * - error: filled red with an error icon (Figma's "Error" and "Error with
 *   link"); a link inside takes the text colour, underlined.
 * - announcement: the inverse surface with the AI bulb, for news.
 *
 * An error is announced at once (role="alert"), the others politely
 * (role="status"); pass role={null} for a banner already on the page when it
 * loads.
 */
export function Banner({
  variant = "system",
  icon,
  role,
  className = "",
  children,
  ...rest
}: {
  variant?: BannerVariant;
  /** Replaces the variant's icon. */
  icon?: ReactNode;
  role?: "alert" | "status" | null;
  className?: string;
  children: ReactNode;
  "data-testid"?: string;
}) {
  const v = VARIANTS[variant];
  const liveRole = role === null ? undefined : (role ?? (variant === "error" ? "alert" : "status"));
  return (
    <div
      role={liveRole}
      {...rest}
      className={`flex w-full items-start gap-2 rounded-(--radius-md) border px-4 py-2 text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small) font-medium ${v.classes} [&_a]:underline [&_a]:underline-offset-2 [&_a]:focus-visible:rounded-sm [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-2 [&_a]:focus-visible:outline-current ${className}`.trim()}
    >
      <span data-part="icon" data-icon={icon ? "custom" : (v.icon ?? "bul-ai")} aria-hidden className="flex size-5 shrink-0">
        {icon ?? (v.icon ? <span className="size-5 bg-current" style={iconMask(v.icon)} /> : <AnnouncementIcon />)}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
