export const APP_NAME = "ワードッチ";
export const APP_DESCRIPTION =
  "親プレイヤーのための、ヒミツのキジュン選択・3ワード提示・タイマー進行サポートツール";

export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = "wordocchi:round-state:v1";

export const DEFAULT_TIMER_SECONDS = 5 * 60;
export const TIMER_OPTIONS_SECONDS = [3 * 60, 5 * 60, 7 * 60, 10 * 60] as const;

export const TIMER_WARNING_ONE_MINUTE = 60;
export const TIMER_WARNING_THIRTY_SECONDS = 30;
