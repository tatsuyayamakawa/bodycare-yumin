export const texts = [
  "深層筋ほぐしから",
  "自律神経を整える",
  "整体サロン",
] as const;

export type Catchphrase = (typeof texts)[number];
