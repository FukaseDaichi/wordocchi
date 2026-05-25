"use client";

import {
  EyeIcon,
  EyeOffIcon,
  FlagIcon,
  LockKeyholeIcon,
  RotateCcwIcon,
  SparklesIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppShell } from "@/components/layout/AppShell";
import { FooterBar } from "@/components/layout/FooterBar";
import { PhaseStepper } from "@/components/layout/PhaseStepper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TimerDisplay } from "@/components/ui/TimerDisplay";
import { CriterionPicker } from "@/features/round/components/CriterionPicker";
import { PromptWords } from "@/features/round/components/PromptWords";
import { RevealPanel } from "@/features/round/components/RevealPanel";
import { createInitialState } from "@/features/round/round-actions";
import { roundReducer } from "@/features/round/round-reducer";
import {
  clearRoundState,
  loadRoundState,
  saveRoundState,
} from "@/features/round/round-storage";
import type { Round, RoundPhase } from "@/features/round/round-types";
import { RulesDialog } from "@/features/rules/RulesDialog";
import { CountdownControls } from "@/features/timer/components/CountdownControls";
import { secondsToMinutesLabel } from "@/features/timer/timer-utils";
import { useCountdown } from "@/features/timer/use-countdown";
import { cn } from "@/lib/cn";
import { TIMER_OPTIONS_SECONDS } from "@/lib/constants";

type ActiveModal = "rules" | "settings" | "secret" | null;
type Confirm = "restart" | "endTimer" | null;

type PhaseMeta = {
  readonly badge: string;
  readonly heading: string;
  readonly description: string;
  readonly tone: "sun" | "rose" | "sky" | "leaf";
};

const phaseMeta: Record<RoundPhase, PhaseMeta> = {
  setup: {
    badge: "はじめよう！",
    heading: "新しいラウンドをはじめる",
    description:
      "2つのヒミツのキジュンを選び、3つのワードを子どもたちに伝えてワードッチを楽しみましょう。",
    tone: "sun",
  },
  secretSelection: {
    badge: "ステップ1",
    heading: "ヒミツのキジュンを選ぼう",
    description:
      "2つの候補から、今回のヒミツのキジュンを1つだけ選んでください。選ばないほうは伏せたままにします。",
    tone: "rose",
  },
  wordPrompt: {
    badge: "ステップ2",
    heading: "3つのワードを子に伝えよう",
    description:
      "下の3つのワードを口に出して伝えてください。子どもたちは、ヒミツのキジュンに近そうなワードを話し合います。",
    tone: "sky",
  },
  timedInvestigation: {
    badge: "調査中",
    heading: "のこり時間で話し合おう",
    description:
      "子どもたちの質問や相談を聞きながら、親はヒミツのキジュンに近いほうをテンポよく選びます。",
    tone: "leaf",
  },
  finalGuide: {
    badge: "決選フェイズ",
    heading: "最後のワードを考えてもらおう",
    description:
      "子どもたちに最後のワードを1つ考えてもらいます。出そろったら、親がキジュンに一番合うワードを選びましょう。",
    tone: "rose",
  },
  reveal: {
    badge: "正解はこちら！",
    heading: "ヒミツのキジュンを公開しよう",
    description:
      "今回のキジュンと3ワードを見ながら、どのあたりで気づいたかをみんなで話してみましょう。",
    tone: "sun",
  },
  done: {
    badge: "おしまい",
    heading: "ラウンド終了",
    description:
      "今日のラウンドはここまでです。続けて遊ぶときは、新しいキジュンとワードを用意します。",
    tone: "leaf",
  },
};

export function WordocchiApp() {
  const [state, dispatch] = useReducer(roundReducer, undefined, createInitialState);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const phaseHeadingRef = useRef<HTMLHeadingElement>(null);

  const round = state.currentRound;
  const phase: RoundPhase = round?.phase ?? "setup";
  const meta = phaseMeta[phase];
  const secretText = round?.secretCriterion?.text ?? null;

  const timerOptions = useMemo(
    () =>
      TIMER_OPTIONS_SECONDS.map((seconds) => ({
        label: secondsToMinutesLabel(seconds),
        value: seconds,
      })),
    [],
  );

  useCountdown(state, dispatch);

  useEffect(() => {
    const persisted = loadRoundState();

    if (persisted) {
      dispatch({ type: "hydrate", state: persisted });
    }

    if (!persisted?.settings.hasSeenRules) {
      setActiveModal("rules");
    }

    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      saveRoundState(state);
    }
  }, [hasHydrated, state]);

  useEffect(() => {
    if (hasHydrated) {
      phaseHeadingRef.current?.focus();
    }
  }, [hasHydrated, phase]);

  useEffect(() => {
    if (activeModal !== "secret") {
      return;
    }

    const close = () => setActiveModal(null);
    const timerId = window.setTimeout(close, 5000);
    window.addEventListener("pointerup", close);
    window.addEventListener("keyup", close);

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener("pointerup", close);
      window.removeEventListener("keyup", close);
    };
  }, [activeModal]);

  const closeRules = useCallback(() => {
    dispatch({ type: "settings/markRulesSeen" });
    setActiveModal(null);
  }, []);

  const startRound = useCallback(() => {
    dispatch({
      type: "round/start",
      timerSeconds: state.settings.defaultTimerSeconds,
      now: new Date().toISOString(),
    });
  }, [state.settings.defaultTimerSeconds]);

  const advanceFromCurrentPhase = useCallback(() => {
    const now = new Date().toISOString();

    switch (phase) {
      case "setup":
        startRound();
        return;
      case "wordPrompt":
        dispatch({ type: "round/startInvestigation", now });
        return;
      case "timedInvestigation":
        setConfirm("endTimer");
        return;
      case "finalGuide":
        dispatch({ type: "round/reveal", now });
        return;
      case "reveal":
      case "done":
        startRound();
        return;
      default:
        return;
    }
  }, [phase, startRound]);

  const handleRestartRequest = useCallback(() => {
    if (phase === "setup") {
      startRound();
    } else {
      setConfirm("restart");
    }
  }, [phase, startRound]);

  const handleConfirmRestart = useCallback(() => {
    dispatch({
      type: "round/abortAndRestart",
      timerSeconds: state.settings.defaultTimerSeconds,
      now: new Date().toISOString(),
    });
    setConfirm(null);
  }, [state.settings.defaultTimerSeconds]);

  const handleConfirmEndTimer = useCallback(() => {
    dispatch({ type: "round/goFinal", now: new Date().toISOString() });
    setConfirm(null);
  }, []);

  const openSecret = () => {
    if (secretText) {
      setActiveModal("secret");
    }
  };

  const closeSecret = () => {
    if (activeModal === "secret") {
      setActiveModal(null);
    }
  };

  const resetApp = () => {
    clearRoundState();
    dispatch({ type: "settings/resetApp" });
    setActiveModal("rules");
  };

  const canAdvance = useMemo(() => {
    switch (phase) {
      case "setup":
      case "wordPrompt":
      case "timedInvestigation":
      case "finalGuide":
      case "reveal":
      case "done":
        return true;
      case "secretSelection":
        return false;
      default:
        return false;
    }
  }, [phase]);

  return (
    <div className="safe-screen flex min-h-dvh flex-col">
      <AppHeader
        onOpenRules={() => setActiveModal("rules")}
        onOpenSettings={() => setActiveModal("settings")}
      />
      <PhaseStepper phase={phase} />

      <AppShell>
        <Hero compact={phase !== "setup"} />

        <main className="grid gap-4 pb-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)] lg:items-start">
          <section
            key={phase}
            className="motion-safe:animate-[slide-up-fade_350ms_ease-out] rounded-3xl bg-cream-100 p-5 shadow-card sm:p-6"
            aria-labelledby="phase-heading"
          >
            <div className="flex items-center gap-2 text-leaf-600">
              <FlagIcon className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-bold">現在のフェイズ</span>
            </div>
            <span
              className={cn(
                "mt-3 inline-flex items-center rounded-full px-3 py-1 font-rounded text-sm font-bold shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)]",
                badgeClass(meta.tone),
              )}
            >
              {meta.badge}
            </span>
            <h1
              id="phase-heading"
              ref={phaseHeadingRef}
              tabIndex={-1}
              className={cn(
                "mt-3 font-rounded text-2xl font-extrabold leading-snug text-ink-900 outline-none sm:text-3xl",
                meta.tone === "rose" && "text-rose-500",
              )}
            >
              {meta.heading}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-600 sm:text-base">
              {meta.description}
            </p>

            <div className="mt-5">
              <PhaseBody
                phase={phase}
                round={round}
                onPickCriterion={(id) =>
                  dispatch({ type: "round/chooseCriterion", criterionId: id })
                }
                onTimerStart={() =>
                  dispatch({ type: "timer/start", now: new Date().toISOString() })
                }
                onTimerPause={() =>
                  dispatch({ type: "timer/pause", now: new Date().toISOString() })
                }
                onTimerResume={() =>
                  dispatch({ type: "timer/resume", now: new Date().toISOString() })
                }
                onTimerReset={() => dispatch({ type: "timer/reset" })}
                onTimerEnd={() => setConfirm("endTimer")}
                onFinish={() =>
                  dispatch({ type: "round/finish", now: new Date().toISOString() })
                }
              />
            </div>
          </section>

          <aside className="grid gap-4">
            <SecretHintCard
              canReveal={Boolean(secretText) && phase !== "reveal" && phase !== "done"}
              secretText={secretText}
              onOpen={openSecret}
              onClose={closeSecret}
            />

            {(phase === "setup" || phase === "secretSelection") && (
              <TimerSettingCard
                options={timerOptions}
                value={state.settings.defaultTimerSeconds}
                onChange={(seconds) =>
                  dispatch({ type: "settings/updateTimer", seconds })
                }
              />
            )}

            {round && phase !== "setup" && phase !== "done" ? (
              <RoundMiniSummary round={round} />
            ) : null}
          </aside>
        </main>
      </AppShell>

      <FooterBar
        phase={phase}
        canAdvance={canAdvance}
        onRestart={handleRestartRequest}
        onAdvance={advanceFromCurrentPhase}
      />

      <RulesDialog isOpen={activeModal === "rules"} onClose={closeRules} />

      <Modal
        title="設定"
        isOpen={activeModal === "settings"}
        onClose={() => setActiveModal(null)}
      >
        <div className="space-y-6">
          <SegmentedControl
            label="既定タイマー時間"
            options={timerOptions}
            value={state.settings.defaultTimerSeconds}
            onChange={(seconds) => dispatch({ type: "settings/updateTimer", seconds })}
          />
          <div className="rounded-2xl bg-rose-100/60 p-4">
            <p className="font-rounded text-lg font-bold text-danger-500">
              保存データを初期化する
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              端末内に保存した進行状態と設定を消して、初回状態に戻します。
            </p>
            <Button
              intent="danger"
              className="mt-4"
              leadingIcon={<RotateCcwIcon className="h-5 w-5" />}
              onClick={resetApp}
            >
              初期化する
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title="親だけが見るキジュン"
        isOpen={activeModal === "secret"}
        onClose={() => setActiveModal(null)}
      >
        <div className="rounded-3xl border-2 border-dashed border-rose-400 bg-rose-100 p-5 text-center text-ink-900">
          <LockKeyholeIcon className="mx-auto h-8 w-8 text-rose-500" aria-hidden="true" />
          <p className="mt-3 text-sm font-bold text-rose-500">子に見せないでください</p>
          <p className="mt-3 font-rounded text-3xl font-extrabold leading-snug text-rose-500">
            {secretText}
          </p>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirm === "restart"}
        title="新しくはじめますか？"
        description={
          <>
            進行中のラウンドを終わって、新しいキジュンとワードでやり直します。
            <br />
            この操作は取り消せません。
          </>
        }
        confirmLabel="新しくはじめる"
        onConfirm={handleConfirmRestart}
        onCancel={() => setConfirm(null)}
      />

      <ConfirmDialog
        isOpen={confirm === "endTimer"}
        title="タイマーを終了しますか？"
        description="調査フェイズを途中で終わって、決選フェイズへ進みます。"
        confirmLabel="終了して進む"
        onConfirm={handleConfirmEndTimer}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

type PhaseBodyProps = {
  readonly phase: RoundPhase;
  readonly round: Round | null;
  readonly onPickCriterion: (id: string) => void;
  readonly onTimerStart: () => void;
  readonly onTimerPause: () => void;
  readonly onTimerResume: () => void;
  readonly onTimerReset: () => void;
  readonly onTimerEnd: () => void;
  readonly onFinish: () => void;
};

function PhaseBody({
  phase,
  round,
  onPickCriterion,
  onTimerStart,
  onTimerPause,
  onTimerResume,
  onTimerReset,
  onTimerEnd,
  onFinish,
}: PhaseBodyProps) {
  switch (phase) {
    case "setup":
      return (
        <p className="text-sm leading-relaxed text-ink-600">
          下の <strong className="font-rounded font-extrabold text-leaf-600">「はじめる」</strong>{" "}
          を押すと、ヒミツのキジュン候補と3つのワードがランダムに用意されます。
        </p>
      );

    case "secretSelection":
      return round ? (
        <CriterionPicker
          candidates={round.criteriaCandidates}
          onPick={onPickCriterion}
        />
      ) : null;

    case "wordPrompt":
      return round ? <PromptWords words={round.promptWords} /> : null;

    case "timedInvestigation":
      return round ? (
        <div className="space-y-5">
          <TimerDisplay
            remainingSeconds={round.timerRemainingSeconds}
            totalSeconds={round.timerSeconds}
          />
          <CountdownControls
            status={round.timerStatus}
            remainingSeconds={round.timerRemainingSeconds}
            onStart={onTimerStart}
            onPause={onTimerPause}
            onResume={onTimerResume}
            onReset={onTimerReset}
            onEnd={onTimerEnd}
          />
        </div>
      ) : null;

    case "finalGuide":
      return (
        <ol className="space-y-3">
          {[
            "子どもたちにそれぞれ最後のワードを1つ考えてもらいます。",
            "全員のワードを順番に聞いて、親がキジュンに一番合うものを選びます。",
            "選んだあと、いよいよキジュンを公開して感想戦を始めます。",
          ].map((text, index) => (
            <li
              key={text}
              className="flex items-start gap-3 rounded-2xl bg-cream-200 px-4 py-3 text-sm leading-relaxed text-ink-900"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-500 font-rounded text-sm font-extrabold text-white">
                {index + 1}
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      );

    case "reveal":
      return round ? (
        <div className="space-y-5">
          <RevealPanel round={round} />
          <Button intent="secondary" onClick={onFinish}>
            ラウンドを記録して終わる
          </Button>
        </div>
      ) : null;

    case "done":
      return round ? <RevealPanel round={round} /> : null;

    default:
      return null;
  }
}

function Hero({ compact }: { readonly compact: boolean }) {
  const title = [
    ["ワ", "text-rose-500"],
    ["ー", "text-sun-400"],
    ["ド", "text-leaf-500"],
    ["ッ", "text-sky-500"],
    ["チ", "text-rose-500"],
  ] as const;

  if (compact) {
    return (
      <section
        className="flex items-center justify-center gap-2 pb-3 pt-2 text-center"
        aria-label="ワードッチ"
      >
        <SparklesIcon className="h-4 w-4 text-sun-400" aria-hidden="true" />
        <span className="font-rounded text-base font-extrabold">
          {title.map(([letter, className]) => (
            <span key={letter} className={className}>
              {letter}
            </span>
          ))}
        </span>
        <span className="text-xs font-bold text-ink-600">親のための進行サポート</span>
      </section>
    );
  }

  return (
    <section className="relative pb-4 pt-1 text-center">
      <div className="pointer-events-none absolute left-0 top-5 hidden h-16 w-16 rounded-full bg-sun-400/30 sm:block" />
      <div className="pointer-events-none absolute right-3 top-8 hidden h-12 w-12 rounded-full bg-sky-500/20 sm:block" />
      <p className="text-xs font-bold text-ink-600">親のための進行サポートツール</p>
      <h2 className="mt-1 font-rounded text-4xl font-black leading-tight sm:text-5xl">
        {title.map(([letter, className]) => (
          <span key={letter} className={className}>
            {letter}
          </span>
        ))}
      </h2>
    </section>
  );
}

function SecretHintCard({
  canReveal,
  secretText,
  onOpen,
  onClose,
}: {
  readonly canReveal: boolean;
  readonly secretText: string | null;
  readonly onOpen: () => void;
  readonly onClose: () => void;
}) {
  return (
    <Card as="aside" tone="secret" aria-label="親だけが見るヒント">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-rounded text-lg font-bold text-ink-900">親だけが見るヒント</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            ヒミツのキジュンは子に見せないでください。
          </p>
        </div>
        <EyeOffIcon className="h-6 w-6 shrink-0 text-rose-500" aria-hidden="true" />
      </header>

      {canReveal ? (
        <Button
          intent="secret"
          size="md"
          className="mt-4"
          leadingIcon={<EyeIcon className="h-5 w-5" />}
          onPointerDown={onOpen}
          onPointerUp={onClose}
          onPointerLeave={onClose}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              onOpen();
            }
          }}
          onKeyUp={(event) => {
            if (event.key === " " || event.key === "Enter") {
              onClose();
            }
          }}
        >
          押している間だけ確認
        </Button>
      ) : (
        <div className="mt-4 rounded-2xl bg-cream-100 px-4 py-3 text-sm font-bold text-ink-600">
          {secretText ? "公開フェイズでは全員で見られます。" : "まだキジュンは未選択です。"}
        </div>
      )}
    </Card>
  );
}

function TimerSettingCard({
  options,
  value,
  onChange,
}: {
  readonly options: readonly { readonly label: string; readonly value: number }[];
  readonly value: number;
  readonly onChange: (seconds: number) => void;
}) {
  return (
    <Card as="aside">
      <SegmentedControl
        label="タイマー設定"
        options={options}
        value={value}
        onChange={onChange}
      />
    </Card>
  );
}

function RoundMiniSummary({ round }: { readonly round: Round }) {
  return (
    <Card as="aside" className="space-y-3">
      <h2 className="font-rounded text-lg font-bold text-ink-900">このラウンド</h2>
      <div className="grid gap-2 text-sm">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-cream-200 px-4 py-3">
          <span className="font-bold text-ink-600">タイマー</span>
          <span className="font-rounded font-extrabold text-ink-900">
            {secondsToMinutesLabel(round.timerSeconds)}
          </span>
        </div>
        <div className="rounded-2xl bg-cream-200 px-4 py-3">
          <span className="font-bold text-ink-600">3ワード</span>
          <p className="mt-1 break-words font-rounded font-extrabold text-ink-900">
            {round.promptWords.map((word) => word.text).join(" / ")}
          </p>
        </div>
      </div>
    </Card>
  );
}

function badgeClass(tone: PhaseMeta["tone"]): string {
  switch (tone) {
    case "rose":
      return "bg-rose-100 text-rose-500";
    case "sky":
      return "bg-sky-500 text-white";
    case "leaf":
      return "bg-leaf-100 text-leaf-600";
    case "sun":
    default:
      return "bg-sun-400 text-ink-900";
  }
}
