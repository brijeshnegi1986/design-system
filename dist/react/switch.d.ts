/**
 * An on/off toggle for settings that take effect as a whole (e.g. "Publish
 * automatically") - reads better than a checkbox for a feature
 * switch. A real <button role="switch">, so it's keyboard- and
 * screen-reader-operable; `label` names it for assistive tech when the
 * visible label lives elsewhere.
 */
export declare function Switch({ checked, onChange, label, disabled, }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    disabled?: boolean;
}): import("react").JSX.Element;
