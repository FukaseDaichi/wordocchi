import type { SamplePromptWord, SampleSecretCriterion } from "@/data/sample-prompts";

export type RoundPhase =
  | "setup"
  | "secretSelection"
  | "wordPrompt"
  | "timedInvestigation"
  | "finalGuide"
  | "reveal"
  | "done";

export type TimerStatus = "idle" | "running" | "paused" | "finished";

export type Settings = {
  readonly defaultTimerSeconds: number;
  readonly hasSeenRules: boolean;
};

export type Round = {
  readonly id: string;
  readonly phase: Exclude<RoundPhase, "setup">;
  readonly criteriaCandidates: readonly SampleSecretCriterion[];
  readonly secretCriterion: SampleSecretCriterion | null;
  readonly promptWords: readonly SamplePromptWord[];
  readonly timerSeconds: number;
  readonly timerStartedAt: string | null;
  readonly timerRemainingSeconds: number;
  readonly timerStatus: TimerStatus;
  readonly optionalMemo: string | null;
  readonly createdAt: string;
  readonly completedAt: string | null;
};

export type RoundState = {
  readonly schemaVersion: number;
  readonly currentRound: Round | null;
  readonly lastRound: Round | null;
  readonly settings: Settings;
};

export type RoundAction =
  | { readonly type: "hydrate"; readonly state: RoundState }
  | { readonly type: "settings/markRulesSeen" }
  | { readonly type: "settings/updateTimer"; readonly seconds: number }
  | { readonly type: "settings/resetApp" }
  | { readonly type: "round/start"; readonly timerSeconds?: number; readonly now?: string }
  | { readonly type: "round/chooseCriterion"; readonly criterionId: string }
  | { readonly type: "round/startInvestigation"; readonly now: string }
  | { readonly type: "round/reveal"; readonly now: string }
  | { readonly type: "round/finish"; readonly now: string }
  | { readonly type: "timer/start"; readonly now: string }
  | { readonly type: "timer/pause"; readonly now: string }
  | { readonly type: "timer/resume"; readonly now: string }
  | { readonly type: "timer/reset" }
  | { readonly type: "timer/tick"; readonly now: string };
