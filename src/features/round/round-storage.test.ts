import { describe, expect, it } from "vitest";

import { createInitialState } from "@/features/round/round-actions";
import { parsePersistedRoundState } from "@/features/round/round-storage";

describe("round storage parser", () => {
  it("accepts the current schema", () => {
    expect(parsePersistedRoundState(createInitialState())).toEqual(createInitialState());
  });

  it("rejects unknown or old data", () => {
    expect(parsePersistedRoundState(null)).toBeNull();
    expect(parsePersistedRoundState({ schemaVersion: 999 })).toBeNull();
    expect(parsePersistedRoundState({ schemaVersion: 1, settings: null })).toBeNull();
  });
});
