import { ReactNode } from "react";
export declare function Field({ label, required, hint, error, counter, children, }: {
    label: string;
    required?: boolean;
    hint?: string;
    error?: string | null;
    /** e.g. "12/100", shown under the control on the right. */
    counter?: string;
    /** Receives the ids the control must use. */
    children: (ids: {
        inputId: string;
        describedBy: string | undefined;
        invalid: boolean;
    }) => ReactNode;
}): import("react").JSX.Element;
export declare function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>): import("react").JSX.Element;
/** The NDS field look for a raw input, textarea or select that can't use
 * TextInput/TextArea: white fill, the input border, 16px text, an 8px corner
 * (single-line inputs and selects become pills in globals.css), border-focus
 * on hover and as the focus ring, and the error and disabled states. */
export declare const FIELD_CONTROL_CLASS = "w-full border border-(--color-border-input) bg-(--color-surface-default) px-3 text-base text-(--color-content-primary) placeholder:text-(--color-content-muted) rounded-md py-3 transition-colors hover:border-(--color-border-focus) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus) aria-[invalid=true]:border-(--color-border-error) disabled:border-(--color-border-disabled) disabled:bg-(--color-action-disabled) disabled:text-(--color-content-disabled)";
export declare function TextArea(props: React.ComponentProps<"textarea">): import("react").JSX.Element;
/** A pill that toggles (aria-pressed), or one option of a single-choice
 * group (role="radio" inside a radiogroup). */
/** The NDS chip (Figma "Chip", 641:1505): a pill on action-secondary with a
 * border-subtle edge; hover action-secondary-hover; selected is
 * action-secondary-pressed with the orange tick before the label. SM 30px
 * (8px in, caption 12/16), MD 36px and LG 44px (12px in, 14/20); a
 * one-letter option is never narrower than it is tall. A toggle
 * (aria-pressed), or one option of a single-choice group (role="radio"
 * inside a radiogroup). */
export declare function Chip({ selected, onClick, children, role, size, }: {
    selected: boolean;
    onClick: () => void;
    children: ReactNode;
    role?: "radio";
    size?: "sm" | "md" | "lg";
}): import("react").JSX.Element;
export declare function ActionButton({ children, disabled, type, onClick, }: {
    children: ReactNode;
    disabled?: boolean;
    type?: "submit" | "button";
    onClick?: () => void;
}): import("react").JSX.Element;
export declare const TERTIARY_BUTTON_CLASS: string;
