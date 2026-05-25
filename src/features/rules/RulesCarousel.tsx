"use client";

import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { ruleSteps, type RuleStep } from "@/features/rules/rules-copy";

type RulesCarouselProps = {
  readonly onClose: () => void;
};

const ACCENT_BG: Record<RuleStep["accent"], string> = {
  sun: "bg-sun-100",
  rose: "bg-rose-100",
  sky: "bg-sky-100",
  leaf: "bg-leaf-100",
};

const ACCENT_RING: Record<RuleStep["accent"], string> = {
  sun: "ring-sun-400/30",
  rose: "ring-rose-400/30",
  sky: "ring-sky-500/30",
  leaf: "ring-leaf-500/30",
};

const ACCENT_ICON: Record<RuleStep["accent"], string> = {
  sun: "text-sun-400",
  rose: "text-rose-500",
  sky: "text-sky-500",
  leaf: "text-leaf-600",
};

export function RulesCarousel({ onClose }: RulesCarouselProps) {
  const [emblaRef, embla] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: false,
    skipSnaps: false,
  });
  const [selected, setSelected] = useState(0);
  const total = ruleSteps.length;

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);
  const scrollTo = useCallback(
    (index: number) => embla?.scrollTo(index),
    [embla],
  );

  useEffect(() => {
    if (!embla) {
      return;
    }

    const handler = () => setSelected(embla.selectedScrollSnap());
    handler();
    embla.on("select", handler);
    embla.on("reInit", handler);

    return () => {
      embla.off("select", handler);
      embla.off("reInit", handler);
    };
  }, [embla]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [scrollPrev, scrollNext]);

  const isFirst = selected === 0;
  const isLast = selected === total - 1;

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border-200 px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="閉じる"
          className="tap-highlight-none flex h-10 w-10 items-center justify-center rounded-2xl bg-cream-100 text-ink-900 transition active:scale-[0.97] motion-reduce:transition-none"
        >
          <XIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <h2 className="font-rounded text-lg font-extrabold text-ink-900">あそびかた</h2>
        <span className="text-sm font-rounded font-bold tabular-nums text-ink-600">
          {selected + 1}/{total}
        </span>
      </header>

      <div ref={emblaRef} className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {ruleSteps.map((step, index) => {
            const Icon: LucideIcon = step.icon;
            return (
              <article
                key={step.id}
                className="flex shrink-0 grow-0 basis-full flex-col items-center justify-center px-6 py-6 text-center"
                aria-roledescription="slide"
                aria-label={`ステップ ${index + 1} / ${total}: ${step.heading}`}
              >
                <span
                  className={cn(
                    "flex h-32 w-32 items-center justify-center rounded-full shadow-card ring-8 transition sm:h-40 sm:w-40",
                    ACCENT_BG[step.accent],
                    ACCENT_RING[step.accent],
                  )}
                  aria-hidden="true"
                >
                  <Icon className={cn("h-16 w-16 sm:h-20 sm:w-20", ACCENT_ICON[step.accent])} />
                </span>
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream-200 px-3 py-1 text-xs font-rounded font-bold text-ink-600">
                  ステップ {index + 1}
                </p>
                <h3 className="mt-3 font-rounded text-2xl font-extrabold leading-snug text-ink-900 sm:text-3xl">
                  {step.heading}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-600 sm:text-base">
                  {step.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-center gap-2 py-3">
        {ruleSteps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`ステップ ${index + 1} へ移動`}
            aria-current={index === selected ? "step" : undefined}
            className={cn(
              "h-2 rounded-full transition-all duration-300 motion-reduce:transition-none",
              index === selected
                ? "w-8 bg-leaf-500"
                : "w-2 bg-border-200 hover:bg-ink-400",
            )}
          />
        ))}
      </div>

      <footer className="flex shrink-0 items-center gap-3 border-t border-border-200 px-4 py-4">
        <button
          type="button"
          onClick={scrollPrev}
          disabled={isFirst}
          className="tap-highlight-none flex h-12 flex-1 items-center justify-center gap-1 rounded-2xl bg-cream-100 font-rounded font-bold text-ink-900 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          もどる
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={onClose}
            className="tap-highlight-none flex h-12 flex-1 items-center justify-center gap-1 rounded-2xl bg-leaf-500 font-rounded font-bold text-white shadow-cta transition active:scale-[0.98] hover:bg-leaf-600 motion-reduce:transition-none"
          >
            はじめる
            <PlayIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={scrollNext}
            className="tap-highlight-none flex h-12 flex-1 items-center justify-center gap-1 rounded-2xl bg-leaf-500 font-rounded font-bold text-white shadow-cta transition active:scale-[0.98] hover:bg-leaf-600 motion-reduce:transition-none"
          >
            つぎへ
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </footer>
    </div>
  );
}
