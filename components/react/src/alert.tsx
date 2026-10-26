import type { ReactNode } from "react";
import { iconMask, type IconName } from "./icons.js";

export type AlertTone = "neutral" | "info" | "success" | "warning" | "error";

const TONES: Record<AlertTone, { fill: string; text: string; stripe: string; icon: string }> = {
  neutral: { fill: "bg-(--color-surface-raised)", text: "text-(--color-content-primary)", stripe: "bg-(--color-content-secondary)", icon: "info-filled" },
  info: { fill: "bg-(--color-status-info-subtle)", text: "text-(--color-status-info)", stripe: "bg-(--color-status-info)", icon: "info-filled" },
  success: { fill: "bg-(--color-status-success-subtle)", text: "text-(--color-status-success)", stripe: "bg-(--color-status-success)", icon: "check-circle-filled" },
  warning: { fill: "bg-(--color-status-warning-subtle)", text: "text-(--color-status-warning)", stripe: "bg-(--color-status-warning)", icon: "warning-filled" },
  error: { fill: "bg-(--color-status-error-subtle)", text: "text-(--color-status-error)", stripe: "bg-(--color-status-error)", icon: "error-filled" },
};

/**
 * The NDS Alert (Figma "Alert", 426:540): the status's subtle fill, a 4px
 * stripe in the status colour down the left, a 20px filled status icon (info,
 * check circle, warning, error) beside an optional 14/20 medium title in the
 * status colour, then the 14/20 message in the primary text colour. 8px
 * corners, the sm elevation, 16px across and 12px down. An error is announced
 * at once (role="alert"); the others politely (role="status"); pass role={null}
 * for a step the person is already looking at, like a delete confirmation.
 */
export function Alert({
  tone = "info",
  title,
  icon,
  role,
  className = "",
  children,
  ...rest
}: {
  tone?: AlertTone;
  title?: ReactNode;
  /** Replaces the tone's icon (e.g. the safety notice's shield). */
  icon?: ReactNode;
  role?: "alert" | "status" | null;
  className?: string;
  children?: ReactNode;
  "data-testid"?: string;
}) {
  const t = TONES[tone];
  const liveRole = role === null ? undefined : (role ?? (tone === "error" ? "alert" : "status"));
  const glyph = (
    <span data-part="icon" data-icon={icon ? "custom" : t.icon} aria-hidden className={`mt-0.5 flex size-5 shrink-0 ${t.text}`}>
      {icon ?? (
        <span
          className="size-5 bg-current"
          style={iconMask(t.icon as IconName)}
        />
      )}
    </span>
  );
  return (
    <div
      role={liveRole}
      {...rest}
      className={`relative flex flex-col gap-1 overflow-hidden rounded-(--radius-md) px-4 py-3 text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small) shadow-[0_var(--elevation-sm)_2px_rgb(0_0_0/0.1)] ${t.fill} ${className}`.trim()}
    >
      <span data-part="indicator" aria-hidden className={`absolute inset-y-0 left-0 w-1 ${t.stripe}`} />
      {title ? (
        <>
          <div className="flex items-start gap-1">
            {glyph}
            <p data-part="title" className={`pt-px font-medium ${t.text}`}>
              {title}
            </p>
          </div>
          {children && <div className="text-(--color-content-primary)">{children}</div>}
        </>
      ) : (
        <div className="flex items-start gap-1">
          {glyph}
          <div className="min-w-0 pt-px text-(--color-content-primary)">{children}</div>
        </div>
      )}
    </div>
  );
}
