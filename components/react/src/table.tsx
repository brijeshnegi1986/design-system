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
export function Table({ className = "", ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-(--color-border-subtle) bg-(--color-surface-default)">
      <table className={`w-full border-collapse text-sm ${className}`} {...props} />
    </div>
  );
}

export function TableHead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
}

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export function TableRow({ className = "", ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`border-b border-(--color-border-subtle) last:border-b-0 ${className}`} {...props} />;
}

export function TableHeaderCell({ className = "", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`border-b border-(--color-border-subtle) px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-(--color-content-muted) ${className}`}
      {...props}
    />
  );
}

export function TableCell({ className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-4 py-3 text-(--color-content-primary) ${className}`} {...props} />;
}
