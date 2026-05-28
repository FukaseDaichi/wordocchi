import type { Round, RoundPhase, RoundState, Settings, TimerStatus } from "@/features/round/round-types";
import { SCHEMA_VERSION, STORAGE_KEY, TIMER_OPTIONS_SECONDS } from "@/lib/constants";
import { readJson, writeJson } from "@/lib/storage";

const roundPhases = [
  "secretSelection",
  "wordPrompt",
  "timedInvestigation",
  "finalGuide",
  "reveal",
  "done",
] satisfies readonly Exclude<RoundPhase, "setup">[];

const timerStatuses = ["idle", "running", "paused", "finished"] satisfies readonly TimerStatus[];

export function loadRoundState(): RoundState | null {
  return parsePersistedRoundState(readJson<unknown>(STORAGE_KEY));
}

export function saveRoundState(state: RoundState): void {
  writeJson(STORAGE_KEY, state);
}

export function parsePersistedRoundState(value: unknown): RoundState | null {
  if (!isRecord(value) || value.schemaVersion !== SCHEMA_VERSION) {
    return null;
  }

  const settings = parseSettings(value.settings);
  const currentRound = parseNullableRound(value.currentRound);
  const lastRound = parseNullableRound(value.lastRound);

  if (!settings || currentRound === undefined || lastRound === undefined) {
    return null;
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    currentRound,
    lastRound,
    settings,
  };
}

function parseSettings(value: unknown): Settings | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.defaultTimerSeconds !== "number" ||
    !TIMER_OPTIONS_SECONDS.includes(
      value.defaultTimerSeconds as (typeof TIMER_OPTIONS_SECONDS)[number],
    ) ||
    typeof value.hasSeenRules !== "boolean"
  ) {
    return null;
  }

  return {
    defaultTimerSeconds: value.defaultTimerSeconds,
    hasSeenRules: value.hasSeenRules,
  };
}

function parseNullableRound(value: unknown): Round | null | undefined {
  if (value === null) {
    return null;
  }

  return parseRound(value) ?? undefined;
}

function parseRound(value: unknown): Round | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.id !== "string" ||
    !isRoundPhase(value.phase) ||
    !Array.isArray(value.criteriaCandidates) ||
    !Array.isArray(value.promptWords) ||
    !(value.secretCriterion === null || isPromptItem(value.secretCriterion)) ||
    typeof value.timerSeconds !== "number" ||
    typeof value.timerRemainingSeconds !== "number" ||
    !isTimerStatus(value.timerStatus) ||
    !(value.timerStartedAt === null || typeof value.timerStartedAt === "string") ||
    !(value.optionalMemo === null || typeof value.optionalMemo === "string") ||
    typeof value.createdAt !== "string" ||
    !(value.completedAt === null || typeof value.completedAt === "string")
  ) {
    return null;
  }

  if (!value.criteriaCandidates.every(isPromptItem) || !value.promptWords.every(isPromptItem)) {
    return null;
  }

  return {
    id: value.id,
    phase: value.phase,
    criteriaCandidates: value.criteriaCandidates,
    secretCriterion: value.secretCriterion,
    promptWords: value.promptWords,
    timerSeconds: value.timerSeconds,
    timerStartedAt: value.timerStartedAt,
    timerRemainingSeconds: value.timerRemainingSeconds,
    timerStatus: value.timerStatus,
    optionalMemo: value.optionalMemo,
    createdAt: value.createdAt,
    completedAt: value.completedAt,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPromptItem(value: unknown): value is { readonly id: string; readonly text: string } {
  return isRecord(value) && typeof value.id === "string" && typeof value.text === "string";
}

function isRoundPhase(value: unknown): value is Exclude<RoundPhase, "setup"> {
  return typeof value === "string" && roundPhases.includes(value as Exclude<RoundPhase, "setup">);
}

function isTimerStatus(value: unknown): value is TimerStatus {
  return typeof value === "string" && timerStatuses.includes(value as TimerStatus);
}
