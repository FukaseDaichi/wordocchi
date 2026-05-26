import samplePrompts from "./sample-prompts.json";

export type SampleSecretCriterion = {
  readonly id: string;
  readonly text: string;
};

export type SamplePromptWord = {
  readonly id: string;
  readonly text: string;
};

type SamplePromptConfig = {
  readonly secretCriteria: readonly string[];
  readonly promptWords: readonly string[];
};

const samplePromptConfig: SamplePromptConfig = samplePrompts;

// 独自作成の初期サンプルです。公式カード本文は転記しません。
// 本文はプログラムではなく sample-prompts.json で管理します。
export const sampleSecretCriterionTexts = samplePromptConfig.secretCriteria;

export const sampleSecretCriteria = sampleSecretCriterionTexts.map((text, index) => ({
  id: `criterion-${String(index + 1).padStart(3, "0")}`,
  text,
})) satisfies readonly SampleSecretCriterion[];

export const samplePromptWordTexts = samplePromptConfig.promptWords;

export const samplePromptWords = samplePromptWordTexts.map((text, index) => ({
  id: `word-${String(index + 1).padStart(3, "0")}`,
  text,
})) satisfies readonly SamplePromptWord[];
