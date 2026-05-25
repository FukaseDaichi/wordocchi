import { describe, expect, it } from "vitest";

import { samplePromptWords, sampleSecretCriteria } from "@/data/sample-prompts";

describe("sample prompt data", () => {
  it("contains the planned amount of original sample data", () => {
    expect(sampleSecretCriteria).toHaveLength(100);
    expect(samplePromptWords).toHaveLength(300);
  });

  it("has unique ids", () => {
    expect(new Set(sampleSecretCriteria.map((criterion) => criterion.id)).size).toBe(100);
    expect(new Set(samplePromptWords.map((word) => word.id)).size).toBe(300);
  });
});
