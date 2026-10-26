import type { ReactNode } from "react";
export type BannerVariant = "system" | "error" | "announcement";
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
export declare function Banner({ variant, icon, role, className, children, ...rest }: {
    variant?: BannerVariant;
    /** Replaces the variant's icon. */
    icon?: ReactNode;
    role?: "alert" | "status" | null;
    className?: string;
    children: ReactNode;
    "data-testid"?: string;
}): import("react").JSX.Element;
