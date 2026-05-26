import { describe, expect, it } from "vitest";

import samplePromptConfig from "@/data/sample-prompts.json";
import {
  samplePromptWords,
  samplePromptWordTexts,
  sampleSecretCriteria,
  sampleSecretCriterionTexts,
} from "@/data/sample-prompts";

const combinationWordHints = [
  "な",
  "の",
  "した",
  "った",
  "された",
  "ている",
  "そう",
  "すぎ",
  "がちな",
  "げな",
  "めいた",
  "ない",
  "たい",
  "だけ",
  "だらけ",
  "満々",
  "満点",
  "まじり",
  "何かを",
  "すぐ",
  "やたら",
  "ほぼ",
  "こっそり",
  "なぜか",
  "やけに",
  "ほどよく",
  "どこか",
  "何度も",
  "じわじわ",
  "うっすら",
  "逆に",
  "ひそかに",
  "ゆっくり",
  "むやみに",
  "最後まで",
  "ちょうどいい",
  "小声",
  "強火",
  "低空飛行",
  "まぶしい",
  "気まずい",
  "しぶい",
  "ぬるい",
  "うるさい",
  "ありがたい",
  "かしこい",
  "さわがしい",
  "むずかしい",
  "やさしい",
  "つめたい",
  "言いにくい",
  "ゆるい",
  "あやしい",
  "きびしい",
  "めでたい",
  "涙ぐましい",
  "やわらかい",
  "うす暗い",
  "うすっぺらい",
  "まっすぐ",
  "夕方",
  "丁寧に",
  "きっちり",
  "よくしゃべる",
  "えらばれし",
  "しれっと",
  "あきらかに",
  "よそゆき",
  "お腹いっぱい",
] as const;

describe("sample prompt data", () => {
  it("contains the planned amount of original sample data", () => {
    expect(sampleSecretCriteria).toHaveLength(100);
    expect(samplePromptWords).toHaveLength(300);
  });

  it("loads prompt text from the external config file", () => {
    expect(sampleSecretCriterionTexts).toEqual(samplePromptConfig.secretCriteria);
    expect(samplePromptWordTexts).toEqual(samplePromptConfig.promptWords);
  });

  it("has unique ids and prompt text", () => {
    expect(new Set(sampleSecretCriteria.map((criterion) => criterion.id)).size).toBe(100);
    expect(new Set(samplePromptWords.map((word) => word.id)).size).toBe(300);
    expect(new Set(sampleSecretCriterionTexts).size).toBe(100);
    expect(new Set(samplePromptWordTexts).size).toBe(300);
  });

  it("keeps most prompt words as playful combination phrases", () => {
    const combinationPromptWords = samplePromptWordTexts.filter((word) =>
      combinationWordHints.some((hint) => word.includes(hint)),
    );

    expect(combinationPromptWords.length).toBeGreaterThanOrEqual(240);
    expect(samplePromptWordTexts).toContain("ガラガラの居酒屋");
    expect(samplePromptWordTexts).toContain("怒り狂った校長");
  });
});
