/**
 * The NDS Radio (Tile, Figma 119:1247) as a labelled group with a line of
 * description per option, and the NDS Checkbox (Basic, Figma 120:1415).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Checkbox, Radio, RadioTiles } from "../src/index.js";

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

function mount(node: React.ReactNode) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(node));
}

const OPTIONS = [
  { value: "a", title: "Me", description: 'Posts say "I".' },
  { value: "b", title: "A business", description: 'Posts say "we".', extra: <p>Extra for b</p> },
];

describe("RadioTiles", () => {
  it("is a named group of radios, each described by its line", () => {
    mount(<RadioTiles legend="Who's speaking?" name="who" value="a" onChange={() => {}} options={OPTIONS} />);
    expect(container.querySelector("fieldset legend")?.textContent).toBe("Who's speaking?");
    const radios = [...container.querySelectorAll<HTMLInputElement>('input[type="radio"]')];
    expect(radios.map((r) => r.closest("label")?.textContent)).toEqual(["Me", "A business"]);
    expect(radios.map((r) => r.name)).toEqual(["who", "who"]);
    expect(radios[0].checked).toBe(true);
    const described = document.getElementById(radios[1].getAttribute("aria-describedby")!);
    expect(described?.textContent).toBe('Posts say "we".');
  });

  it("calls onChange with the value picked, and shows an option's extra only while it's picked", () => {
    const onChange = vi.fn();
    mount(<RadioTiles legend="Who's speaking?" name="who" value="a" onChange={onChange} options={OPTIONS} />);
    expect(container.textContent).not.toContain("Extra for b");
    act(() => container.querySelectorAll<HTMLInputElement>('input[type="radio"]')[1].click());
    expect(onChange).toHaveBeenCalledWith("b");
    act(() => root.render(<RadioTiles legend="Who's speaking?" name="who" value="b" onChange={onChange} options={OPTIONS} />));
    expect(container.textContent).toContain("Extra for b");
  });
});

describe("Checkbox", () => {
  it("is a labelled checkbox with an optional hint, and reports its new state", () => {
    const onChange = vi.fn();
    mount(<Checkbox label="Write as I" hint="For a one-person business." checked={false} onChange={onChange} />);
    const box = container.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    expect(box.closest("label")?.textContent).toBe("Write as I");
    expect(document.getElementById(box.getAttribute("aria-describedby")!)?.textContent).toBe("For a one-person business.");
    act(() => box.click());
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Checkbox states (audit M5)", () => {
  it("can be disabled, and can stand without a visible label", () => {
    mount(<Checkbox aria-label="Select Harbour Lane" checked={false} disabled onChange={() => {}} />);
    const box = container.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    expect(box.disabled).toBe(true);
    expect(box.getAttribute("aria-label")).toBe("Select Harbour Lane");
    expect(box.className).toContain("disabled:bg-(--color-action-disabled)");
  });

  it("shows a part-selected state", () => {
    mount(<Checkbox aria-label="Select all" checked={false} indeterminate onChange={() => {}} />);
    expect(container.querySelector<HTMLInputElement>('input[type="checkbox"]')!.indeterminate).toBe(true);
  });
});

describe("Radio (audit M5)", () => {
  it("is a labelled radio with an optional description, and reports a pick", () => {
    const onChange = vi.fn();
    mount(
      <fieldset>
        <Radio name="where" checked={false} onChange={onChange} label="From NegiFlow only" description="It stays on Facebook." />
      </fieldset>,
    );
    const radio = container.querySelector<HTMLInputElement>('input[type="radio"]')!;
    expect(radio.name).toBe("where");
    expect(radio.closest("label")!.textContent).toContain("From NegiFlow only");
    expect(document.getElementById(radio.getAttribute("aria-describedby")!)?.textContent).toBe("It stays on Facebook.");
    act(() => radio.click());
    expect(onChange).toHaveBeenCalled();
  });
});
