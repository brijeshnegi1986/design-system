/** NDS Tooltip (Figma page 34): opens after the pointer rests or at once on
 * keyboard focus, stays while hovered, closes on leaving, blur or Escape,
 * never opens for touch, and is hidden from screen readers (the control
 * keeps its own name). */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { IconButton, Tooltip } from "../src/index.js";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.useFakeTimers();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});

function render(placement?: "top" | "bottom" | "left" | "right") {
  act(() =>
    root.render(
      <Tooltip label="Compact cards" placement={placement}>
        <button type="button" aria-label="Compact cards">
          ≡
        </button>
      </Tooltip>,
    ),
  );
  return container.querySelector("span")!;
}

const tip = () => container.querySelector('[role="tooltip"]');

function pointer(el: Element, type: "pointerover" | "pointerout", pointerType = "mouse") {
  // React's onPointerEnter/Leave listen for pointerover/pointerout.
  const event = new Event(type, { bubbles: true });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  act(() => void el.dispatchEvent(event));
}

describe("Tooltip", () => {
  it("opens once the pointer rests, not straight away", () => {
    const wrap = render();
    pointer(wrap, "pointerover");
    expect(tip()).toBeNull();
    act(() => void vi.advanceTimersByTime(400));
    expect(tip()!.textContent).toBe("Compact cards");
  });

  it("never opens for touch", () => {
    const wrap = render();
    pointer(wrap, "pointerover", "touch");
    act(() => void vi.advanceTimersByTime(1000));
    expect(tip()).toBeNull();
  });

  it("closes when the pointer leaves, and on Escape", () => {
    const wrap = render();
    pointer(wrap, "pointerover");
    act(() => void vi.advanceTimersByTime(400));
    act(() => void document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));
    expect(tip()).toBeNull();

    pointer(wrap, "pointerover");
    act(() => void vi.advanceTimersByTime(400));
    pointer(wrap, "pointerout");
    expect(tip()).toBeNull();
  });

  it("opens at once on keyboard focus and closes on blur", () => {
    render();
    const button = container.querySelector("button")!;
    // jsdom doesn't track keyboard focus; say this focus came from the keyboard.
    vi.spyOn(button, "matches").mockImplementation((selector) => selector === ":focus-visible");
    act(() => button.focus());
    act(() => void vi.advanceTimersByTime(0));
    expect(tip()).not.toBeNull();
    act(() => button.blur());
    expect(tip()).toBeNull();
  });

  it("sits inside the trigger's box, so moving onto it keeps it open, and hides from screen readers", () => {
    const wrap = render("right");
    pointer(wrap, "pointerover");
    act(() => void vi.advanceTimersByTime(400));
    expect(wrap.contains(tip())).toBe(true);
    expect(tip()!.getAttribute("aria-hidden")).toBe("true");
    expect(tip()!.className).toContain("left-full");
  });
});

describe("Tooltip and the mouse", () => {
  it("doesn't open when a click focuses the control", () => {
    render();
    const button = container.querySelector("button")!;
    vi.spyOn(button, "matches").mockImplementation(() => false);
    act(() => button.focus());
    act(() => void vi.advanceTimersByTime(0));
    expect(tip()).toBeNull();
  });
});

describe("IconButton's tooltip", () => {
  it("shows its label as the NDS tooltip, not the browser's title", () => {
    act(() =>
      root.render(
        <IconButton label="Next week">
          <span>›</span>
        </IconButton>,
      ),
    );
    const button = container.querySelector("button")!;
    expect(button.hasAttribute("title")).toBe(false);
    pointer(button, "pointerover");
    act(() => void vi.advanceTimersByTime(400));
    expect(tip()!.textContent).toBe("Next week");
  });
});
