import { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
/**
 * A real, semantic `<table>` - nothing in the app uses one today (every
 * list is a div-based row stack, see the Phase 1 audit). Built for Phase
 * 4 screens where tabular data (a real grid of comparable rows/columns)
 * fits better than the row-list pattern the app already has - Settings'
 * subject list and a future Research browse view are the likely first
 * users, not a retrofit of the existing content/opportunity lists, which
 * already work well as rows.
 */
export declare function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>): import("react").JSX.Element;
export declare function TableHead(props: HTMLAttributes<HTMLTableSectionElement>): import("react").JSX.Element;
export declare function TableBody(props: HTMLAttributes<HTMLTableSectionElement>): import("react").JSX.Element;
export declare function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>): import("react").JSX.Element;
export declare function TableHeaderCell({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>): import("react").JSX.Element;
export declare function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>): import("react").JSX.Element;
