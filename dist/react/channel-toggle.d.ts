import type { ReactNode } from "react";
/**
 * One channel in a "Post to" row: the channel's logo as a 44px round toggle,
 * so a row of five or six channels stays tidy. Its account (`detail`) shows in
 * the NDS tooltip on hover and keyboard focus; the page should also name the
 * chosen accounts in a line under the row, since a phone can't hover.
 *
 * - Selected: a success ring and a tick at the top right (not colour alone);
 *   unselected, the logo is dimmed.
 * - `count` of 2 or more: a small count at the bottom right (two Pages).
 * - `flag` ("needs an image"): a warning dot at the bottom left, and the
 *   words in the button's name.
 *
 * `label` is the button's accessible name ("Facebook, Negiflow (Page)"); the
 * tooltip is hidden from screen readers, so the name carries the account.
 */
export declare function ChannelToggle({ icon, label, detail, selected, onChange, count, flag, disabled, }: {
    /** The channel's logo, about 22px. */
    icon: ReactNode;
    label: string;
    /** What the tooltip says: the channel and its account(s). */
    detail: string;
    selected: boolean;
    onChange: (selected: boolean) => void;
    count?: number;
    flag?: string;
    disabled?: boolean;
}): import("react").JSX.Element;
