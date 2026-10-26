/**
 * The app's first real modal primitive - every confirmation today
 * (delete a draft, publish, schedule) is done via an inline expanding
 * panel within the page instead (see the Phase 1 audit). Built for Phase
 * 4 to adopt where an inline panel genuinely isn't enough (a destructive
 * action, or a flow that needs to interrupt the whole page) - not a mass
 * retrofit of every existing inline confirmation, which mostly work fine
 * as-is.
 */
export declare function Dialog({ open, onClose, title, children, }: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}): import("react").JSX.Element | null;
