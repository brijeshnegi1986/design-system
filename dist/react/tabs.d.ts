export type TabItem = {
    value: string;
    label: string;
    count?: number;
};
/**
 * The NDS Tabs (Figma "Tab item", 124:1558): a tab list of 44px tabs, 12px
 * across and 8px down, 14/20 medium. The active tab is marked by a 2px
 * orange underline, its label in the primary text colour (orange text would
 * be under 4.5:1 on white). Arrow keys, Home and End move between tabs; only
 * the active tab is in the Tab order. Pass `panelId` for the content each
 * tab shows (give that element role="tabpanel").
 */
export declare function Tabs({ label, items, value, onChange, panelId, className, }: {
    label: string;
    items: TabItem[];
    value: string;
    onChange: (value: string) => void;
    panelId?: string;
    className?: string;
}): import("react").JSX.Element;
