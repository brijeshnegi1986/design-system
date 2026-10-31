/** ChannelToggle: one channel in a "Post to" row, as a big logo you switch on
 * and off; its account shows on hover and focus. */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { ChannelConnect, ChannelToggle } from "../src/index.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.useRealTimers();
});

const onChange = vi.fn();

function mount(props: Partial<Parameters<typeof ChannelToggle>[0]> = {}) {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  act(() =>
    root.render(
      <ChannelToggle
        icon={<span data-logo />}
        label="Facebook, Negiflow (Page)"
        detail="Facebook · Negiflow (Page)"
        selected={false}
        onChange={onChange}
        {...props}
      />,
    ),
  );
  return host.querySelector<HTMLButtonElement>("button")!;
}

describe("ChannelToggle", () => {
  it("is a 44px toggle named by its channel and account, pressed when selected", () => {
    const button = mount();
    expect(button.getAttribute("aria-label")).toBe("Facebook, Negiflow (Page)");
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(button.className.split(" ")).toContain("size-11");
    expect(button.querySelector("[data-logo]")).not.toBeNull();
    act(() => button.click());
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("shows a tick when selected, not colour alone", () => {
    const button = mount({ selected: true });
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.querySelector("[data-part='tick']")).not.toBeNull();
    // A thin edge, not a thick ring (2026-10-31).
    expect(button.className).not.toContain("ring-2");
    expect(button.className.split(" ")).toContain("border-[1.5px]");
    act(() => button.click());
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("counts two or more accounts on the channel", () => {
    expect(mount({ count: 1 }).querySelector("[data-part='count']")).toBeNull();
    act(() => root.unmount());
    host.remove();
    expect(mount({ count: 2 }).querySelector("[data-part='count']")!.textContent).toBe("2");
  });

  it("marks what the channel needs with a dot, and says it in its name", () => {
    const button = mount({ flag: "needs an image" });
    expect(button.querySelector("[data-part='flag']")).not.toBeNull();
    expect(button.getAttribute("aria-label")).toBe("Facebook, Negiflow (Page), needs an image");
  });

  it("shows the account on keyboard focus", () => {
    vi.useFakeTimers();
    const button = mount();
    vi.spyOn(button, "matches").mockImplementation((selector) => selector === ":focus-visible");
    act(() => button.focus());
    act(() => void vi.advanceTimersByTime(0));
    expect(host.querySelector('[role="tooltip"]')!.textContent).toBe("Facebook · Negiflow (Page)");
  });

  it("comes in a 36px size for toolbars, next to compact menus", () => {
    const button = mount({ size: "sm" });
    expect(button.className.split(" ")).toContain("size-9");
    expect(button.className.split(" ")).not.toContain("size-11");
  });

  it("can't be switched while disabled", () => {
    onChange.mockReset();
    const button = mount({ disabled: true });
    act(() => button.click());
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("ChannelConnect", () => {
  it("is a channel not connected yet: a faded 44px logo with a +, named for what it does", () => {
    const onClick = vi.fn();
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    act(() => root.render(<ChannelConnect icon={<span data-logo />} label="Connect Threads" onClick={onClick} />));
    const button = host.querySelector<HTMLButtonElement>("button")!;
    expect(button.getAttribute("aria-label")).toBe("Connect Threads");
    // It looks off, but it isn't disabled: it starts connecting.
    expect(button.disabled).toBe(false);
    expect(button.hasAttribute("aria-pressed")).toBe(false);
    expect(button.className.split(" ")).toEqual(expect.arrayContaining(["size-11", "border-dashed"]));
    // The brand's own colours, just faded: never greyed out (2026-10-31).
    const logo = button.querySelector("[data-part='logo']")!.className.split(" ");
    expect(logo).not.toContain("grayscale");
    expect(logo).toContain("opacity-50");
    expect(button.querySelector("[data-part='plus']")).not.toBeNull();
    act(() => button.click());
    expect(onClick).toHaveBeenCalled();
  });
});

