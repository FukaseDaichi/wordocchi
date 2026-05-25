import { describe, expect, it } from "vitest";

import { createInitialState } from "@/features/round/round-actions";
import { roundReducer } from "@/features/round/round-reducer";

const baseNow = "2026-05-25T00:00:00.000Z";

describe("roundReducer", () => {
  it("starts a round with two criteria and three prompt words", () => {
    const state = roundReducer(createInitialState(), {
      type: "round/start",
      timerSeconds: 180,
      now: baseNow,
    });

    expect(state.currentRound?.phase).toBe("secretSelection");
    expect(state.currentRound?.criteriaCandidates).toHaveLength(2);
    expect(state.currentRound?.promptWords).toHaveLength(3);
    expect(state.currentRound?.timerRemainingSeconds).toBe(180);
  });

  it("moves from criterion selection to word prompt", () => {
    const started = roundReducer(createInitialState(), {
      type: "round/start",
      timerSeconds: 300,
      now: baseNow,
    });
    const criterionId = started.currentRound?.criteriaCandidates[0]?.id;

    const selected = roundReducer(started, {
      type: "round/chooseCriterion",
      criterionId: criterionId ?? "",
    });

    expect(selected.currentRound?.phase).toBe("wordPrompt");
    expect(selected.currentRound?.secretCriterion?.id).toBe(criterionId);
  });

  it("finishes the timer and shows the final guide", () => {
    const started = roundReducer(createInitialState(), {
      type: "round/start",
      timerSeconds: 3,
      now: baseNow,
    });
    const criterionId = started.currentRound?.criteriaCandidates[0]?.id ?? "";
    const selected = roundReducer(started, {
      type: "round/chooseCriterion",
      criterionId,
    });
    const timed = roundReducer(selected, {
      type: "round/startInvestigation",
      now: baseNow,
    });
    const finished = roundReducer(timed, {
      type: "timer/tick",
      now: "2026-05-25T00:00:03.000Z",
    });

    expect(finished.currentRound?.phase).toBe("finalGuide");
    expect(finished.currentRound?.timerRemainingSeconds).toBe(0);
    expect(finished.currentRound?.timerStatus).toBe("finished");
  });

  it("reveals and then finishes the round", () => {
    const started = roundReducer(createInitialState(), {
      type: "round/start",
      timerSeconds: 3,
      now: baseNow,
    });
    const criterionId = started.currentRound?.criteriaCandidates[0]?.id ?? "";
    const selected = roundReducer(started, {
      type: "round/chooseCriterion",
      criterionId,
    });
    const timed = roundReducer(selected, {
      type: "round/startInvestigation",
      now: baseNow,
    });
    const finalGuide = roundReducer(timed, {
      type: "timer/tick",
      now: "2026-05-25T00:00:03.000Z",
    });
    const revealed = roundReducer(finalGuide, {
      type: "round/reveal",
      now: "2026-05-25T00:00:04.000Z",
    });
    const done = roundReducer(revealed, {
      type: "round/finish",
      now: "2026-05-25T00:00:05.000Z",
    });

    expect(revealed.currentRound?.phase).toBe("reveal");
    expect(done.currentRound?.phase).toBe("done");
    expect(done.lastRound?.phase).toBe("done");
  });
});
