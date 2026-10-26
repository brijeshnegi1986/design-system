/** Banner (Figma 868:1842): system, error (with or without a link) and
 * announcement strips, 14/20 medium text beside a 20px icon. */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Banner } from "../src/index.js";

function banner(node: React.ReactElement): HTMLElement {
  const html = renderToStaticMarkup(node);
  return new DOMParser().parseFromString(html, "text/html").body.firstElementChild as HTMLElement;
}

describe("Banner", () => {
  it("draws the system banner in amber with dark text in both modes and a warning icon", () => {
    const el = banner(<Banner>Scheduled maintenance tonight.</Banner>);
    expect(el.getAttribute("role")).toBe("status");
    expect(el.className.split(" ")).toEqual(
      expect.arrayContaining(["bg-(--amber-400)", "text-(--color-content-on-accent)", "border", "rounded-(--radius-md)"]),
    );
    expect(el.querySelector('[data-part="icon"]')!.getAttribute("data-icon")).toBe("warning-filled");
    expect(el.textContent).toBe("Scheduled maintenance tonight.");
  });

  it("announces an error at once, and underlines a link in the text colour", () => {
    const el = banner(
      <Banner variant="error">
        Your payment failed. <a href="/settings/billing">Update your card</a>
      </Banner>,
    );
    expect(el.getAttribute("role")).toBe("alert");
    expect(el.className).toContain("bg-(--color-status-error)");
    expect(el.className).toContain("text-(--color-status-error-subtle)");
    expect(el.className).toContain("[&_a]:underline");
    expect(el.querySelector('[data-part="icon"]')!.getAttribute("data-icon")).toBe("error-filled");
  });

  it("uses the inverse surface and the two-colour AI bulb for announcements", () => {
    const el = banner(<Banner variant="announcement">Posts can now include images.</Banner>);
    expect(el.className).toContain("bg-(--color-surface-inverse)");
    expect(el.className).toContain("text-(--color-content-inverse)");
    const icon = el.querySelector('[data-part="icon"]')!;
    expect(icon.getAttribute("data-icon")).toBe("bul-ai");
    expect(icon.querySelector("svg")).not.toBeNull();
  });

  it("can stay silent for a banner that's there when the page loads", () => {
    expect(banner(<Banner variant="error" role={null}>Down for maintenance.</Banner>).hasAttribute("role")).toBe(false);
  });
});
