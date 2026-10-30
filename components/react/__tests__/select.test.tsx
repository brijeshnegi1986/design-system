/**
 * The NDS dropdown (ui/select.tsx): a select-only combobox with a listbox,
 * chosen by mouse or keyboard, showing the chosen option's tick.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Select, type SelectOption } from "../src/index.js";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
const onChange = vi.fn();

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  onChange.mockReset();
});

const OPTIONS: SelectOption[] = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long", disabled: true },
  { value: "thread", label: "Thread" },
];

function Harness({ initial = "", size }: { initial?: string; size?: "inline" | "md" }) {
  const [value, setValue] = useState(initial);
  return (
    <Select
      size={size}
      aria-label="Post length"
      value={value}
      onChange={(next) => {
        onChange(next);
        setValue(next);
      }}
      options={OPTIONS}
      placeholder="Pick a length"
    />
  );
}

function render(initial?: string, size?: "inline" | "md") {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<Harness initial={initial} size={size} />));
}

const trigger = () => container.querySelector<HTMLButtonElement>('[role="combobox"]')!;
const options = () => [...container.querySelectorAll<HTMLElement>('[role="option"]')];
const key = (k: string) =>
  act(() => trigger().dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true })));

describe("Select", () => {
  it("draws its edge in the input border token (audit C2)", () => {
    render();
    expect(trigger().className).toContain("border-(--color-border-input)");
    expect(trigger().className).not.toContain("border-(--color-border-subtle)");
  });

  it("is a combobox showing its placeholder until something is chosen", () => {
    render();
    expect(trigger().getAttribute("aria-haspopup")).toBe("listbox");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(trigger().getAttribute("aria-label")).toBe("Post length");
    expect(trigger().textContent).toContain("Pick a length");
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("opens a listbox and chooses with a click, ticking the chosen option", () => {
    render("short");
    act(() => trigger().click());
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(options().map((o) => o.textContent)).toEqual(["Short", "Medium", "Long", "Thread"]);
    expect(options()[0].getAttribute("aria-selected")).toBe("true");

    act(() => options()[1].click());
    expect(onChange).toHaveBeenCalledWith("medium");
    expect(container.querySelector('[role="listbox"]')).toBeNull();
    expect(trigger().textContent).toContain("Medium");
  });

  it("never chooses a disabled option", () => {
    render("short");
    act(() => trigger().click());
    expect(options()[2].getAttribute("aria-disabled")).toBe("true");
    act(() => options()[2].click());
    expect(onChange).not.toHaveBeenCalled();
  });

  it("works from the keyboard, skipping disabled options", () => {
    render("medium");
    key("ArrowDown");
    expect(trigger().getAttribute("aria-activedescendant")).toMatch(/-1$/);
    key("ArrowDown"); // past "Long", which is disabled
    expect(trigger().getAttribute("aria-activedescendant")).toMatch(/-3$/);
    key("Enter");
    expect(onChange).toHaveBeenCalledWith("thread");

    key("ArrowDown");
    key("Escape");
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("jumps to an option by typing its first letters", () => {
    render("short");
    key("t");
    key("Enter");
    expect(onChange).toHaveBeenCalledWith("thread");
  });

  it("closes when someone clicks elsewhere", () => {
    render();
    act(() => trigger().click());
    act(() => document.body.dispatchEvent(new Event("pointerdown", { bubbles: true })));
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });
});

describe("Select: item states (NDS Dropdown Item, 637:1480)", () => {
  const HOVER = "bg-(--color-action-tertiary-hover)";
  const classesOf = (el: HTMLElement) => el.className.split(" ");

  it("greys the row under the pointer, not orange", () => {
    render("short", "inline");
    act(() => trigger().click());
    act(() => options()[1].dispatchEvent(new MouseEvent("mouseover", { bubbles: true })));
    expect(classesOf(options()[1])).toContain(HOVER);
    expect(options()[1].className).not.toContain("status-warning-subtle");
  });

  it("leaves the chosen row white with its tick when the menu opens", () => {
    render("short", "inline");
    act(() => trigger().click());
    expect(classesOf(options()[0])).toContain("bg-(--color-surface-default)");
    expect(classesOf(options()[0])).not.toContain(HOVER);
    expect(options()[0].querySelector('[aria-hidden]')).not.toBeNull();
  });

  it("still shows the keyboard position once someone moves", () => {
    render("medium", "inline");
    key("ArrowDown");
    key("ArrowDown");
    expect(classesOf(options()[3])).toContain(HOVER);
    key("ArrowUp");
    expect(classesOf(options()[1])).toContain(HOVER);
  });

  it("uses regular weight text at the default size too", () => {
    render("short");
    act(() => trigger().click());
    expect(classesOf(options()[1])).toEqual(expect.arrayContaining(["text-sm", "font-normal"]));
    expect(classesOf(options()[1])).not.toContain("font-medium");
  });
});

describe("Select: inline", () => {
  it("opens the NDS Dropdown SM menu: 34px rows of 12px regular text, with the pointer", () => {
    render("short", "inline");
    act(() => trigger().click());
    const classes = options()[1].className.split(" ");
    expect(classes).toEqual(expect.arrayContaining(["h-[34px]", "px-3", "py-1", "text-xs", "font-normal"]));
    expect(classes).not.toContain("p-3");
    expect(container.querySelector('[role="listbox"]')!.className.split(" ")).toEqual(expect.arrayContaining(["py-2", "w-[163px]"]));
    expect(container.querySelector("[data-dropdown-nob]")).not.toBeNull();
  });

  it("keeps the large menu for the default size, with no pointer", () => {
    render("short");
    act(() => trigger().click());
    expect(options()[1].className.split(" ")).toContain("p-3");
    expect(container.querySelector("[data-dropdown-nob]")).toBeNull();
  });
});

describe("Select with icons and a separator (a view menu)", () => {
  const VIEWS: SelectOption[] = [
    { value: "day", label: "Day", icon: <svg data-icon="day" /> },
    { value: "week", label: "Week", icon: <svg data-icon="week" /> },
    { value: "list", label: "List", icon: <svg data-icon="list" />, separatorBefore: true },
  ];

  function renderViews(initial = "week") {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    function Views() {
      const [value, setValue] = useState(initial);
      return <Select size="sm" aria-label="View" value={value} onChange={(v) => { onChange(v); setValue(v); }} options={VIEWS} />;
    }
    act(() => root.render(<Views />));
  }

  it("shows the chosen option's icon with its name on the button", () => {
    renderViews();
    expect(trigger().querySelector('[data-icon="week"]')).not.toBeNull();
    expect(trigger().textContent).toContain("Week");
  });

  it("puts each option's icon beside its name, and a line above the one after the separator", () => {
    renderViews();
    act(() => trigger().click());
    expect(options().map((o) => o.textContent?.trim())).toEqual(["Day", "Week", "List"]);
    expect(options()[0].querySelector('[data-icon="day"]')!.closest("[aria-hidden]")).not.toBeNull();
    expect(options()[2].getAttribute("data-separator")).toBe("true");
    expect(options()[1].hasAttribute("data-separator")).toBe(false);
  });

  it("still moves through every option with the arrow keys, across the separator", () => {
    renderViews("week");
    key("ArrowDown");
    key("ArrowDown");
    key("Enter");
    expect(onChange).toHaveBeenLastCalledWith("list");
  });
});
