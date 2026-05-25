import { createInitialState, createRound } from "@/features/round/round-actions";
import type { Round, RoundAction, RoundState, Settings } from "@/features/round/round-types";
import { TIMER_OPTIONS_SECONDS } from "@/lib/constants";

export function roundReducer(state: RoundState, action: RoundAction): RoundState {
  switch (action.type) {
    case "hydrate":
      return action.state;

    case "settings/markRulesSeen":
      return {
        ...state,
        settings: {
          ...state.settings,
          hasSeenRules: true,
        },
      };

    case "settings/updateTimer":
      return {
        ...state,
        settings: updateSettingsTimer(state.settings, action.seconds),
        currentRound:
          state.currentRound && state.currentRound.phase === "secretSelection"
            ? {
                ...state.currentRound,
                timerSeconds: action.seconds,
                timerRemainingSeconds: action.seconds,
              }
            : state.currentRound,
      };

    case "settings/resetApp":
      return createInitialState();

    case "round/start": {
      const timerSeconds = action.timerSeconds ?? state.settings.defaultTimerSeconds;
      return {
        ...state,
        currentRound: createRound({ timerSeconds, now: action.now }),
      };
    }

    case "round/chooseCriterion":
      return updateCurrentRound(state, (round) => {
        const selected = round.criteriaCandidates.find(
          (criterion) => criterion.id === action.criterionId,
        );

        if (!selected || round.phase !== "secretSelection") {
          return round;
        }

        return {
          ...round,
          phase: "wordPrompt",
          secretCriterion: selected,
        };
      });

    case "round/startInvestigation":
    case "timer/start":
      return updateCurrentRound(state, (round) => {
        if (round.phase !== "wordPrompt" && round.phase !== "timedInvestigation") {
          return round;
        }

        return {
          ...round,
          phase: "timedInvestigation",
          timerStatus: "running",
          timerStartedAt: action.now,
        };
      });

    case "timer/pause":
      return updateCurrentRound(state, (round) => {
        const settled = settleRunningTimer(round, action.now);

        if (settled.timerStatus !== "running") {
          return settled;
        }

        return {
          ...settled,
          timerStatus: "paused",
          timerStartedAt: null,
        };
      });

    case "timer/resume":
      return updateCurrentRound(state, (round) => {
        if (round.phase !== "timedInvestigation" || round.timerRemainingSeconds <= 0) {
          return round;
        }

        return {
          ...round,
          timerStatus: "running",
          timerStartedAt: action.now,
        };
      });

    case "timer/reset":
      return updateCurrentRound(state, (round) => {
        if (round.phase !== "timedInvestigation") {
          return round;
        }

        return {
          ...round,
          timerRemainingSeconds: round.timerSeconds,
          timerStartedAt: null,
          timerStatus: "idle",
        };
      });

    case "timer/tick":
      return updateCurrentRound(state, (round) => settleRunningTimer(round, action.now));

    case "round/reveal":
      return updateCurrentRound(state, (round) => {
        if (round.phase !== "finalGuide" && round.phase !== "timedInvestigation") {
          return round;
        }

        const revealed = {
          ...settleRunningTimer(round, action.now),
          phase: "reveal" as const,
          timerStatus: "finished" as const,
          timerStartedAt: null,
          completedAt: action.now,
        };

        return revealed;
      });

    case "round/finish": {
      if (!state.currentRound) {
        return state;
      }

      const finished = {
        ...state.currentRound,
        phase: "done" as const,
        completedAt: state.currentRound.completedAt ?? action.now,
        timerStartedAt: null,
        timerStatus: "finished" as const,
      };

      return {
        ...state,
        currentRound: finished,
        lastRound: finished,
      };
    }

    default:
      return state;
  }
}

function updateSettingsTimer(settings: Settings, seconds: number): Settings {
  const nextSeconds = TIMER_OPTIONS_SECONDS.includes(
    seconds as (typeof TIMER_OPTIONS_SECONDS)[number],
  )
    ? seconds
    : settings.defaultTimerSeconds;

  return {
    ...settings,
    defaultTimerSeconds: nextSeconds,
  };
}

function updateCurrentRound(
  state: RoundState,
  updater: (round: Round) => Round,
): RoundState {
  if (!state.currentRound) {
    return state;
  }

  const currentRound = updater(state.currentRound);

  return {
    ...state,
    currentRound,
    lastRound: currentRound.phase === "done" ? currentRound : state.lastRound,
  };
}

function settleRunningTimer(round: Round, now: string): Round {
  if (
    round.phase !== "timedInvestigation" ||
    round.timerStatus !== "running" ||
    !round.timerStartedAt
  ) {
    return round;
  }

  const elapsedSeconds = Math.floor(
    (Date.parse(now) - Date.parse(round.timerStartedAt)) / 1000,
  );

  if (elapsedSeconds <= 0) {
    return round;
  }

  const timerRemainingSeconds = Math.max(0, round.timerRemainingSeconds - elapsedSeconds);

  if (timerRemainingSeconds === 0) {
    return {
      ...round,
      phase: "finalGuide",
      timerRemainingSeconds,
      timerStatus: "finished",
      timerStartedAt: null,
    };
  }

  return {
    ...round,
    timerRemainingSeconds,
    timerStartedAt: now,
  };
}
