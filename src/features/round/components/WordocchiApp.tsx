"use client";

import {
  EyeIcon,
  EyeOffIcon,
  FlagIcon,
  SparklesIcon,
} from "lucide-react";
import Image from "next/image";
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
import { loadRoundState, saveRoundState } from "@/features/round/round-storage";
import type { Round, RoundPhase } from "@/features/round/round-types";
import { RulesDialog } from "@/features/rules/RulesDialog";
import { SettingsContent } from "@/features/settings/SettingsContent";
import { CountdownControls } from "@/features/timer/components/CountdownControls";
import { secondsToMinutesLabel } from "@/features/timer/timer-utils";
import { useCountdown } from "@/features/timer/use-countdown";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/cn";
import { TIMER_OPTIONS_SECONDS } from "@/lib/constants";

type ActiveModal = "rules" | "settings" | null;
type Confirm = "restart" | "endTimer" | null;
type PhaseTone = "sun" | "rose" | "sky" | "leaf";

type PhaseMeta = {
  readonly badge: string;
  readonly heading: string;
  readonly description: string;
  readonly tone: PhaseTone;
};

const illustrationSrc = {
  dogDetective: "/illustrations/dog-detective.png",
  catNotekeeper: "/illustrations/cat-notekeeper.png",
  lockSecret: "/illustrations/lock-secret.png",
  decorStar: "/illustrations/decor-star.png",
  decorHeart: "/illustrations/decor-heart.png",
} as const;

const phaseMeta: Record<RoundPhase, PhaseMeta> = {
  setup: {
    badge: "はじめよう",
    heading: "新しいラウンドをはじめる",
    description:
      "2つのヒミツのキジュンを選び、3つのワードを子どもたちに伝えてワードッチを楽しみましょう。",
    tone: "sun",
  },
  secretSelection: {
    badge: "ステップ 1",
    heading: "ヒミツのキジュンを選ぼう",
    description:
      "2つの候補から、今回のヒミツのキジュンを1つだけ選んでください。選ばないほうは伏せたままにします。",
    tone: "rose",
  },
  wordPrompt: {
    badge: "ステップ 2",
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
    badge: "正解はこちら",
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
  const [isSecretVisible, setIsSecretVisible] = useState(true);
  const phaseHeadingRef = useRef<HTMLHeadingElement>(null);

  const round = state.currentRound;
  const phase: RoundPhase = round?.phase ?? "setup";
  const meta = phaseMeta[phase];
  const secretText = round?.secretCriterion?.text ?? null;
  const showSecretBanner =
    Boolean(secretText) && phase !== "reveal" && phase !== "done";

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

  const goBack = useCallback(() => {
    dispatch({ type: "round/back" });
  }, []);

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

  const canGoBack = useMemo(() => {
    switch (phase) {
      case "wordPrompt":
      case "timedInvestigation":
      case "finalGuide":
      case "reveal":
        return true;
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
        {showSecretBanner && secretText ? (
          <SecretCriterionBanner
            secretText={secretText}
            isVisible={isSecretVisible}
            onToggle={() => setIsSecretVisible((visible) => !visible)}
          />
        ) : null}

        <Hero compact={phase !== "setup"} />

        <main className="grid gap-4 pb-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)] lg:items-start">
          <section
            key={phase}
            className="motion-safe:animate-[slide-up-fade_350ms_ease-out]"
            aria-labelledby="phase-heading"
          >
            <Card phaseTone={meta.tone} className="pt-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-leaf-600">
                  <FlagIcon className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[11px] font-rounded font-extrabold uppercase tracking-[0.18em]">
                    現在のフェイズ
                  </span>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 font-rounded text-xs font-extrabold uppercase tracking-[0.14em]",
                    badgeClass(meta.tone),
                  )}
                >
                  {meta.badge}
                </span>
              </div>
              <h2
                id="phase-heading"
                ref={phaseHeadingRef}
                tabIndex={-1}
                className={cn(
                  "mt-3 font-rounded text-2xl font-extrabold leading-snug text-ink-900 outline-none sm:text-3xl",
                  meta.tone === "rose" && "text-rose-500",
                )}
              >
                {meta.heading}
              </h2>
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
            </Card>
          </section>

          <aside className="grid gap-4">
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
        canGoBack={canGoBack}
        onRestart={handleRestartRequest}
        onBack={goBack}
        onAdvance={advanceFromCurrentPhase}
      />

      <RulesDialog isOpen={activeModal === "rules"} onClose={closeRules} />

      <Modal
        title="設定"
        isOpen={activeModal === "settings"}
        onClose={() => setActiveModal(null)}
      >
        <SettingsContent
          defaultTimerSeconds={state.settings.defaultTimerSeconds}
          onChangeTimer={(seconds) =>
            dispatch({ type: "settings/updateTimer", seconds })
          }
        />
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
        <div className="grid gap-3">
          <p className="text-sm leading-relaxed text-ink-600">
            下の <strong className="font-rounded font-extrabold text-leaf-600">「はじめる」</strong>{" "}
            を押すと、ヒミツのキジュン候補と3つのワードがランダムに用意されます。
          </p>
          <ol className="grid gap-2 text-sm">
            {[
              "ヒミツのキジュンを1つ選ぶ",
              "3つのワードを子どもたちに伝える",
              "タイマーで話し合いを進める",
              "決選 → キジュン公開で感想戦",
            ].map((step, index) => (
              <li
                key={step}
                className="flex items-center gap-3 rounded-2xl bg-cream-200/70 px-3 py-2"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream-50 font-rounded text-[11px] font-extrabold text-ink-900 shadow-card">
                  {index + 1}
                </span>
                <span className="leading-relaxed text-ink-900">{step}</span>
              </li>
            ))}
          </ol>
        </div>
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
        <div className="space-y-4">
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
        className="flex items-center justify-center gap-2 pb-3 pt-1 text-center"
        aria-label="ワードッチ"
      >
        <SparklesIcon className="h-4 w-4 text-sun-400" aria-hidden="true" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-600">
          親のための進行サポート
        </span>
      </section>
    );
  }

  return (
    <section className="relative pb-3 pt-2" aria-label="ワードッチ">
      <div
        className="pointer-events-none absolute inset-x-0 top-4 mx-auto h-40 max-w-md rounded-full bg-gradient-to-br from-sun-400/20 via-rose-100/40 to-sky-100/30 blur-2xl"
        aria-hidden="true"
      />
      <Image
        src={withBasePath(illustrationSrc.decorStar)}
        alt=""
        width={256}
        height={256}
        aria-hidden="true"
        className="pointer-events-none absolute right-7 top-1 h-9 w-9 rotate-12 object-contain opacity-85 sm:right-16 sm:h-11 sm:w-11"
      />
      <Image
        src={withBasePath(illustrationSrc.decorHeart)}
        alt=""
        width={256}
        height={256}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1 left-7 h-8 w-8 -rotate-12 object-contain opacity-80 sm:left-16 sm:h-10 sm:w-10"
      />
      <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-2 px-1">
        <Image
          src={withBasePath(illustrationSrc.dogDetective)}
          alt=""
          width={512}
          height={512}
          priority
          className="h-20 w-20 object-contain motion-safe:animate-[float-soft_5s_ease-in-out_infinite] sm:h-24 sm:w-24"
          style={{ ["--rot" as string]: "-6deg" }}
        />
        <div className="text-center">
          <p className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2.5 py-1 text-[10px] font-rounded font-extrabold uppercase tracking-[0.18em] text-ink-600 shadow-card">
            <SparklesIcon className="h-3 w-3 text-sun-400" aria-hidden="true" />
            親のための進行サポート
          </p>
          <h2 className="mt-2 font-rounded text-[2.6rem] font-black leading-none tracking-tight sm:text-6xl">
            {title.map(([letter, className]) => (
              <span key={letter} className={className}>
                {letter}
              </span>
            ))}
          </h2>
          <p className="mt-1 text-xs font-bold text-ink-600 sm:text-sm">
            あたたかい絵本のような進行カード
          </p>
        </div>
        <Image
          src={withBasePath(illustrationSrc.catNotekeeper)}
          alt=""
          width={512}
          height={512}
          priority
          className="h-20 w-20 object-contain motion-safe:animate-[float-soft_5s_ease-in-out_infinite_0.6s] sm:h-24 sm:w-24"
          style={{ ["--rot" as string]: "6deg" }}
        />
      </div>
    </section>
  );
}

function SecretCriterionBanner({
  secretText,
  isVisible,
  onToggle,
}: {
  readonly secretText: string;
  readonly isVisible: boolean;
  readonly onToggle: () => void;
}) {
  return (
    <section
      aria-label="親だけが見るヒミツのキジュン"
      className="relative mb-3 flex items-center gap-3 overflow-hidden rounded-3xl border-2 border-dashed border-rose-400 bg-gradient-to-br from-rose-100 via-cream-100 to-cream-100 px-4 py-3 shadow-card sm:px-5"
    >
      <span
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cream-50 shadow-card"
        aria-hidden="true"
      >
        <Image
          src={withBasePath(illustrationSrc.lockSecret)}
          alt=""
          width={512}
          height={512}
          className="h-12 w-12 object-contain"
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-rounded font-extrabold uppercase tracking-[0.16em] text-rose-500">
          ヒミツのキジュン・親だけ
        </p>
        {isVisible ? (
          <p className="mt-0.5 break-words font-rounded text-xl font-extrabold leading-snug text-ink-900 sm:text-2xl">
            {secretText}
          </p>
        ) : (
          <p
            className="mt-0.5 font-rounded text-xl font-extrabold leading-snug tracking-[0.35em] text-ink-400 sm:text-2xl"
            aria-hidden="true"
          >
            ••••••
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isVisible}
        aria-label={isVisible ? "キジュンを隠す" : "キジュンを表示する"}
        className="tap-highlight-none flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cream-50 text-rose-500 shadow-card transition active:scale-95 hover:bg-cream-100"
      >
        {isVisible ? (
          <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <EyeIcon className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </section>
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

function badgeClass(tone: PhaseTone): string {
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
