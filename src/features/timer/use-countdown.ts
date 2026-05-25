"use client";

import { useEffect, useRef } from "react";

import type { RoundAction, RoundState } from "@/features/round/round-types";
import {
  TIMER_WARNING_ONE_MINUTE,
  TIMER_WARNING_THIRTY_SECONDS,
} from "@/lib/constants";

export function useCountdown(
  state: RoundState,
  dispatch: (action: RoundAction) => void,
) {
  const previousRemainingRef = useRef<number | null>(null);
  const currentRound = state.currentRound;
  const phase = currentRound?.phase;
  const timerStartedAt = currentRound?.timerStartedAt;
  const timerStatus = currentRound?.timerStatus;

  useEffect(() => {
    if (phase !== "timedInvestigation" || timerStatus !== "running") {
      previousRemainingRef.current = currentRound?.timerRemainingSeconds ?? null;
      return;
    }

    const intervalId = window.setInterval(() => {
      dispatch({ type: "timer/tick", now: new Date().toISOString() });
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [currentRound?.timerRemainingSeconds, dispatch, phase, timerStartedAt, timerStatus]);

  useEffect(() => {
    const remaining = state.currentRound?.timerRemainingSeconds;

    if (typeof remaining !== "number") {
      previousRemainingRef.current = null;
      return;
    }

    const previous = previousRemainingRef.current;
    previousRemainingRef.current = remaining;

    if (
      typeof navigator !== "undefined" &&
      "vibrate" in navigator &&
      previous !== null &&
      previous > TIMER_WARNING_THIRTY_SECONDS &&
      remaining <= TIMER_WARNING_THIRTY_SECONDS
    ) {
      navigator.vibrate?.([120, 80, 120]);
    }

    if (
      typeof navigator !== "undefined" &&
      "vibrate" in navigator &&
      previous !== null &&
      previous > TIMER_WARNING_ONE_MINUTE &&
      remaining <= TIMER_WARNING_ONE_MINUTE
    ) {
      navigator.vibrate?.(80);
    }
  }, [state.currentRound?.timerRemainingSeconds]);
}
