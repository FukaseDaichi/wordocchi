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

  it("steps back one phase and undoes the matching state", () => {
    const started = roundReducer(createInitialState(), {
      type: "round/start",
      timerSeconds: 180,
      now: baseNow,
    });
    const criterionId = started.currentRound?.criteriaCandidates[0]?.id ?? "";
    const wordPrompt = roundReducer(started, {
      type: "round/chooseCriterion",
      criterionId,
    });

    // wordPrompt -> secretSelection clears the chosen criterion.
    const backToSecret = roundReducer(wordPrompt, { type: "round/back" });
    expect(backToSecret.currentRound?.phase).toBe("secretSelection");
    expect(backToSecret.currentRound?.secretCriterion).toBeNull();

    // secretSelection is the first active phase, so back is a no-op.
    const stillSecret = roundReducer(backToSecret, { type: "round/back" });
    expect(stillSecret.currentRound?.phase).toBe("secretSelection");

    // timedInvestigation -> wordPrompt resets the timer to the full duration.
    const timed = roundReducer(wordPrompt, {
      type: "round/startInvestigation",
      now: baseNow,
    });
    const ticked = roundReducer(timed, {
      type: "timer/tick",
      now: "2026-05-25T00:00:05.000Z",
    });
    const backToWords = roundReducer(ticked, { type: "round/back" });
    expect(backToWords.currentRound?.phase).toBe("wordPrompt");
    expect(backToWords.currentRound?.timerStatus).toBe("idle");
    expect(backToWords.currentRound?.timerRemainingSeconds).toBe(180);
    expect(backToWords.currentRound?.secretCriterion?.id).toBe(criterionId);

    // reveal -> finalGuide -> timedInvestigation walks back step by step.
    const finalGuide = roundReducer(timed, { type: "round/goFinal", now: baseNow });
    const revealed = roundReducer(finalGuide, {
      type: "round/reveal",
      now: "2026-05-25T00:00:06.000Z",
    });
    const backToFinal = roundReducer(revealed, { type: "round/back" });
    expect(backToFinal.currentRound?.phase).toBe("finalGuide");
    expect(backToFinal.currentRound?.completedAt).toBeNull();

    const backToTimed = roundReducer(backToFinal, { type: "round/back" });
    expect(backToTimed.currentRound?.phase).toBe("timedInvestigation");
    expect(backToTimed.currentRound?.timerStatus).toBe("idle");
    expect(backToTimed.currentRound?.timerRemainingSeconds).toBe(180);
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
