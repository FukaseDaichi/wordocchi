"use client";

import { CheckIcon, HeartIcon, SparklesIcon, StarIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import type { SamplePromptWord } from "@/data/sample-prompts";

type Tone = {
  readonly id: "rose" | "sun" | "sky";
  readonly chip: string;
  readonly chipText: string;
  readonly border: string;
  readonly card: string;
  readonly tailFill: string;
  readonly tailStroke: string;
  readonly accent: string;
  readonly accentBg: string;
  readonly ribbon: string;
  readonly tilt: string;
  readonly tiltDone: string;
  readonly punch: string;
  readonly sparkleA: string;
  readonly sparkleB: string;
  readonly sparkleC: string;
};

const TONES: readonly Tone[] = [
  {
    id: "rose",
    chip: "bg-rose-500",
    chipText: "text-white",
    border: "border-rose-300",
    card: "bg-gradient-to-br from-rose-100 via-cream-100 to-cream-50",
    tailFill: "fill-rose-100",
    tailStroke: "stroke-rose-300",
    accent: "text-rose-500",
    accentBg: "bg-rose-500",
    ribbon: "bg-rose-500 text-white",
    tilt: "sm:-rotate-1",
    tiltDone: "sm:-rotate-[1.4deg]",
    punch: "bg-rose-300/70",
    sparkleA: "text-rose-500",
    sparkleB: "text-sun-400",
    sparkleC: "text-sky-500",
  },
  {
    id: "sun",
    chip: "bg-sun-400",
    chipText: "text-ink-900",
    border: "border-sun-400/70",
    card: "bg-gradient-to-br from-sun-100 via-cream-100 to-cream-50",
    tailFill: "fill-sun-100",
    tailStroke: "stroke-sun-400/70",
    accent: "text-ink-900",
    accentBg: "bg-sun-400",
    ribbon: "bg-sun-400 text-ink-900",
    tilt: "sm:rotate-0",
    tiltDone: "sm:-rotate-[0.4deg]",
    punch: "bg-sun-400/70",
    sparkleA: "text-sun-400",
    sparkleB: "text-rose-500",
    sparkleC: "text-leaf-500",
  },
  {
    id: "sky",
    chip: "bg-sky-500",
    chipText: "text-white",
    border: "border-sky-500/50",
    card: "bg-gradient-to-br from-sky-100 via-cream-100 to-cream-50",
    tailFill: "fill-sky-100",
    tailStroke: "stroke-sky-500/60",
    accent: "text-sky-500",
    accentBg: "bg-sky-500",
    ribbon: "bg-sky-500 text-white",
    tilt: "sm:rotate-1",
    tiltDone: "sm:rotate-[1.4deg]",
    punch: "bg-sky-500/60",
    sparkleA: "text-sky-500",
    sparkleB: "text-rose-500",
    sparkleC: "text-sun-400",
  },
] as const;

const COUNTER_KANJI = ["ひとつめ", "ふたつめ", "みっつめ"] as const;

type PromptWordsProps = {
  readonly words: readonly SamplePromptWord[];
};

export function PromptWords({ words }: PromptWordsProps) {
  const wordIds = useMemo(() => words.map((word) => word.id).join("|"), [words]);
  const [spokenIds, setSpokenIds] = useState<readonly string[]>([]);

  // words が差し替わったら(再ラウンド・もどる/はじめ直す)、ローカルな「伝えた」マークを必ずリセット。
  // Round state / storage には保存しないので、フェイズ切替で自然に消える。
  useEffect(() => {
    setSpokenIds([]);
  }, [wordIds]);

  const toggleSpoken = useCallback((id: string) => {
    setSpokenIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  }, []);

  const spokenCount = spokenIds.length;
  const total = words.length;
  const allSpoken = total > 0 && spokenCount === total;

  return (
    <section aria-label="子に伝える3つのワード" className="grid gap-4">
      <ProgressHint spokenCount={spokenCount} total={total} />

      <ol
        className="grid gap-4 sm:grid-cols-3 sm:gap-3"
        aria-label="子に伝える3つのワード一覧"
      >
        {words.map((word, index) => {
          const tone = TONES[index] ?? TONES[0];
          const isSpoken = spokenIds.includes(word.id);

          return (
            <WordCard
              key={word.id}
              tone={tone}
              index={index}
              word={word}
              isSpoken={isSpoken}
              onToggle={() => toggleSpoken(word.id)}
            />
          );
        })}
      </ol>

      {allSpoken ? <FinalePill /> : null}
    </section>
  );
}

type WordCardProps = {
  readonly tone: Tone;
  readonly index: number;
  readonly word: SamplePromptWord;
  readonly isSpoken: boolean;
  readonly onToggle: () => void;
};

function WordCard({ tone, index, word, isSpoken, onToggle }: WordCardProps) {
  // 「伝えた」状態に変わった瞬間だけポップさせるためのスタンプ。
  // motion-safe 配下でだけ value を増やしてキーフレームを再起動する。
  const [popStamp, setPopStamp] = useState(0);
  const [unpopStamp, setUnpopStamp] = useState(0);
  const [prevSpoken, setPrevSpoken] = useState(isSpoken);

  if (prevSpoken !== isSpoken) {
    setPrevSpoken(isSpoken);
    if (isSpoken) {
      setPopStamp((value) => value + 1);
    } else {
      setUnpopStamp((value) => value + 1);
    }
  }

  const counterLabel = COUNTER_KANJI[index] ?? `${index + 1}つめ`;
  const ariaLabel = isSpoken
    ? `${counterLabel}のワード ${word.text}、伝えました。タップで取り消し。`
    : `${counterLabel}のワード ${word.text}。タップで伝えた印をつける。`;

  return (
    <li className="contents">
      <button
        type="button"
        aria-pressed={isSpoken}
        aria-label={ariaLabel}
        onClick={onToggle}
        className={cn(
          "tap-highlight-none group relative flex w-full flex-col items-stretch overflow-visible rounded-3xl border-2 px-5 pb-6 pt-5 text-center shadow-pop transition motion-reduce:transition-none",
          tone.border,
          tone.card,
          // 未選択時のホバー
          !isSpoken &&
            "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-card",
          // 選択中の傾き/光彩
          isSpoken && "ring-4 ring-offset-2 ring-offset-cream-100",
          isSpoken && tone.id === "rose" && "ring-rose-400/40",
          isSpoken && tone.id === "sun" && "ring-sun-400/50",
          isSpoken && tone.id === "sky" && "ring-sky-500/40",
          // sm 以上で軽い傾き
          !isSpoken && tone.tilt,
          isSpoken && tone.tiltDone,
          // 「伝えた」スタンプ演出。奇偶で2つの animation を交互に当てて、再選択時も毎回再再生されるようにする。
          isSpoken && "z-10",
          isSpoken &&
            (popStamp % 2 === 1
              ? "motion-safe:animate-word-card-pop"
              : "motion-safe:animate-word-card-pop-alt"),
          !isSpoken &&
            unpopStamp > 0 &&
            (unpopStamp % 2 === 1
              ? "motion-safe:animate-word-card-unpop"
              : "motion-safe:animate-word-card-unpop-alt"),
        )}
        data-pop-stamp={popStamp}
      >
        {/* 上端の左右にパンチ穴(絵本ページ感) */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-4 top-2 h-1.5 w-1.5 rounded-full",
            tone.punch,
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-4 top-2 h-1.5 w-1.5 rounded-full",
            tone.punch,
          )}
        />

        {/* 左上: 番号バッジ */}
        <span
          className={cn(
            "absolute -top-3 left-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-rounded text-[11px] font-extrabold uppercase tracking-[0.18em] shadow-card",
            tone.chip,
            tone.chipText,
          )}
          aria-hidden="true"
        >
          <span className="text-base leading-none">{index + 1}</span>
          <span>{counterLabel}</span>
        </span>

        {/* 確定時のシマー光(motion-safe のみ) */}
        {isSpoken ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-sun-100 via-cream-50 to-transparent opacity-0 mix-blend-screen motion-safe:animate-word-card-glow motion-reduce:hidden"
          />
        ) : null}

        {/* 確定時のスパークル3つ(motion-safe のみ) */}
        {isSpoken ? (
          <span className="pointer-events-none absolute inset-x-0 top-0 z-10 motion-reduce:hidden">
            <SparklesIcon
              aria-hidden="true"
              className={cn(
                "absolute left-[18%] top-2 h-4 w-4 motion-safe:animate-word-sparkle-rise",
                tone.sparkleA,
              )}
            />
            <HeartIcon
              aria-hidden="true"
              className={cn(
                "absolute left-1/2 top-1 h-4 w-4 -translate-x-1/2 motion-safe:animate-word-sparkle-rise motion-safe:[animation-delay:120ms]",
                tone.sparkleB,
              )}
              fill="currentColor"
            />
            <StarIcon
              aria-hidden="true"
              className={cn(
                "absolute right-[18%] top-2 h-4 w-4 motion-safe:animate-word-sparkle-rise motion-safe:[animation-delay:240ms]",
                tone.sparkleC,
              )}
              fill="currentColor"
            />
          </span>
        ) : null}

        {/* 右上: 「伝えた」リボン */}
        {isSpoken ? (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -right-2 -top-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-rounded text-[11px] font-extrabold uppercase tracking-[0.16em] shadow-card motion-safe:animate-word-ribbon-drop",
              tone.ribbon,
            )}
          >
            <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
            伝えた
          </span>
        ) : null}

        {/* 本文 */}
        <p
          className={cn(
            "mt-3 break-words font-rounded text-2xl font-extrabold leading-snug text-ink-900 sm:text-[1.6rem]",
            isSpoken && "text-ink-900",
          )}
        >
          {word.text}
        </p>

        {/* 下部ヒント / 状態テキスト */}
        <p
          className={cn(
            "mt-3 inline-flex items-center justify-center gap-1 text-[11px] font-bold leading-tight",
            isSpoken ? tone.accent : "text-ink-400",
          )}
        >
          {isSpoken ? (
            <>
              <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>伝えました</span>
            </>
          ) : (
            <>
              <SparklesIcon className="h-3.5 w-3.5 text-sun-400" aria-hidden="true" />
              <span>読みあげたらタップ</span>
            </>
          )}
        </p>

        {/* 吹き出しのしっぽ(下中央) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 18"
          className={cn(
            "pointer-events-none absolute -bottom-[14px] left-1/2 h-[18px] w-6 -translate-x-1/2 drop-shadow-[0_2px_0_rgba(110,80,40,0.06)]",
          )}
        >
          {/* しっぽ本体 */}
          <path
            d="M2 1 L22 1 L13 15 Q12 17 11 15 Z"
            className={cn(tone.tailFill, tone.tailStroke)}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </li>
  );
}

function ProgressHint({
  spokenCount,
  total,
}: {
  readonly spokenCount: number;
  readonly total: number;
}) {
  const remaining = Math.max(total - spokenCount, 0);
  const message =
    spokenCount === 0
      ? "順番にカードを読みあげて、伝えたらタップしてしるしをつけよう。"
      : remaining > 0
        ? `あと ${remaining} つ、子に伝えてね。`
        : "ぜんぶ伝えたよ。下の「進む」でタイマーへ。";

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-2xl border border-dashed border-border-200 bg-cream-100 px-3 py-2.5"
    >
      <span
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500 font-rounded text-xs font-extrabold text-white shadow-card"
        aria-hidden="true"
      >
        {spokenCount}/{total}
      </span>
      <p className="text-xs leading-relaxed text-ink-600 sm:text-sm">{message}</p>
    </div>
  );
}

function FinalePill() {
  return (
    <p
      role="status"
      aria-live="polite"
      className="inline-flex w-fit items-center gap-1.5 self-center rounded-full bg-gradient-to-r from-rose-100 via-sun-100 to-sky-100 px-4 py-1.5 font-rounded text-[12px] font-extrabold tracking-[0.12em] text-ink-900 shadow-card motion-safe:animate-word-finale-pop"
    >
      <SparklesIcon className="h-4 w-4 text-sun-400" aria-hidden="true" />
      ぜんぶ伝えたね!
      <SparklesIcon className="h-4 w-4 text-rose-500" aria-hidden="true" />
    </p>
  );
}
