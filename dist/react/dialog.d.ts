/**
 * A modal dialog for a step that has to interrupt the page (a destructive
 * action, say); an inline panel is usually enough. Escape or a click on the
 * backdrop closes it, and so does the close Icon Button.
 */
export declare function Dialog({ open, onClose, title, children, }: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}): import("react").JSX.Element | null;
