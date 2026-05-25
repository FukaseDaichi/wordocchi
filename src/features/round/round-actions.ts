import {
  samplePromptWords,
  sampleSecretCriteria,
  type SamplePromptWord,
  type SampleSecretCriterion,
} from "@/data/sample-prompts";
import { DEFAULT_TIMER_SECONDS } from "@/lib/constants";
import type { Round, RoundState, Settings } from "@/features/round/round-types";
import { SCHEMA_VERSION } from "@/lib/constants";

export function createInitialSettings(): Settings {
  return {
    defaultTimerSeconds: DEFAULT_TIMER_SECONDS,
    hasSeenRules: false,
  };
}

export function createInitialState(): RoundState {
  return {
    schemaVersion: SCHEMA_VERSION,
    currentRound: null,
    lastRound: null,
    settings: createInitialSettings(),
  };
}

export function createRound({
  timerSeconds,
  now = new Date().toISOString(),
}: {
  readonly timerSeconds: number;
  readonly now?: string;
}): Round {
  return {
    id: createId(),
    phase: "secretSelection",
    criteriaCandidates: pickUnique(sampleSecretCriteria, 2),
    secretCriterion: null,
    promptWords: pickUnique(samplePromptWords, 3),
    timerSeconds,
    timerStartedAt: null,
    timerRemainingSeconds: timerSeconds,
    timerStatus: "idle",
    optionalMemo: null,
    createdAt: now,
    completedAt: null,
  };
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `round-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function pickUnique<T extends SampleSecretCriterion | SamplePromptWord>(
  items: readonly T[],
  count: number,
): readonly T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy.slice(0, count);
}
