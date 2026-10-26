/** Card, Stat card and Empty state (Figma 892:128, 893:113, 897:148). */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Card, EmptyState, StatCard } from "../src/index.js";

function el(node: React.ReactElement): HTMLElement {
  return new DOMParser().parseFromString(renderToStaticMarkup(node), "text/html").body.firstElementChild as HTMLElement;
}

describe("Card", () => {
  it("has 24px padding, radius-lg, the subtle edge and the sm elevation", () => {
    const classes = el(<Card>Hi</Card>).className.split(" ");
    expect(classes).toEqual(expect.arrayContaining(["p-6", "rounded-(--radius-lg)", "border-(--color-border-subtle)"]));
    expect(classes.some((c) => c.includes("--elevation-sm"))).toBe(true);
    expect(el(<Card padded={false}>Hi</Card>).className.split(" ")).toContain("px-6");
  });

  it("gets the strong edge on hover when interactive, and the primary edge when selected", () => {
    expect(el(<Card interactive>Hi</Card>).className).toContain("hover:border-(--color-border-strong)");
    expect(el(<Card selected>Hi</Card>).className).toContain("border-(--color-border-primary)");
    expect(el(<Card>Hi</Card>).className).not.toContain("hover:border");
  });
});

describe("StatCard", () => {
  it("puts the label above a large tabular value, with the caption under it", () => {
    const card = el(<StatCard label="Posts published" value="1,248" caption="Last 30 days" />);
    expect(card.querySelector('[data-part="label"]')!.textContent).toBe("Posts published");
    const value = card.querySelector('[data-part="value"]')!;
    expect(value.textContent).toBe("1,248");
    expect(value.className).toContain("tabular-nums");
    expect(value.className).toContain("text-(length:--type-font-size-h2)");
    expect(card.querySelector('[data-part="caption"]')!.textContent).toBe("Last 30 days");
    expect(card.querySelector('[data-part="icon"]')).toBeNull();
  });

  it("shows a trend as a Positive or Negative badge, and says the direction to screen readers", () => {
    const up = el(<StatCard label="Conversions" value={4} trend={{ direction: "up", label: "+12%" }} />);
    expect(up.textContent).toContain("Up +12%");
    expect(up.innerHTML).toContain("status-success");
    const badNews = el(<StatCard label="Failed" value={3} trend={{ direction: "up", label: "+2", good: false }} />);
    expect(badNews.innerHTML).toContain("status-error");
  });
});

describe("EmptyState", () => {
  it("shows the icon tile, title, text and one action inside a dashed strong edge", () => {
    const empty = el(
      <EmptyState title="No posts yet" icon={<span />} action={<button>Create post</button>}>
        Nothing goes out until you approve it.
      </EmptyState>,
    );
    expect(empty.className).toContain("border-dashed");
    expect(empty.className).toContain("border-(--color-border-strong)");
    expect(empty.querySelector('[data-part="icon"]')).not.toBeNull();
    expect(empty.querySelector('[data-part="title"]')!.textContent).toBe("No posts yet");
    expect(empty.querySelector("button")!.textContent).toBe("Create post");
  });
});
