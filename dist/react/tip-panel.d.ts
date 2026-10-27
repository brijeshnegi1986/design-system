import type { ReactNode } from "react";
/**
 * Tips and help beside a task (Connectors' "Before you connect", a Settings
 * page's help column): the tip surface, the brand's aqua (color/surface/tip
 * and color/border/tip), so it reads as guidance rather than one more card
 * to act on. A 16px corner and 24px in, no shadow. A summary or navigation
 * beside the content (not help) is a SidePanel instead. An <aside> named by
 * `label`; `live` announces it when its content changes with what's picked.
 */
export declare function TipPanel({ label, live, className, children, }: {
    label: string;
    live?: boolean;
    className?: string;
    children: ReactNode;
}): import("react").JSX.Element;
