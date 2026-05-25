import { describe, expect, it } from "vitest";

import { formatSeconds, secondsToMinutesLabel } from "@/features/timer/timer-utils";

describe("timer utils", () => {
  it("formats seconds as m:ss", () => {
    expect(formatSeconds(300)).toBe("5:00");
    expect(formatSeconds(59)).toBe("0:59");
    expect(formatSeconds(-1)).toBe("0:00");
  });

  it("formats minute labels", () => {
    expect(secondsToMinutesLabel(180)).toBe("3分");
    expect(secondsToMinutesLabel(600)).toBe("10分");
  });
});
