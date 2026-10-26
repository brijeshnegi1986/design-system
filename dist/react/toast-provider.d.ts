import { type LinkComponent } from "./breadcrumbs.js";
/** "danger" and "muted" are the older names for error and neutral. */
type ToastTone = "success" | "danger" | "warning" | "info" | "muted";
/** A link after the message, to where the outcome can be seen. */
type ToastAction = {
    label: string;
    href: string;
};
/** persist: stays until closed, for something the person needs to read
 * (a failure and its reason), rather than disappearing on a timer. */
type ToastOptions = {
    persist?: boolean;
};
type ToastContextValue = {
    showToast: (message: string, tone?: ToastTone, action?: ToastAction, options?: ToastOptions) => void;
};
/**
 * Toasts: mount ToastProvider once near the root and call
 * useToast().showToast(...) from any client component.
 * Auto-dismisses after 4s (6s with a link, to leave time to use it). A
 * toast shown with { persist: true } instead stays until its close button
 * is used, and a persistent failure is announced as an alert.
 */
export declare function ToastProvider({ children, linkAs: LinkAs, }: {
    children: React.ReactNode;
    /** The app's router link for a toast's action (default: a plain <a>). */
    linkAs?: LinkComponent;
}): import("react").JSX.Element;
export declare function useToast(): ToastContextValue;
export {};
