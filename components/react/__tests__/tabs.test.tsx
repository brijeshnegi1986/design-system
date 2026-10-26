/** Tabs (Figma 124:1558): a tab list of 44px tabs, the active one marked by
 * a 2px orange underline; arrow keys move between tabs. */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Tabs } from "../src/index.js";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
});

const ITEMS = [
  { value: "all", label: "All", count: 12 },
  { value: "new", label: "New", count: 3 },
  { value: "done", label: "Done" },
];

function mount(value = "all", onChange = vi.fn()) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<Tabs label="Ideas" items={ITEMS} value={value} onChange={onChange} panelId="ideas-panel" />));
  return onChange;
}

const tabs = () => [...container.querySelectorAll<HTMLButtonElement>('[role="tab"]')];

describe("Tabs (audit M10)", () => {
  it("is a named tab list with the active tab selected and focusable", () => {
    mount("new");
    expect(container.querySelector('[role="tablist"]')!.getAttribute("aria-label")).toBe("Ideas");
    expect(tabs().map((t) => t.getAttribute("aria-selected"))).toEqual(["false", "true", "false"]);
    expect(tabs().map((t) => t.tabIndex)).toEqual([-1, 0, -1]);
    expect(tabs()[1].getAttribute("aria-controls")).toBe("ideas-panel");
    expect(tabs()[1].className).toContain("h-11");
  });

  it("shows a count beside a label", () => {
    mount();
    expect(tabs()[0].textContent).toBe("All12");
  });

  it("picks a tab on click, and moves with the arrow keys", () => {
    const onChange = mount("all");
    act(() => tabs()[2].click());
    expect(onChange).toHaveBeenLastCalledWith("done");
    act(() => tabs()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
    expect(onChange).toHaveBeenLastCalledWith("new");
    act(() => tabs()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })));
    expect(onChange).toHaveBeenLastCalledWith("done");
  });
});
