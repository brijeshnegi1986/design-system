/** SidePanel: a summary beside the main content, on the raised grey. */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SidePanel } from "../src/index.js";

const aside = (node: React.ReactElement) =>
  new DOMParser().parseFromString(renderToStaticMarkup(node), "text/html").querySelector("aside")!;

describe("SidePanel", () => {
  it("is an aside on the raised grey, with no edge or shadow", () => {
    const el = aside(<SidePanel label="Your brand">x</SidePanel>);
    expect(el.getAttribute("aria-label")).toBe("Your brand");
    expect(el.className).toContain("bg-(--color-surface-raised)");
    expect(el.className).not.toMatch(/\bborder\b|shadow/);
  });

  it("can be named by its own heading instead", () => {
    const el = aside(
      <SidePanel labelledBy="trial-title">
        <h2 id="trial-title">Your free trial</h2>
      </SidePanel>,
    );
    expect(el.getAttribute("aria-labelledby")).toBe("trial-title");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });
});

describe("SidePanel that can be pushed in and pulled out", () => {
  const handle = (el: Element) => el.querySelector("button[aria-expanded]") as HTMLButtonElement;

  it("pulled out: the content, with a handle that pushes it in", () => {
    const el = aside(
      <SidePanel label="Preview" collapse={{ open: true, onToggle: () => {}, side: "right", controls: "p1" }}>
        <p>Your post</p>
      </SidePanel>,
    );
    expect(el.textContent).toContain("Your post");
    const button = handle(el);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.getAttribute("aria-label")).toBe("Hide Preview");
    expect(button.getAttribute("aria-controls")).toBe("p1");
    expect(button.className).toMatch(/\bsize-10\b/);
  });

  it("pushed in: a slim strip with only the handle and its name", () => {
    const el = aside(
      <SidePanel label="Preview" collapse={{ open: false, onToggle: () => {}, side: "right", controls: "p1" }}>
        <p>Your post</p>
      </SidePanel>,
    );
    expect(el.textContent).not.toContain("Your post");
    const button = handle(el);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("aria-label")).toBe("Show Preview");
    expect(el.className).toContain("xl:w-12");
    expect(el.getAttribute("data-state")).toBe("collapsed");
  });

  it("calls onToggle from the handle", async () => {
    const { createRoot } = await import("react-dom/client");
    const { act } = await import("react");
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    let toggled = 0;
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => root.render(<SidePanel label="Ready to post" collapse={{ open: true, onToggle: () => toggled++, side: "left" }}>x</SidePanel>));
    act(() => handle(host).click());
    expect(toggled).toBe(1);
    act(() => root.unmount());
    host.remove();
  });

  it("without collapse, is the plain panel it always was", () => {
    const el = aside(<SidePanel label="Your brand">x</SidePanel>);
    expect(el.querySelector("button")).toBeNull();
    expect(el.hasAttribute("data-state")).toBe(false);
  });
});
