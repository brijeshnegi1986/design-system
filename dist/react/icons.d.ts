/**
 * The NDS icons the components draw, as data URIs (no files to host): each
 * is used as a CSS mask, so it takes the current text colour. Generated from
 * the Figma NDS icon exports; regenerate rather than edit by hand.
 */
export type IconName = "close" | "check" | "chevron-forward" | "dropdown-nob" | "keyboard-arrow-down" | "progress-activity" | "info" | "info-filled" | "check-circle-filled" | "warning-filled" | "error-filled" | "search" | "add-photo" | "cloud-upload" | "attach-file" | "delete";
/** `url("data:image/svg+xml,…")` for an NDS icon, for mask-image. */
export declare function iconUrl(name: IconName): string;
/** The style that draws an NDS icon as a mask in the current text colour. */
export declare function iconMask(name: IconName): {
    mask: string;
    WebkitMask: string;
};
