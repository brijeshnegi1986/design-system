import { act } from "react";

/** Opens an NDS Select (ui/select.tsx) and clicks the option with this label. */
export async function chooseOption(trigger: HTMLElement, label: string): Promise<void> {
  await act(async () => trigger.click());
  const option = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(
    (item) => item.textContent?.trim() === label,
  );
  if (!option) throw new Error(`No option "${label}" in the open menu`);
  await act(async () => option.click());
}
