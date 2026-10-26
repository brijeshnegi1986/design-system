/** Dialog (Figma Modal 898:133): named by its title, SM 400 / MD 560, an
 * optional description and footer, a Destructive look, and focus that moves
 * in, stays in and goes back. */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { Dialog } from "../src/index.js";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function dialog(node: React.ReactElement): Document {
  return new DOMParser().parseFromString(renderToStaticMarkup(node), "text/html");
}

let container: HTMLDivElement;
let root: Root;
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
});

describe("Dialog (audit M11, Figma Modal)", () => {
  it("is named by its visible title and closes with a 36px Icon Button carrying the close icon", () => {
    const doc = dialog(
      <Dialog open onClose={() => {}} title="Delete this draft?">
        Gone for good.
      </Dialog>,
    );
    const panel = doc.querySelector('[role="dialog"]')!;
    const titleId = panel.getAttribute("aria-labelledby")!;
    expect(doc.getElementById(titleId)!.textContent).toBe("Delete this draft?");
    const close = doc.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!;
    expect(close.className).toContain("size-9");
    expect(close.className).toContain("focus-visible:outline-(--color-border-focus)");
    expect(close.querySelector('[data-icon="close"]')).not.toBeNull();
  });

  it("is 400px by default and 560px at MD, with radius-xl and the 18/28 title", () => {
    const sm = dialog(<Dialog open onClose={() => {}} title="Sure?" />).querySelector('[role="dialog"]')!;
    const md = dialog(<Dialog open onClose={() => {}} title="Edit" size="md" />).querySelector('[role="dialog"]')!;
    expect(sm.className).toContain("max-w-[400px]");
    expect(md.className).toContain("max-w-[560px]");
    expect(sm.className).toContain("rounded-(--radius-xl)");
    expect(sm.querySelector("h2")!.className).toContain("text-(length:--type-font-size-body-large)");
  });

  it("describes itself with the description, and puts actions in a right-aligned footer", () => {
    const doc = dialog(
      <Dialog open onClose={() => {}} title="Delete this post?" description="You can't undo this." actions={<button>Delete post</button>} />,
    );
    const panel = doc.querySelector('[role="dialog"]')!;
    expect(doc.getElementById(panel.getAttribute("aria-describedby")!)!.textContent).toBe("You can't undo this.");
    const footer = doc.querySelector('[data-part="actions"]')!;
    expect(footer.className).toContain("justify-end");
    expect(footer.textContent).toBe("Delete post");
  });

  it("shows the warning mark when destructive", () => {
    expect(dialog(<Dialog open onClose={() => {}} title="Delete?" tone="destructive" />).querySelector('[data-part="status-icon"]')).not.toBeNull();
    expect(dialog(<Dialog open onClose={() => {}} title="Edit" />).querySelector('[data-part="status-icon"]')).toBeNull();
  });

  it("moves focus in, keeps Tab inside, closes on Escape and gives focus back", () => {
    const onClose = vi.fn();
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button id="opener" onClick={() => setOpen(true)}>Open</button>
          <Dialog
            open={open}
            onClose={() => {
              onClose();
              setOpen(false);
            }}
            title="Rename"
            actions={<button id="save">Save</button>}
          />
        </>
      );
    }
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => root.render(<Host />));
    const opener = container.querySelector<HTMLButtonElement>("#opener")!;
    opener.focus();
    act(() => opener.click());
    expect(document.activeElement?.getAttribute("role")).toBe("dialog");

    const save = container.querySelector<HTMLButtonElement>("#save")!;
    save.focus();
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    });
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Close");

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });
});
